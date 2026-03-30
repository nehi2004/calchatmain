//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Claims;
//using CalChatAPI.Data;
//using CalChatAPI.Models;


////namespace CalChatAPI.Controllers
////{
////    [Route("api/[controller]")]
////    [ApiController]
////    public class CalendarEventsController : ControllerBase

//using Microsoft.AspNetCore.Authorization;

//[Authorize]
//[Route("api/[controller]")]
//[ApiController]
//public class CalendarEventsController : ControllerBase
//{
//        private readonly ApplicationDbContext _context;

//        public CalendarEventsController(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        //[HttpGet]
//        //public async Task<ActionResult<IEnumerable<CalendarEvent>>> GetEvents()
//        //{
//        //    return await _context.CalendarEvents.ToListAsync();
//        //}


//    using Microsoft.AspNetCore.Authorization;
//using System.Security.Claims;

//[Authorize]
//[HttpGet]
//public async Task<ActionResult<IEnumerable<CalendarEvent>>> GetEvents()
//{
//    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//    if (string.IsNullOrEmpty(userId))
//        return Unauthorized("User ID not found in token.");

//    var userRole = User.FindFirstValue(ClaimTypes.Role);

//    // If Admin → return all data
//    if (userRole == "admin")
//    {
//        return await _context.CalendarEvents
//            .OrderBy(e => e.Date)
//            .ToListAsync();
//    }

//    // Other roles → return only their own data
//    return await _context.CalendarEvents
//        .Where(e => e.UserId == userId)
//        .OrderBy(e => e.Date)
//        .ToListAsync();
//}

////[HttpPost]
////public async Task<ActionResult<CalendarEvent>> Create(CalendarEvent ev)
////{
////    ev.Id = Guid.NewGuid();
////    _context.CalendarEvents.Add(ev);
////    await _context.SaveChangesAsync();
////    return Ok(ev);
////}

////[HttpPost]
////public async Task<IActionResult> Create(CreateCalendarEventDto dto)
////{
////    try
////    {
////        var ev = new CalendarEvent
////        {
////            Id = Guid.NewGuid(),
////            Title = dto.Title,
////            Date = dto.Date,
////            Time = dto.Time,
////            Type = dto.Type,
////            Priority = dto.Priority,
////            Color = dto.Color,
////            UserId = "default-user"
////        };

////        _context.CalendarEvents.Add(ev);
////        await _context.SaveChangesAsync();

////        return Ok(ev);
////    }
////    catch (Exception ex)
////    {
////        return StatusCode(500, ex.ToString()); // 👈 IMPORTANT
////    }
////}



//[HttpPost]
//    public async Task<IActionResult> Create(CreateCalendarEventDto dto)
//    {
//        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//        if (string.IsNullOrEmpty(userId))
//            return Unauthorized();

//        var ev = new CalendarEvent
//        {
//            Id = Guid.NewGuid(),
//            Title = dto.Title,
//            Date = dto.Date,
//            Time = dto.Time,
//            Type = dto.Type,
//            Priority = dto.Priority,
//            Color = dto.Color,
//            UserId = userId
//        };

//        _context.CalendarEvents.Add(ev);
//        await _context.SaveChangesAsync();

//        return Ok(ev);
//    }


//    [HttpPut("{id}")]
//        public async Task<IActionResult> Update(Guid id, CalendarEvent ev)
//        {
//            var existing = await _context.CalendarEvents.FindAsync(id);
//            if (existing == null) return NotFound();

//            existing.Title = ev.Title;
//            existing.Date = ev.Date;
//            existing.Time = ev.Time;
//            existing.Type = ev.Type;
//            existing.Priority = ev.Priority;
//            existing.Color = ev.Color;

//            await _context.SaveChangesAsync();
//            return NoContent();
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(Guid id)
//        {
//            var ev = await _context.CalendarEvents.FindAsync(id);
//            if (ev == null) return NotFound();

//            _context.CalendarEvents.Remove(ev);
//            await _context.SaveChangesAsync();
//            return NoContent();
//        }
//    }
//}

