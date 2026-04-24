//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.AspNetCore.Authorization;
//using System.Security.Claims;

//namespace CalChatAPI.Controllers
//{
//    [Authorize]
//    [Route("api/[controller]")]
//    [ApiController]
//    public class EventsController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;

//        public EventsController(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        // ================= GET (Only user events) =================
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<EventItem>>> GetEvents()
//        {
//            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//            var events = await _context.Events
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            return events;
//        }

//        // ================= CREATE =================
//        [HttpPost]
//        public async Task<ActionResult<EventItem>> CreateEvent(EventItem eventItem)
//        {
//            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//            eventItem.Id = Guid.NewGuid();
//            eventItem.UserId = userId!;   // 🔥 attach to user

//            _context.Events.Add(eventItem);
//            await _context.SaveChangesAsync();

//            return CreatedAtAction(nameof(GetEvents), new { id = eventItem.Id }, eventItem);
//        }

//        // ================= DELETE =================
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteEvent(Guid id)
//        {
//            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//            var eventItem = await _context.Events
//                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

//            if (eventItem == null)
//                return NotFound();

//            _context.Events.Remove(eventItem);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }
//    }
//}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
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

        public class EventCreateUpdateDto
        {
            [Required]
            [MaxLength(200)]
            public string Title { get; set; } = string.Empty;

            [Required]
            public DateTime Date { get; set; }

            [MaxLength(50)]
            public string? Time { get; set; }

            [MaxLength(200)]
            public string? Location { get; set; }

            [Range(0, 100000)]
            public int Attendees { get; set; }

            [MaxLength(100)]
            public string? Type { get; set; }

            [MaxLength(50)]
            public string? Status { get; set; }
        }

        public class EventResponseDto
        {
            public Guid Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public DateTime? Date { get; set; }
            public string Time { get; set; } = string.Empty;
            public string Location { get; set; } = string.Empty;
            public int Attendees { get; set; }
            public string Type { get; set; } = "General";
            public string Status { get; set; } = "Upcoming";
        }

        private static string ResolveStatus(DateTime? date, string? existingStatus)
        {
            if (!string.IsNullOrWhiteSpace(existingStatus) &&
                existingStatus.Trim().Equals("Cancelled", StringComparison.OrdinalIgnoreCase))
            {
                return "Cancelled";
            }

            if (!date.HasValue)
                return "Upcoming";

            var today = DateTime.Today;
            var eventDate = date.Value.Date;

            if (eventDate < today) return "Past";
            if (eventDate == today) return "Today";
            return "Upcoming";
        }

        private static EventResponseDto MapToDto(EventItem eventItem)
        {
            return new EventResponseDto
            {
                Id = eventItem.Id,
                Title = eventItem.Title ?? string.Empty,
                Date = eventItem.Date,
                Time = eventItem.Time ?? string.Empty,
                Location = eventItem.Location ?? string.Empty,
                Attendees = eventItem.Attendees,
                Type = string.IsNullOrWhiteSpace(eventItem.Type) ? "General" : eventItem.Type,
                Status = ResolveStatus(eventItem.Date, eventItem.Status)
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventResponseDto>>> GetEvents()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var events = await _context.Events
                .Where(e => e.UserId == userId)
                .OrderBy(e => e.Date)
                .ToListAsync();

            return Ok(events.Select(MapToDto));
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EventResponseDto>> GetEvent(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (eventItem == null)
                return NotFound();

            return Ok(MapToDto(eventItem));
        }

        [HttpPost]
        public async Task<ActionResult<EventResponseDto>> CreateEvent([FromBody] EventCreateUpdateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var eventItem = new EventItem
            {
                Id = Guid.NewGuid(),
                UserId = userId!,
                Title = dto.Title.Trim(),
                Date = dto.Date,
                Time = dto.Time?.Trim() ?? string.Empty,
                Location = dto.Location?.Trim() ?? string.Empty,
                Attendees = dto.Attendees,
                Type = string.IsNullOrWhiteSpace(dto.Type) ? "General" : dto.Type.Trim(),
                Status = string.IsNullOrWhiteSpace(dto.Status)
                    ? ResolveStatus(dto.Date, null)
                    : dto.Status.Trim()
            };

            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Id }, MapToDto(eventItem));
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] EventCreateUpdateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

            if (eventItem == null)
                return NotFound();

            eventItem.Title = dto.Title.Trim();
            eventItem.Date = dto.Date;
            eventItem.Time = dto.Time?.Trim() ?? string.Empty;
            eventItem.Location = dto.Location?.Trim() ?? string.Empty;
            eventItem.Attendees = dto.Attendees;
            eventItem.Type = string.IsNullOrWhiteSpace(dto.Type) ? "General" : dto.Type.Trim();
            eventItem.Status = string.IsNullOrWhiteSpace(dto.Status)
                ? ResolveStatus(dto.Date, null)
                : dto.Status.Trim();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
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
