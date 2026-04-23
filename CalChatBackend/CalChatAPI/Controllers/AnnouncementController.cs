using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.AspNetCore.SignalR;
using CalChatAPI.Hubs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CalChatAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ChatHub> _hub;

        public AnnouncementController(ApplicationDbContext context, IHubContext<ChatHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        // ✅ CREATE ANNOUNCEMENT
        [HttpPost("create")]
        public async Task<IActionResult> CreateAnnouncement([FromBody] Announcement model)
        {
            if (model == null || string.IsNullOrEmpty(model.Title) || string.IsNullOrEmpty(model.Content))
            {
                return BadRequest("Title and Content are required.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var creator = await _context.Users.FindAsync(userId);
            var userName = creator?.Name ?? User.Identity?.Name ?? "HR";


            // 🔥 FORCE FIX
            model.Id = 0;
            model.Status = "Published";
            model.CreatedAt = DateTime.UtcNow;

            try
            {
                // ✅ SAVE ANNOUNCEMENT
                _context.Announcements.Add(model);
                await _context.SaveChangesAsync();

                // ✅ GET ALL EMPLOYEES (EXCEPT CREATOR)
                var audience = (model.Audience ?? "").ToLower();

                var targetRoleNames = audience switch
                {
                    "employee" => new[] { "employee" },
                    "professional" => new[] { "professional" },
                    _ => new[] { "employee", "professional" }
                };

                var targetUserIds = await _context.UserRoles
                    .Join(_context.Roles,
                        ur => ur.RoleId,
                        r => r.Id,
                        (ur, r) => new { ur.UserId, RoleName = r.Name.ToLower() })
                    .Where(x => targetRoleNames.Contains(x.RoleName))
                    .Select(x => x.UserId)
                    .Distinct()
                    .ToListAsync();

                var users = await _context.Users
                    .Where(u => targetUserIds.Contains(u.Id) && u.Id != userId)
                    .ToListAsync();




                // ✅ CREATE NOTIFICATIONS
                var notifications = users.Select(user => new Notification
                {
                    FromUserId = userId,
                    ToUserId = user.Id,
                    FromUserName = userName,
                    Type = "announcement",
                    Content = $"{userName} shared an announcement: {model.Title}",
                    Status = "info",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                }).ToList();


                _context.Notifications.AddRange(notifications);
                await _context.SaveChangesAsync();

                // ✅ 🚀 REAL-TIME SIGNALR
                foreach (var user in users)
                {
                    await _hub.Clients.User(user.Id).SendAsync("ReceiveNotification", new
                    {
                        type = "announcement",
                        fromUserId = userId,
                        createdByName = userName,
                        fromUserName = userName,
                        title = model.Title,
                        content = $"{userName} shared an announcement: {model.Title}",
                        createdAt = DateTime.UtcNow
                    });
                }


                return Ok(new
                {
                    message = "✅ Announcement created & notifications sent",
                    data = model
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }


        [HttpGet]
        // [Authorize] ❌ remove this
        public async Task<IActionResult> GetAnnouncements()
        {
            var data = await _context.Announcements.ToListAsync();
            return Ok(data);
        }
        // ✅ DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);

            if (announcement == null)
                return NotFound("Announcement not found");

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return Ok("🗑️ Deleted successfully");
        }
    }
}