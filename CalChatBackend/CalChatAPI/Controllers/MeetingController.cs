//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Claims;

//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using CalChatAPI.DTOs;

//[Route("api/[controller]")]
//[ApiController]
//public class MeetingController : ControllerBase
//{
//    private readonly ApplicationDbContext _context;

//    public MeetingController(ApplicationDbContext context)
//    {
//        _context = context;
//    }

//    // ✅ CREATE MEETING (HR ONLY)
//    [Authorize(Roles = "hr")]
//    [HttpPost("create")]
//    public async Task<IActionResult> CreateMeeting(CreateMeetingDto dto)
//    {
//        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//        // 🔥🔥 MAIN FIX (Convert to UTC)
//        dto.StartTime = dto.StartTime.ToUniversalTime();
//        dto.EndTime = dto.EndTime.ToUniversalTime();

//        if (dto.StartTime >= dto.EndTime)
//            return BadRequest("Start time must be before end time");

//        if (dto.StartTime < DateTimeOffset.UtcNow)
//            return BadRequest("Meeting cannot be in the past");

//        var meeting = new Meeting
//        {
//            Title = dto.Title,
//            StartTime = dto.StartTime,
//            EndTime = dto.EndTime,
//            MeetingLink = dto.MeetingLink,
//            OrganizerId = userId
//        };

//        _context.Meetings.Add(meeting);
//        await _context.SaveChangesAsync();

//        foreach (var user in dto.ParticipantIds)
//        {
//            _context.MeetingParticipants.Add(new MeetingParticipant
//            {
//                MeetingId = meeting.Id,
//                UserId = user
//            });
//        }

//        _context.MeetingParticipants.Add(new MeetingParticipant
//        {
//            MeetingId = meeting.Id,
//            UserId = userId
//        });

//        await _context.SaveChangesAsync();

//        return Ok();
//    }

//    // 🔔 SEND NOTIFICATION TO PARTICIPANTS
//foreach (var user in dto.ParticipantIds)
//{
//    _context.Notifications.Add(new Notification
//    {
//        FromUserId = userId,
//        ToUserId = user,
//        FromUserName = User.Identity.Name, // optional
//        Type = "meeting",
//        Content = $"📅 New meeting scheduled: {dto.Title} at {dto.StartTime.ToLocalTime():dd MMM yyyy hh:mm tt}",
//        Status = "info",
//        IsRead = false,
//        CreatedAt = DateTime.UtcNow
//    });
//}

//await _context.SaveChangesAsync();

//// ✅ GET USER MEETINGS
//[Authorize]
//    [HttpGet("my-meetings")]
//    public async Task<IActionResult> GetMyMeetings()
//    {
//        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//        var meetings = await _context.Meetings
//            .Include(m => m.Participants) // ✅ IMPORTANT
//            .Where(m => m.Participants.Any(p => p.UserId == userId))
//            .Select(m => new MeetingResponseDto
//            {
//                Id = m.Id,
//                Title = m.Title,
//                StartTime = m.StartTime,
//                EndTime = m.EndTime,
//                MeetingLink = m.MeetingLink,

//                // ✅ THIS IS THE FIX
//                ParticipantIds = m.Participants
//                    .Select(p => p.UserId)
//                    .ToList()
//            })
//            .ToListAsync();

//        return Ok(meetings);
//    }
//    [Authorize(Roles = "hr")]
//    [HttpGet("users")]
//    public async Task<IActionResult> GetUsers()
//    {
//        var users = await _context.Users
//            .Select(u => new {
//                u.Id,
//                u.FullName,
//                u.Email
//            })
//            .ToListAsync();

//        return Ok(users);
//    }


//}











using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using CalChatAPI.Data;
using CalChatAPI.Models;
using CalChatAPI.DTOs;

[Route("api/[controller]")]
[ApiController]
public class MeetingController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MeetingController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ CREATE MEETING (HR ONLY)
    [Authorize(Roles = "hr")]
    [HttpPost("create")]
    public async Task<IActionResult> CreateMeeting(CreateMeetingDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // ✅ Convert to UTC
        dto.StartTime = dto.StartTime.ToUniversalTime();
        dto.EndTime = dto.EndTime.ToUniversalTime();

        if (dto.StartTime >= dto.EndTime)
            return BadRequest("Start time must be before end time");

        if (dto.StartTime < DateTimeOffset.UtcNow)
            return BadRequest("Meeting cannot be in the past");

        var meeting = new Meeting
        {
            Title = dto.Title,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            MeetingLink = dto.MeetingLink,
            OrganizerId = userId
        };

        _context.Meetings.Add(meeting);
        await _context.SaveChangesAsync();

        // ✅ ADD PARTICIPANTS + NOTIFICATIONS
        foreach (var user in dto.ParticipantIds)
        {
            // 👥 Add participant
            _context.MeetingParticipants.Add(new MeetingParticipant
            {
                MeetingId = meeting.Id,
                UserId = user
            });

            // 🔔 NEW MEETING NOTIFICATION
            _context.Notifications.Add(new Notification
            {
                FromUserId = userId,
                ToUserId = user,
                FromUserName = User.Identity?.Name ?? "HR",
                Type = "meeting",
                Content = $"📅 New meeting: {dto.Title} at {dto.StartTime.ToLocalTime():dd MMM yyyy hh:mm tt}",
                Status = "info",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
           
        }

        // ✅ ADD HR ALSO


        await _context.SaveChangesAsync();

        return Ok();
    }

    // ✅ GET USER MEETINGS
    [Authorize]
    [HttpGet("my-meetings")]
    public async Task<IActionResult> GetMyMeetings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var meetings = await _context.Meetings
            .Include(m => m.Participants)
           .Where(m =>
    m.Participants.Any(p => p.UserId == userId)
    || m.OrganizerId == userId
)
            .Select(m => new MeetingResponseDto
            {
                Id = m.Id,
                Title = m.Title,
                StartTime = m.StartTime,
                EndTime = m.EndTime,
                MeetingLink = m.MeetingLink,
                ParticipantIds = m.Participants
                    .Select(p => p.UserId)
                    .ToList()
            })
            .ToListAsync();

        return Ok(meetings);
    }

    // ✅ GET USERS (HR ONLY)
    [Authorize(Roles = "hr")]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email
            })
            .ToListAsync();

        return Ok(users);
    }
}
















