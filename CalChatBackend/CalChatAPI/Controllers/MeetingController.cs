






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
//    //[HttpPost("create")]
//    //public async Task<IActionResult> CreateMeeting(CreateMeetingDto dto)
//    //{
//    //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//    //    //// ✅ Convert to UTC
//    //    //dto.StartTime = dto.StartTime.ToUniversalTime();
//    //    //dto.EndTime = dto.EndTime.ToUniversalTime();

//    //    //if (dto.StartTime >= dto.EndTime)
//    //    //    return BadRequest("Start time must be before end time");

//    //    //if (dto.StartTime < DateTimeOffset.UtcNow)
//    //    //    return BadRequest("Meeting cannot be in the past");

//    //    if (dto.StartTime >= dto.EndTime)
//    //        return BadRequest(new { error = "Start time must be before end time" });

//    //    if (dto.StartTime < DateTimeOffset.UtcNow)
//    //        return BadRequest(new { error = "Meeting cannot be in the past" });

//    //    var meeting = new Meeting
//    //    {
//    //        Title = dto.Title,
//    //        StartTime = dto.StartTime,
//    //        EndTime = dto.EndTime,
//    //        MeetingLink = dto.MeetingLink,
//    //        OrganizerId = userId
//    //    };

//    //    _context.Meetings.Add(meeting);
//    //    await _context.SaveChangesAsync();

//    //    // ✅ ADD PARTICIPANTS + NOTIFICATIONS
//    //    foreach (var user in dto.ParticipantIds)
//    //    {
//    //        // 👥 Add participant
//    //        _context.MeetingParticipants.Add(new MeetingParticipant
//    //        {
//    //            MeetingId = meeting.Id,
//    //            UserId = user
//    //        });

//    //        // 🔔 NEW MEETING NOTIFICATION
//    //        _context.Notifications.Add(new Notification
//    //        {
//    //            FromUserId = userId,
//    //            ToUserId = user,
//    //            FromUserName = User.Identity?.Name ?? "HR",
//    //            Type = "meeting",
//    //            Content = $"📅 New meeting: {dto.Title} at {dto.StartTime.ToLocalTime():dd MMM yyyy hh:mm tt}",
//    //            Status = "info",
//    //            IsRead = false,
//    //            CreatedAt = DateTime.UtcNow
//    //        });

//    //    }

//    //    // ✅ ADD HR ALSO


//    //    await _context.SaveChangesAsync();

//    //    return Ok();
//    //}

//    [HttpPost("create")]
//    public async Task<IActionResult> CreateMeeting(CreateMeetingDto dto)
//    {
//        try
//        {
//            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//            Console.WriteLine("USER ID 👉 " + userId);   // ADD THIS

//            if (string.IsNullOrEmpty(userId))
//            {
//                return Unauthorized(new { error = "UserId is NULL from token" });
//            }

//            if (dto.StartTime >= dto.EndTime)
//                return BadRequest("Start time must be before end time");

//            var meeting = new Meeting
//            {
//                Title = dto.Title,
//                StartTime = dto.StartTime,
//                EndTime = dto.EndTime,
//                MeetingLink = dto.MeetingLink ?? "https://meet.google.com/new",
//                OrganizerId = userId
//            };

//            _context.Meetings.Add(meeting);
//            await _context.SaveChangesAsync();

//            //if (dto.ParticipantIds?.Any() == true)
//            //{
//            //    var validUsers = await _context.Users
//            //        .Where(u => dto.ParticipantIds.Contains(u.Id))
//            //        .Select(u => u.Id)
//            //        .ToListAsync();

//            //    foreach (var user in validUsers)
//            //    {
//            //        _context.MeetingParticipants.Add(new MeetingParticipant
//            //        {
//            //            MeetingId = meeting.Id,
//            //            UserId = user
//            //        });
//            //    }
//            //}
//            if (dto.ParticipantIds?.Any() == true)
//            {
//                var validUsers = await _context.Users
//                    .Where(u => dto.ParticipantIds.Contains(u.Id))
//                    .Select(u => u.Id)
//                    .ToListAsync();

