using Microsoft.AspNetCore.Mvc;
using CalChatAPI.Data;
using CalChatAPI.Models;
using CalChatAPI.DTOs;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using CalChatAPI.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace CalChatAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ChatHub> _hub;

        // ✅ ONLY ONE CONSTRUCTOR
        public NotesController(ApplicationDbContext context, IHubContext<ChatHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        // ✅ CREATE NOTE + NOTIFICATION + REALTIME
        [HttpPost("create")]
        public async Task<IActionResult> CreateNote(CreateNoteDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = User.Identity?.Name ?? "User";

            if (userId == null)
                return Unauthorized();

            var note = new Note
            {
                Title = dto.Title,
                Content = dto.Content,
                Category = dto.Category,
                CreatedById = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            // ✅ SAVE MAPPINGS
            foreach (var uid in dto.UserIds)
            {
                _context.NoteUsers.Add(new NoteUser
                {
                    NoteId = note.Id,
                    UserId = uid
                });
            }

            // ✅ CREATE NOTIFICATIONS
            // 🔥 GET USER NAME ONCE (TOP OF METHOD)
            var user = await _context.Users.FindAsync(userId);

            foreach (var uid in dto.UserIds)
            {
                var notification = new Notification
                {
                    FromUserId = userId,
                    ToUserId = uid,
                    FromUserName = user?.Name ?? "User",
                    Content = $"shared a note: {note.Title}",
                    Type = "note",
                    Status = "sent",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notifications.Add(notification);
            }

            // ✅ SAVE EVERYTHING ONCE
            await _context.SaveChangesAsync();

            // ✅ 🚀 REAL-TIME NOTIFICATION (SignalR)
            foreach (var uid in dto.UserIds)
            {
                await _hub.Clients.User(uid).SendAsync("ReceiveNotification", new
                {
                    message = $"📌 New note shared: {note.Title}",
                    noteId = note.Id
                });
            }

            return Ok(new { message = "✅ Note created & notifications sent" });
        }

        // ✅ GET NOTES
        [HttpGet]
        public async Task<IActionResult> GetMyNotes()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var notes = await _context.Notes
                .Include(n => n.NoteUsers)
                .Where(n =>
                    n.CreatedById == userId ||
                    n.NoteUsers.Any(nu => nu.UserId == userId)
                )
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.Category,
                    Date = n.CreatedAt
                })
                .ToListAsync();

            return Ok(notes);
        }

        // ✅ DELETE NOTE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
                return NotFound();

            var mappings = _context.NoteUsers.Where(nu => nu.NoteId == id);
            _context.NoteUsers.RemoveRange(mappings);

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return Ok(new { message = "🗑️ Note deleted" });
        }

        // ✅ UPDATE NOTE
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, CreateNoteDto dto)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
                return NotFound();

            note.Title = dto.Title;
            note.Content = dto.Content;
            note.Category = dto.Category;

            // remove old mappings
            var oldMappings = _context.NoteUsers.Where(nu => nu.NoteId == id);
            _context.NoteUsers.RemoveRange(oldMappings);

            // add new mappings
            foreach (var uid in dto.UserIds)
            {
                _context.NoteUsers.Add(new NoteUser
                {
                    NoteId = id,
                    UserId = uid
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "✏️ Note updated" });
        }
    }
}