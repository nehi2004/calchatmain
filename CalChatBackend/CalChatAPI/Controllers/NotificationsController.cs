using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using System.Security.Claims;

namespace CalChatAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class NotificationsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public NotificationsController(ApplicationDbContext context)
		{
			_context = context;
		}

		// =========================
		// GET CURRENT USER NOTIFICATIONS
		// =========================

		[HttpGet]
		public async Task<IActionResult> GetMyNotifications()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (string.IsNullOrEmpty(userId))
				return Unauthorized();

			var notifications = await _context.Notifications
				.Where(n => n.ToUserId == userId)
				.OrderByDescending(n => n.CreatedAt)
				.ToListAsync();

			return Ok(notifications);
		}

		// =========================
		// GET USER NOTIFICATIONS BY ID
		// =========================

		[HttpGet("{userId}")]
		public async Task<IActionResult> GetNotifications(string userId)
		{
			var notifications = await _context.Notifications
				.Where(n => n.ToUserId == userId)
				.OrderByDescending(n => n.CreatedAt)
				.ToListAsync();

			return Ok(notifications);
		}

		// =========================
		// SEND CHAT REQUEST
		// =========================

		[HttpPost("request")]
		public async Task<IActionResult> SendRequest(NotificationRequest request)
		{
			var already = await _context.Notifications
				.FirstOrDefaultAsync(n =>
					n.FromUserId == request.FromUserId &&
					n.ToUserId == request.ToUserId &&
					n.Type == "chat_request");

			if (already != null)
				return BadRequest("Request already sent");

			var notification = new Notification
			{
				FromUserId = request.FromUserId,
				FromUserName = request.FromUserName,
				ToUserId = request.ToUserId,
				Content = request.Content,
				Type = "chat_request",
				Status = "pending",
				IsRead = false,
				CreatedAt = DateTime.UtcNow
			};

			_context.Notifications.Add(notification);

			await _context.SaveChangesAsync();

			return Ok(notification);
		}

		// =========================
		// ACCEPT / REJECT REQUEST
		// =========================

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
		{
			var notif = await _context.Notifications.FindAsync(id);

			if (notif == null)
				return NotFound();

			notif.Status = status;

			if (status == "accepted")
			{
				var chat = new Chat
				{
					Name = "Personal Chat",
					Type = "personal",
					CreatedAt = DateTime.UtcNow
				};

				_context.Chats.Add(chat);

				await _context.SaveChangesAsync();

				_context.ChatMembers.AddRange(

					new ChatMember
					{
						ChatId = chat.Id,
						UserId = notif.FromUserId
					},

					new ChatMember
					{
						ChatId = chat.Id,
						UserId = notif.ToUserId
					}

				);
			}

			await _context.SaveChangesAsync();

			return Ok(notif);
		}

		// =========================
		// GET SENT REQUESTS
		// =========================

		[HttpGet("sent/{userId}")]
		public async Task<IActionResult> GetSentRequests(string userId)
		{
			var sent = await _context.Notifications
				.Where(n => n.FromUserId == userId && n.Type == "chat_request")
				.Select(n => n.ToUserId)
				.ToListAsync();

			return Ok(sent);
		}
        // =========================
        // CREATE GENERAL NOTIFICATION (TASK, ALERT, etc.)
        // =========================

        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] Notification model)
        {
            if (model == null)
                return BadRequest();

            model.CreatedAt = DateTime.UtcNow;
            model.IsRead = false;

            _context.Notifications.Add(model);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        // =========================
        // MARK ALL AS READ
        // =========================
        [HttpPut("mark-read/{userId}")]
        public async Task<IActionResult> MarkAllAsRead(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.ToUserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var n in notifications)
            {
                n.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}