//                foreach (var user in validUsers)
//                {
//                    _context.MeetingParticipants.Add(new MeetingParticipant
//                    {
//                        MeetingId = meeting.Id,
//                        UserId = user
//                    });
//                }
//            }
//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Meeting created successfully" });
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, new
//            {
//                error = ex.Message,
//                inner = ex.InnerException?.Message
//            });
//        }
//    }


//    //// ✅ GET USER MEETINGS
//    //[Authorize]
//    //[HttpGet("my-meetings")]
//    //public async Task<IActionResult> GetMyMeetings()
//    //{
//    //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//    //    var meetings = await _context.Meetings
//    //        .Include(m => m.Participants)
//    //        .Where(m =>
//    //            m.Participants.Any(p => p.UserId == userId)
//    //            || m.OrganizerId == userId
//    //        )
//    //        .Select(m => new MeetingResponseDto
//    //        {
//    //            Id = m.Id,
//    //            Title = m.Title,
//    //            StartTime = m.StartTime,
//    //            EndTime = m.EndTime,
//    //            MeetingLink = m.MeetingLink,
//    //            ParticipantIds = m.Participants
//    //                .Select(p => p.UserId)
//    //                .ToList(),
//    //            HasRecording = m.HasRecording,
//    //            Summary = m.Summary
//    //        })
//    //        .ToListAsync();

//    //    return Ok(meetings);   // ← sirf EK return
//    //}



//    [Authorize]
//    [HttpGet("my-meetings")]
//    public async Task<IActionResult> GetMyMeetings()
//    {
//        try
//        {
//            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
//            var meetings = await _context.Meetings
//                .Include(m => m.Participants)
//                .Where(m =>
//                    m.Participants.Any(p => p.UserId == userId)
//                    || m.OrganizerId == userId
//                )
//                .Select(m => new MeetingResponseDto
//                {
//                    Id = m.Id,
//                    Title = m.Title,
//                    StartTime = m.StartTime,
//                    EndTime = m.EndTime,
//                    MeetingLink = m.MeetingLink,
//                    ParticipantIds = m.Participants
//                        .Select(p => p.UserId)
//                        .ToList(),
//                    HasRecording = m.HasRecording,
//                    Summary = m.Summary
//                })
//                .ToListAsync();

//            return Ok(meetings);  // ← SIRF EK RETURN
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
//        }
//    }


//    // ✅ GET USERS (HR ONLY)
//    [Authorize(Roles = "hr")]
//    [HttpGet("users")]
//    public async Task<IActionResult> GetUsers()
//    {
//        var users = await _context.Users
//            .Select(u => new
//            {
//                u.Id,
//                u.FullName,
//                u.Email
//            })
//            .ToListAsync();

//        return Ok(users);
//    }


//    // ✅ SAVE RECORDING DATA (Python bot yahan POST karega)
//    [HttpPost("{id}/recording")]
//    public async Task<IActionResult> SaveRecording(int id, [FromBody] RecordingDto dto)
//    {
//        var meeting = await _context.Meetings.FindAsync(id);
//        if (meeting == null) return NotFound();

//        meeting.Transcript = dto.Transcript;
//        meeting.LabeledTranscript = dto.LabeledTranscript;
//        meeting.Summary = dto.Summary;
//        meeting.Speakers = dto.Speakers;
//        meeting.DurationSeconds = dto.DurationSeconds;
//        meeting.HasRecording = true;

//        await _context.SaveChangesAsync();
//        return Ok(new { message = "Recording saved!", meetingId = id });
//    }

//    // ✅ GET MEETING DETAIL WITH RECORDING
//    [Authorize]
//    [HttpGet("{id}/detail")]
//    public async Task<IActionResult> GetMeetingDetail(int id)
//    {
//        var meeting = await _context.Meetings
//            .Include(m => m.Participants)
//            .FirstOrDefaultAsync(m => m.Id == id);

//        if (meeting == null) return NotFound();
//        return Ok(new
//        {
//            meeting.Id,
//            meeting.Title,
//            meeting.StartTime,
//            meeting.EndTime,
//            meeting.MeetingLink,
//            meeting.Transcript,
//            meeting.LabeledTranscript,
//            meeting.Summary,
//            meeting.Speakers,
//            meeting.DurationSeconds,
//            meeting.HasRecording,

