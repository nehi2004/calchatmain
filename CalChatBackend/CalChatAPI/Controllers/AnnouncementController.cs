//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using CalChatAPI.Data;      // ✅ apna actual namespace use karo
//using CalChatAPI.Models;    // ✅ apna actual namespace use karo

//using Microsoft.AspNetCore.SignalR;
//using CalChatAPI.Hubs;

//public class AnnouncementController : ControllerBase
//{
//    private readonly ApplicationDbContext _context;
//    private readonly IHubContext<ChatHub> _hub;

//    public AnnouncementController(ApplicationDbContext context, IHubContext<ChatHub> hub)
//    {
//        _context = context;
//        _hub = hub;
//    }

//    // ✅ POST: Create Announcement
//    [HttpPost("create")]
//        public async Task<IActionResult> CreateAnnouncement([FromBody] Announcement model)
//        {
//            if (model == null || string.IsNullOrEmpty(model.Title) || string.IsNullOrEmpty(model.Content))
//            {
//                return BadRequest("Title and Content are required.");
//            }

//            // 🔥 FORCE FIX (ignore incoming values)
//            model.Id = 0;
//            model.Status = "Published";
//            model.CreatedAt = DateTime.UtcNow; 

//            try
//            {
//            _context.Announcements.Add(model);
//            await _context.SaveChangesAsync();


//            // 🔥 GET ALL EMPLOYEES (NOT HR)
//            var employees = await _context.Users
//                .Where(u => u.Id != User.FindFirstValue(ClaimTypes.NameIdentifier)) // HR skip
//                .ToListAsync();

//            // 🔥 CREATE NOTIFICATIONS
//            var notifications = employees.Select(user => new Notification
//            {
//                FromUserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
//                ToUserId = user.Id,
//                FromUserName = User.Identity?.Name ?? "HR",
//                Type = "announcement",
//                Content = $"📢 {model.Title} - {model.Content}",
//                Status = "info",
//                IsRead = false,
//                CreatedAt = DateTime.UtcNow
//            }).ToList();

//            _context.Notifications.AddRange(notifications);
//            await _context.SaveChangesAsync();


//            // 🔥 SIGNALR PUSH (REAL-TIME)
//            foreach (var user in employees)
//            {
//                await _hub.Clients.User(user.Id).SendAsync("ReceiveNotification", new
//                {
//                    type = "announcement",
//                    title = model.Title,
//                    content = model.Content,
//                    createdAt = DateTime.UtcNow
//                });
//            }

//            return Ok(model);
//        }
//            //catch (Exception ex)
//            //{
//            //    return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
//            //}
//            catch (Exception ex)
//            {
//                return StatusCode(500, ex.ToString()); // FULL ERROR SHOW karega
//            }
//        }

//        // ✅ GET: All Announcements
//        [HttpGet]
//        public async Task<IActionResult> GetAnnouncements()
//        {
//            try
//            {
//                var data = await _context.Announcements
//                    .OrderByDescending(a => a.CreatedAt)
//                    .ToListAsync();

//            return Ok(data);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"Error fetching data: {ex.Message}");
//            }
//        }

//        // ✅ DELETE (optional but useful)
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteAnnouncement(int id)
//        {
//            var announcement = await _context.Announcements.FindAsync(id);

//            if (announcement == null)
//                return NotFound("Announcement not found");

//            _context.Announcements.Remove(announcement);
//            await _context.SaveChangesAsync();

//            return Ok("Deleted successfully");
//        }
//    }
//}



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
    .Where(x => x.Name == "employee")
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
        [HttpGet]
        public async Task<IActionResult> GetAnnouncements()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // 🔥 GET USER ROLES
            var roles = await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Join(_context.Roles,
                    ur => ur.RoleId,
                    r => r.Id,
                    (ur, r) => r.Name)
                .ToListAsync();

            // 🚫 BLOCK NON-EMPLOYEES
            if (!roles.Contains("employee"))
            {
                return Forbid(); // 🔥 VERY IMPORTANT
            }

            var data = await _context.Announcements
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

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