//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using System.Security.Claims;

//namespace CalChatAPI.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [Authorize]
//    public class CalendarEventsController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;

//        public CalendarEventsController(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/CalendarEvents
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<CalendarEvent>>> GetEvents()
//        {
//            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            return events;
//        }

//        // GET: api/CalendarEvents/{id}
//        [HttpGet("{id}")]
//        public async Task<ActionResult<CalendarEvent>> GetEvent(Guid id)
//        {
//            var calendarEvent = await _context.CalendarEvents.FindAsync(id);

//            if (calendarEvent == null)
//                return NotFound();

//            return calendarEvent;
//        }

//        // POST: api/CalendarEvents
//        [HttpPost]
//        public async Task<ActionResult<CalendarEvent>> PostEvent(CalendarEvent calendarEvent)
//        {
//            try
//            {
//                calendarEvent.Id = Guid.NewGuid();
//                calendarEvent.UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//                calendarEvent.Created_At = DateTimeOffset.UtcNow;

//                // Ensure Date is UTC
//                //calendarEvent.Date = calendarEvent.Date.ToUniversalTime();

//                _context.CalendarEvents.Add(calendarEvent);
//                await _context.SaveChangesAsync();

//                return CreatedAtAction(nameof(GetEvent), new { id = calendarEvent.Id }, calendarEvent);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, ex.Message);
//            }
//        }


//        // PUT: api/CalendarEvents/{id}
//        [HttpPut("{id}")]
//        public async Task<IActionResult> PutEvent(Guid id, CalendarEvent calendarEvent)
//        {
//            if (id != calendarEvent.Id)
//                return BadRequest();

//            var existingEvent = await _context.CalendarEvents.FindAsync(id);

//            if (existingEvent == null)
//                return NotFound();

//            existingEvent.Title = calendarEvent.Title;
//            existingEvent.Date = calendarEvent.Date;
//            existingEvent.Time = calendarEvent.Time;
//            existingEvent.Type = calendarEvent.Type;
//            existingEvent.Priority = calendarEvent.Priority;
//            existingEvent.Color = calendarEvent.Color;

//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        // DELETE: api/CalendarEvents/{id}
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteEvent(Guid id)
//        {
//            var calendarEvent = await _context.CalendarEvents.FindAsync(id);

//            if (calendarEvent == null)
//                return NotFound();

//            _context.CalendarEvents.Remove(calendarEvent);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }
//    }
//}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using System.Security.Claims;

namespace CalChatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CalendarEventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CalendarEventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET EVENTS
        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var events = await _context.CalendarEvents
                .Where(e => e.UserId == userId)
                .OrderBy(e => e.Date)
                .ToListAsync();

            return Ok(events);
        }

        // CREATE EVENT
        [HttpPost]
        public async Task<IActionResult> CreateEvent(CalendarEvent ev)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            ev.Id = Guid.NewGuid();
            ev.UserId = userId;

            ev.Date = DateTime.SpecifyKind(ev.Date.Date, DateTimeKind.Utc);


            ev.Created_At = DateTimeOffset.UtcNow;


            _context.CalendarEvents.Add(ev);
            await _context.SaveChangesAsync();



            return Ok(ev);
        }

        // UPDATE EVENT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(Guid id, CalendarEvent updated)
        {
            var ev = await _context.CalendarEvents.FindAsync(id);

            if (ev == null) return NotFound();

            ev.Title = updated.Title;
            ev.Date = updated.Date;
            ev.Time = updated.Time;
            ev.Type = updated.Type;
            ev.Priority = updated.Priority;
            ev.Color = updated.Color;
            ev.ReminderMinutes = updated.ReminderMinutes;

            await _context.SaveChangesAsync();

            return Ok(ev);
        }

        // DELETE EVENT
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            var ev = await _context.CalendarEvents.FindAsync(id);

            if (ev == null) return NotFound();

            _context.CalendarEvents.Remove(ev);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

