using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CalChatAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= GET (Only user events) =================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventItem>>> GetEvents()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var events = await _context.Events
                .Where(e => e.UserId == userId)
                .ToListAsync();

            return events;
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<ActionResult<EventItem>> CreateEvent(EventItem eventItem)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            eventItem.Id = Guid.NewGuid();
            eventItem.UserId = userId!;   // 🔥 attach to user

            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvents), new { id = eventItem.Id }, eventItem);
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (eventItem == null)
                return NotFound();

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}