//            // ✅ ADD THIS
//            ParticipantIds = meeting.Participants
//                .Select(p => p.UserId)
//                .ToList(),

//            // ✅ ADD THIS (VERY IMPORTANT)
//            OrganizerEmail = await _context.Users
//                .Where(u => u.Id == meeting.OrganizerId)
//                .Select(u => u.Email)
//                .FirstOrDefaultAsync()
//        });

//    }
//    // ✅ DELETE MEETING (HR + Organizer)
//    [Authorize]
//    [HttpDelete("{id}")]
//    public async Task<IActionResult> DeleteMeeting(int id)
//    {
//        try
//        {
//            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//            var meeting = await _context.Meetings
//                .Include(m => m.Participants)
//                .FirstOrDefaultAsync(m => m.Id == id);

//            if (meeting == null)
//                return NotFound(new { error = "Meeting not found" });

//            // ✅ Allow only HR or organizer
//            var isHR = User.IsInRole("hr");

//            if (!isHR && meeting.OrganizerId != userId)
//                return Forbid();

//            // ✅ Delete participants first
//            var participants = _context.MeetingParticipants
//                .Where(p => p.MeetingId == id);

//            _context.MeetingParticipants.RemoveRange(participants);

//            // ✅ Delete meeting
//            _context.Meetings.Remove(meeting);

