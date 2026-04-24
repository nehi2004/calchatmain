//using Microsoft.AspNetCore.Mvc;
//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using CalChatAPI.DTOs;
//using System.Security.Claims;
//using Microsoft.EntityFrameworkCore;
//using System.Linq;
//using Microsoft.AspNetCore.Authorization;
//using CalChatAPI.Hubs;
//using Microsoft.AspNetCore.SignalR;

//namespace CalChatAPI.Controllers
//{
//    [Authorize]
//    [Route("api/[controller]")]
//    [ApiController]
//    public class NotesController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly IHubContext<ChatHub> _hub;

//        // ✅ ONLY ONE CONSTRUCTOR
//        public NotesController(ApplicationDbContext context, IHubContext<ChatHub> hub)
//        {
//            _context = context;
//            _hub = hub;
//        }

//        // ✅ CREATE NOTE + NOTIFICATION + REALTIME
//        [HttpPost("create")]
//        public async Task<IActionResult> CreateNote(CreateNoteDto dto)
//        {
//            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//            var userName = User.Identity?.Name ?? "User";

//            if (userId == null)
//                return Unauthorized();

//            var note = new Note
//            {
//                Title = dto.Title,
//                Content = dto.Content,
//                Category = dto.Category,
//                CreatedById = userId,
//                CreatedAt = DateTime.UtcNow
//            };

//            _context.Notes.Add(note);
//            await _context.SaveChangesAsync();

//            // ✅ SAVE MAPPINGS
//            foreach (var uid in dto.UserIds)
//            {
//                _context.NoteUsers.Add(new NoteUser
//                {
//                    NoteId = note.Id,
//                    UserId = uid
//                });
//            }

//            // ✅ CREATE NOTIFICATIONS
//            // 🔥 GET USER NAME ONCE (TOP OF METHOD)
//            var user = await _context.Users.FindAsync(userId);

//            foreach (var uid in dto.UserIds)
//            {
//                var notification = new Notification
//                {
//                    FromUserId = userId,
//                    ToUserId = uid,
//                    FromUserName = user?.Name ?? "User",
//                    Content = $"shared a note: {note.Title}",
//                    Type = "note",
//                    Status = "sent",
//                    IsRead = false,
//                    CreatedAt = DateTime.UtcNow
//                };

//                _context.Notifications.Add(notification);
//            }

//            // ✅ SAVE EVERYTHING ONCE
//            await _context.SaveChangesAsync();

//            // ✅ 🚀 REAL-TIME NOTIFICATION (SignalR)
//            foreach (var uid in dto.UserIds)
//            {
//                await _hub.Clients.User(uid).SendAsync("ReceiveNotification", new
//                {
//                    message = $"📌 New note shared: {note.Title}",
//                    noteId = note.Id
//                });
//            }

//            return Ok(new { message = "✅ Note created & notifications sent" });
//        }

//        // ✅ GET NOTES
//        [HttpGet]
//        public async Task<IActionResult> GetMyNotes()
//        {
//            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            var notes = await _context.Notes
//                .Include(n => n.NoteUsers)
//                .Where(n =>
//                    n.CreatedById == userId ||
//                    n.NoteUsers.Any(nu => nu.UserId == userId)
//                )
//                .Select(n => new
//                {
//                    n.Id,
//                    n.Title,
//                    n.Content,
//                    n.Category,
//                    Date = n.CreatedAt
//                })
//                .ToListAsync();

//            return Ok(notes);
//        }

//        // ✅ DELETE NOTE
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteNote(int id)
//        {
//            var note = await _context.Notes.FindAsync(id);

//            if (note == null)
//                return NotFound();

//            var mappings = _context.NoteUsers.Where(nu => nu.NoteId == id);
//            _context.NoteUsers.RemoveRange(mappings);

//            _context.Notes.Remove(note);
//            await _context.SaveChangesAsync();

//            return Ok(new { message = "🗑️ Note deleted" });
//        }

