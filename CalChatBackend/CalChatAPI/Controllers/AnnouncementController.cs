


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
            var userName = User.Identity?.Name ?? "HR";

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
                var employeeUsers = await _context.UserRoles
    .Join(_context.Roles,
        ur => ur.RoleId,
        r => r.Id,
        (ur, r) => new { ur.UserId, r.Name })
   .Where(x =>
    x.Name.ToLower() == "employee" ||
    x.Name.ToLower() == "professional"
)
    .Select(x => x.UserId)
    .ToListAsync();

                var users = await _context.Users
                    .Where(u => employeeUsers.Contains(u.Id) && u.Id != userId)
                    .ToListAsync();

              

                // ✅ CREATE NOTIFICATIONS
                var notifications = users.Select(user => new Notification
                {
                    FromUserId = userId,
                    ToUserId = user.Id,
                    FromUserName = userName,
                    Type = "announcement",
                    Content = $"📢 {model.Title} - {model.Content}",
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
                        title = model.Title,
                        content = model.Content,
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

        // ✅ GET ALL
        //[HttpGet]
        //[Authorize(Roles = "employee,professional,hr")]
        //public async Task<IActionResult> GetAnnouncements()
        //{
        //    foreach (var claim in User.Claims)
        //    {
        //        Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");
        //    }

        //    var role = User.Claims
        //        .Where(c => c.Type == ClaimTypes.Role
        //            || c.Type == "role"
        //            || c.Type.Contains("role"))
        //        .Select(c => c.Value)
        //        .FirstOrDefault()?.ToLower();

        //    Console.WriteLine("ROLE FROM TOKEN: " + role);

        //    if (string.IsNullOrEmpty(role))
        //    {
        //        return Forbid(); // 🔥 root cause check
        //    }

        //    if (role != "employee" && role != "professional" && role != "hr")
        //    {
        //        return Forbid();
        //    }

        //    var data = await _context.Announcements
        //        .OrderByDescending(a => a.CreatedAt)
        //        .ToListAsync();

        //    return Ok(data);
        //}
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
