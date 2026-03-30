using Microsoft.AspNetCore.Mvc;
using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/groups")]
public class GroupController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public GroupController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ CREATE GROUP
    [HttpPost]
    public async Task<IActionResult> CreateGroup(GroupCreateDto dto)
    {
        var chat = new Chat
        {
            Name = dto.Name,
            Type = "group",
            CreatedAt = DateTime.UtcNow
        };

        _context.Chats.Add(chat);
        await _context.SaveChangesAsync();

        foreach (var memberId in dto.Members)
        {
            _context.ChatMembers.Add(new ChatMember
            {
                ChatId = chat.Id,
                UserId = memberId
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new { chatId = chat.Id });
    }

    // ✅ EXIT GROUP
    [HttpPost("exit/{chatId}")]
    public async Task<IActionResult> ExitGroup(int chatId)
    {
        var userId = Request.Headers["UserId"].ToString();

        var member = await _context.ChatMembers
            .FirstOrDefaultAsync(m =>
                m.ChatId == chatId &&
                m.UserId == userId);

        if (member != null)
        {
            _context.ChatMembers.Remove(member);
            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    // ✅ ADD MEMBER
    [HttpPost("add-member")]
    public async Task<IActionResult> AddMember(AddMemberDto dto)
    {
        if (dto == null || string.IsNullOrEmpty(dto.UserId))
            return BadRequest("Invalid data");

        var exists = await _context.ChatMembers
            .AnyAsync(x => x.ChatId == dto.GroupId && x.UserId == dto.UserId);

        if (exists)
            return BadRequest("User already exists in group");

        var member = new ChatMember
        {
            ChatId = dto.GroupId,
            UserId = dto.UserId
        };

        _context.ChatMembers.Add(member);
        await _context.SaveChangesAsync();

        return Ok();
    }

    // ✅ GET GROUP DETAILS
    [HttpGet("{chatId}")]
    public async Task<IActionResult> GetGroup(int chatId)
    {
        var userId = Request.Headers["UserId"].ToString();

        var chat = await _context.Chats
       .Where(c => c.Id == chatId)
       .Select(c => new
       {
           c.Id,
           c.Name,

           members = _context.ChatMembers
               .Where(m => m.ChatId == c.Id)
               .Join(_context.Users,
                   m => m.UserId,
                   u => u.Id,
                   (m, u) => new
                   {
                       id = u.Id,
                       name = u.UserName
                   })
               .ToList(),

           unreadCount = _context.Messages
               .Where(m =>
                   m.ChatId == c.Id &&
                   m.SenderId != userId &&
                   !_context.MessageReads.Any(r =>
                       r.MessageId == m.Id && r.UserId == userId
                   )
               )
               .Count(),

           isMuted = _context.ChatMutes
               .Any(m => m.ChatId == c.Id && m.UserId == userId && m.IsMuted),

           description = "",

           adminId = _context.ChatMembers
               .Where(m => m.ChatId == c.Id)
               .Select(m => m.UserId)
               .FirstOrDefault()
       })
       .FirstOrDefaultAsync(); // ✅ THIS LINE WAS MISSING

        return Ok(chat);
    }

    // ✅ TOGGLE MUTE (FIXED)
    [HttpPost("mute/{chatId}")]
    public async Task<IActionResult> ToggleMute(int chatId)
    {
        var userId = Request.Headers["UserId"].ToString();

        var mute = await _context.ChatMutes
            .FirstOrDefaultAsync(x => x.ChatId == chatId && x.UserId == userId);

        if (mute == null)
        {
            mute = new ChatMute
            {
                ChatId = chatId,
                UserId = userId,
                IsMuted = true
            };

            _context.ChatMutes.Add(mute);
        }
        else
        {
            mute.IsMuted = !mute.IsMuted;
        }

        await _context.SaveChangesAsync();

        return Ok(new { isMuted = mute.IsMuted });
    }
}