//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Meeting deleted successfully" });
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, new
//            {
//                error = ex.Message,
//                inner = ex.InnerException?.Message
//            });
//        }
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

    [Authorize(Roles = "hr")]
    [HttpPost("create")]
    public async Task<IActionResult> CreateMeeting(CreateMeetingDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.Identity?.Name ?? "HR";

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { error = "UserId is NULL from token" });

            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { error = "Title is required" });

            if (dto.StartTime >= dto.EndTime)
                return BadRequest(new { error = "Start time must be before end time" });

            if (dto.StartTime < DateTimeOffset.UtcNow)
                return BadRequest(new { error = "Meeting cannot be in the past" });

            var meeting = new Meeting
            {
                Title = dto.Title.Trim(),
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                MeetingLink = string.IsNullOrWhiteSpace(dto.MeetingLink)
                    ? "https://meet.google.com/new"
                    : dto.MeetingLink.Trim(),
                OrganizerId = userId
            };

            _context.Meetings.Add(meeting);
            await _context.SaveChangesAsync();

            var validUsers = new List<string>();

            if (dto.ParticipantIds?.Any() == true)
            {
                validUsers = await _context.Users
                    .Where(u => dto.ParticipantIds.Contains(u.Id))
                    .Select(u => u.Id)
                    .ToListAsync();

                foreach (var participantUserId in validUsers.Distinct())
                {
                    _context.MeetingParticipants.Add(new MeetingParticipant
                    {
                        MeetingId = meeting.Id,
                        UserId = participantUserId
                    });

                    _context.Notifications.Add(new Notification
                    {
                        FromUserId = userId,
                        ToUserId = participantUserId,
                        FromUserName = userName,
                        Type = "meeting",
                        Content = $"New meeting scheduled: {meeting.Title}",
                        Status = "info",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Meeting created successfully", meetingId = meeting.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = ex.Message,
                inner = ex.InnerException?.Message
            });
        }
    }

    [Authorize]
    [HttpGet("my-meetings")]
    public async Task<IActionResult> GetMyMeetings()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var meetings = await _context.Meetings
                .Include(m => m.Participants)
                .Where(m =>
                    m.Participants.Any(p => p.UserId == userId) ||
                    m.OrganizerId == userId
                )
                .Select(m => new MeetingResponseDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    StartTime = m.StartTime,
                    EndTime = m.EndTime,
                    MeetingLink = m.MeetingLink,
                    ParticipantIds = m.Participants.Select(p => p.UserId).ToList(),
                    HasRecording = m.HasRecording,
                    Summary = m.Summary
                })
                .ToListAsync();

            return Ok(meetings);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
        }
    }

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

    [Authorize(Roles = "hr")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMeeting(int id, [FromBody] CreateMeetingDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.Identity?.Name ?? "HR";

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { error = "Title is required" });

            if (dto.StartTime >= dto.EndTime)
                return BadRequest(new { error = "Start time must be before end time" });

            var meeting = await _context.Meetings
                .Include(m => m.Participants)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (meeting == null)
                return NotFound(new { error = "Meeting not found" });

            if (meeting.OrganizerId != userId && !User.IsInRole("hr"))
                return Forbid();

            meeting.Title = dto.Title.Trim();
            meeting.StartTime = dto.StartTime;
            meeting.EndTime = dto.EndTime;
            meeting.MeetingLink = string.IsNullOrWhiteSpace(dto.MeetingLink)
                ? "https://meet.google.com/new"
                : dto.MeetingLink.Trim();

            var existingParticipants = await _context.MeetingParticipants
                .Where(p => p.MeetingId == id)
                .ToListAsync();

            _context.MeetingParticipants.RemoveRange(existingParticipants);

            var validUsers = new List<string>();

            if (dto.ParticipantIds?.Any() == true)
            {
                validUsers = await _context.Users
                    .Where(u => dto.ParticipantIds.Contains(u.Id))
                    .Select(u => u.Id)
                    .ToListAsync();

                foreach (var participantUserId in validUsers.Distinct())
                {
                    _context.MeetingParticipants.Add(new MeetingParticipant
                    {
                        MeetingId = meeting.Id,
                        UserId = participantUserId
                    });

                    _context.Notifications.Add(new Notification
                    {
                        FromUserId = userId,
                        ToUserId = participantUserId,
                        FromUserName = userName,
                        Type = "meeting",
                        Content = $"Meeting updated: {meeting.Title}",
                        Status = "info",
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Meeting updated successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = ex.Message,
                inner = ex.InnerException?.Message
            });
        }
    }

    [HttpPost("{id}/recording")]
    public async Task<IActionResult> SaveRecording(int id, [FromBody] RecordingDto dto)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null) return NotFound();

        meeting.Transcript = dto.Transcript;
        meeting.LabeledTranscript = dto.LabeledTranscript;
        meeting.Summary = dto.Summary;
        meeting.Speakers = dto.Speakers;
        meeting.DurationSeconds = dto.DurationSeconds;
        meeting.HasRecording = true;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Recording saved!", meetingId = id });
    }

    [Authorize]
    [HttpGet("{id}/detail")]
    public async Task<IActionResult> GetMeetingDetail(int id)
    {
        var meeting = await _context.Meetings
            .Include(m => m.Participants)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (meeting == null)
            return NotFound();

        return Ok(new
        {
            meeting.Id,
            meeting.Title,
            meeting.StartTime,
            meeting.EndTime,
            meeting.MeetingLink,
            meeting.Transcript,
            meeting.LabeledTranscript,
            meeting.Summary,
            meeting.Speakers,
            meeting.DurationSeconds,
            meeting.HasRecording,
            ParticipantIds = meeting.Participants.Select(p => p.UserId).ToList(),
            OrganizerEmail = await _context.Users
                .Where(u => u.Id == meeting.OrganizerId)
                .Select(u => u.Email)
                .FirstOrDefaultAsync()
        });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMeeting(int id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.Identity?.Name ?? "HR";

            var meeting = await _context.Meetings
                .Include(m => m.Participants)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (meeting == null)
                return NotFound(new { error = "Meeting not found" });

            var isHR = User.IsInRole("hr");

            if (!isHR && meeting.OrganizerId != userId)
                return Forbid();

            var participantIds = meeting.Participants.Select(p => p.UserId).ToList();

            foreach (var participantUserId in participantIds)
            {
                _context.Notifications.Add(new Notification
                {
                    FromUserId = userId,
                    ToUserId = participantUserId,
                    FromUserName = userName,
                    Type = "meeting",
                    Content = $"Meeting cancelled: {meeting.Title}",
                    Status = "info",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });
            }

            var participants = _context.MeetingParticipants.Where(p => p.MeetingId == id);
            _context.MeetingParticipants.RemoveRange(participants);

            _context.Meetings.Remove(meeting);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Meeting deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                error = ex.Message,
                inner = ex.InnerException?.Message
            });
        }
    }
}