//        // ✅ UPDATE NOTE
//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateNote(int id, CreateNoteDto dto)
//        {
//            var note = await _context.Notes.FindAsync(id);

//            if (note == null)
//                return NotFound();

//            note.Title = dto.Title;
//            note.Content = dto.Content;
//            note.Category = dto.Category;

//            // remove old mappings
//            var oldMappings = _context.NoteUsers.Where(nu => nu.NoteId == id);
//            _context.NoteUsers.RemoveRange(oldMappings);

//            // add new mappings
//            foreach (var uid in dto.UserIds)
//            {
//                _context.NoteUsers.Add(new NoteUser
//                {
//                    NoteId = id,
//                    UserId = uid
//                });
//            }

//            await _context.SaveChangesAsync();

//            return Ok(new { message = "✏️ Note updated" });
//        }
//    }
//}
using Microsoft.AspNetCore.Mvc;
using CalChatAPI.Data;
using CalChatAPI.Models;
using CalChatAPI.DTOs;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
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

        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png"
        };

        private const long MaxFileSize = 10 * 1024 * 1024;

        public NotesController(
            ApplicationDbContext context,
            IHubContext<ChatHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateNote([FromForm] CreateNoteFormDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Title is required" });

            if (dto.UserIds == null || !dto.UserIds.Any())
                return BadRequest(new { message = "At least one employee is required" });

            try
            {
                var note = new Note
                {
                    Title = dto.Title.Trim(),
                    Content = dto.Content?.Trim() ?? string.Empty,
                    Category = string.IsNullOrWhiteSpace(dto.Category) ? "Work" : dto.Category.Trim(),
                    CreatedById = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Notes.Add(note);
                await _context.SaveChangesAsync();

                foreach (var uid in dto.UserIds.Distinct())
                {
                    _context.NoteUsers.Add(new NoteUser
                    {
                        NoteId = note.Id,
                        UserId = uid
                    });
                }

                var attachments = await SaveAttachmentsAsync(dto.Files, note.Id);
                if (attachments.Any())
                {
                    _context.NoteAttachments.AddRange(attachments);
                }

                var user = await _context.Users.FindAsync(userId);

                foreach (var uid in dto.UserIds.Distinct())
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

                await _context.SaveChangesAsync();

                foreach (var uid in dto.UserIds.Distinct())
                {
                    await _hub.Clients.User(uid).SendAsync("ReceiveNotification", new
                    {
                        message = $"New note shared: {note.Title}",
                        noteId = note.Id
                    });
                }

                return Ok(new { message = "Note created and attachments uploaded successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotes()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var notes = await _context.Notes
                .Include(n => n.NoteUsers)
                .Include(n => n.Attachments)
                .Where(n =>
                    n.CreatedById == userId ||
                    n.NoteUsers.Any(nu => nu.UserId == userId)
                )
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.Category,
                    Date = n.CreatedAt,
                    CreatedById = n.CreatedById,
                    UserIds = n.NoteUsers.Select(nu => nu.UserId).ToList(),
                    Attachments = n.Attachments.Select(a => new
                    {
                        a.Id,
                        a.OriginalFileName,
                        a.ContentType,
                        a.FileSize,
                        a.FilePath
                    }).ToList()
                })
                .ToListAsync();

            return Ok(notes);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var note = await _context.Notes
                .Include(n => n.Attachments)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (note == null)
                return NotFound();

            if (note.CreatedById != userId)
                return Forbid();

            var mappings = _context.NoteUsers.Where(nu => nu.NoteId == id);
            _context.NoteUsers.RemoveRange(mappings);

            if (note.Attachments.Any())
            {
                _context.NoteAttachments.RemoveRange(note.Attachments);
            }

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Note deleted successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromForm] CreateNoteFormDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Title is required" });

            if (dto.UserIds == null || !dto.UserIds.Any())
                return BadRequest(new { message = "At least one employee is required" });

            var note = await _context.Notes
                .Include(n => n.NoteUsers)
                .Include(n => n.Attachments)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (note == null)
                return NotFound();

            if (note.CreatedById != userId)
                return Forbid();

            try
            {
                note.Title = dto.Title.Trim();
                note.Content = dto.Content?.Trim() ?? string.Empty;
                note.Category = string.IsNullOrWhiteSpace(dto.Category) ? "Work" : dto.Category.Trim();

                var oldMappings = _context.NoteUsers.Where(nu => nu.NoteId == id);
                _context.NoteUsers.RemoveRange(oldMappings);

                foreach (var uid in dto.UserIds.Distinct())
                {
                    _context.NoteUsers.Add(new NoteUser
                    {
                        NoteId = id,
                        UserId = uid
                    });
                }

                var attachments = await SaveAttachmentsAsync(dto.Files, id);
                if (attachments.Any())
                {
                    _context.NoteAttachments.AddRange(attachments);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Note updated successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("attachment/{attachmentId}/view")]
        public async Task<IActionResult> ViewAttachment(int attachmentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var attachment = await _context.NoteAttachments
                .Include(a => a.Note)
                .ThenInclude(n => n.NoteUsers)
                .FirstOrDefaultAsync(a => a.Id == attachmentId);

            if (attachment == null)
                return NotFound(new { message = "Attachment not found" });

            var canAccess =
                attachment.Note.CreatedById == userId ||
                attachment.Note.NoteUsers.Any(nu => nu.UserId == userId);

            if (!canAccess)
                return Forbid();

            if (attachment.FileData == null || attachment.FileData.Length == 0)
                return NotFound(new { message = "File content not found. Please re-upload this attachment." });

            return File(attachment.FileData, attachment.ContentType, enableRangeProcessing: true);
        }

        [HttpGet("attachment/{attachmentId}/download")]
        public async Task<IActionResult> DownloadAttachment(int attachmentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var attachment = await _context.NoteAttachments
                .Include(a => a.Note)
                .ThenInclude(n => n.NoteUsers)
                .FirstOrDefaultAsync(a => a.Id == attachmentId);

            if (attachment == null)
                return NotFound(new { message = "Attachment not found" });

            var canAccess =
                attachment.Note.CreatedById == userId ||
                attachment.Note.NoteUsers.Any(nu => nu.UserId == userId);

            if (!canAccess)
                return Forbid();

            if (attachment.FileData == null || attachment.FileData.Length == 0)
                return NotFound(new { message = "File content not found. Please re-upload this attachment." });

            return File(attachment.FileData, attachment.ContentType, attachment.OriginalFileName);
        }

        [HttpDelete("attachment/{attachmentId}")]
        public async Task<IActionResult> DeleteAttachment(int attachmentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var attachment = await _context.NoteAttachments
                .Include(a => a.Note)
                .FirstOrDefaultAsync(a => a.Id == attachmentId);

            if (attachment == null)
                return NotFound(new { message = "Attachment not found" });

            if (attachment.Note.CreatedById != userId)
                return Forbid();

            _context.NoteAttachments.Remove(attachment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Attachment deleted successfully" });
        }

        private async Task<List<NoteAttachment>> SaveAttachmentsAsync(List<IFormFile> files, int noteId)
        {
            var attachments = new List<NoteAttachment>();

            if (files == null || !files.Any())
                return attachments;

            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                    continue;

                var extension = Path.GetExtension(file.FileName);
                if (!AllowedExtensions.Contains(extension))
                    throw new InvalidOperationException($"File type not allowed: {file.FileName}");

                if (file.Length > MaxFileSize)
                    throw new InvalidOperationException($"File too large: {file.FileName}");

                await using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);

                attachments.Add(new NoteAttachment
                {
                    NoteId = noteId,
                    OriginalFileName = file.FileName,
                    StoredFileName = $"{Guid.NewGuid()}{extension}",
                    ContentType = file.ContentType,
                    FileSize = file.Length,
                    FilePath = string.Empty,
                    UploadedAt = DateTime.UtcNow,
                    FileData = memoryStream.ToArray()
                });
            }

            return attachments;
        }
    }
}
