using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using CalChatAPI.Services;
using System.Security.Claims;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ChatController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ✅ CURRENT USER PERSONAL CHATS
    [HttpGet("personal")]
    public async Task<IActionResult> PersonalChatsForCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        return await PersonalChats(userId);
    }

    // ✅ PERSONAL CHATS
    [HttpGet("personal/{userId}")]
    public async Task<IActionResult> PersonalChats(string userId)
    {
        var chats = await _context.ChatMembers
            .Where(cm => cm.UserId == userId)
            .Join(_context.Chats,
                cm => cm.ChatId,
                c => c.Id,
                (cm, c) => new { cm, c })
            .Where(x => x.c.Type == "personal")
            .Select(x => new
            {
                id = x.c.Id,

                name = _context.ChatMembers
                    .Where(m => m.ChatId == x.c.Id && m.UserId != userId)
                    .Join(_context.Users,
                        m => m.UserId,
                        u => u.Id,
                        (m, u) => u.UserName)
                    .FirstOrDefault(),

                members = _context.ChatMembers
                    .Where(m => m.ChatId == x.c.Id)
                    .Select(m => m.UserId)
                    .ToList(),

                unreadCount = _context.Messages
                    .Where(m =>
                        m.ChatId == x.c.Id &&
                        m.SenderId != userId &&
                        !_context.MessageReads.Any(r =>
                            r.MessageId == m.Id && r.UserId == userId
                        )
                    )
                    .Count(),

                // ✅ FIX: MUTE STATUS
                isMuted = _context.ChatMutes
                    .Any(m => m.ChatId == x.c.Id && m.UserId == userId && m.IsMuted)
            })
            .ToListAsync();   // ✅ ONLY ONE closing

        return Ok(chats);
    }

    // ✅ GROUP CHATS
    [HttpGet("group/{userId}")]
    public async Task<IActionResult> GroupChats(string userId)
    {
        var chats = await _context.ChatMembers
            .Where(cm => cm.UserId == userId)
            .Join(_context.Chats,
                cm => cm.ChatId,
                c => c.Id,
                (cm, c) => new { cm, c })
            .Where(x => x.c.Type == "group")
            .Select(x => new
            {
                id = x.c.Id,
                name = x.c.Name,

                members = _context.ChatMembers
                    .Where(m => m.ChatId == x.c.Id)
                    .Select(m => m.UserId)
                    .ToList(),

                unreadCount = _context.Messages
                    .Where(m =>
                        m.ChatId == x.c.Id &&
                        m.SenderId != userId &&
                        !_context.MessageReads.Any(r =>
                            r.MessageId == m.Id && r.UserId == userId
                        )
                    )
                    .Count(),

                isMuted = _context.ChatMutes
                    .Any(m => m.ChatId == x.c.Id && m.UserId == userId && m.IsMuted)
            })
            .ToListAsync();

        return Ok(chats);
    }

    // ✅ TYPING STATUS
    [HttpPost("typing")]
    public IActionResult SetTyping([FromBody] TypingRequest req)
    {
        TypingStore.SetTyping(req.ChatId, req.UserId);
        return Ok();
    }

    [HttpGet("typing/{chatId}")]
    public IActionResult GetTyping(int chatId)
    {
        var user = TypingStore.GetTyping(chatId);
        return Ok(user);
    }

    public class TypingRequest
    {
        public int ChatId { get; set; }
        public string UserId { get; set; } = "";
    }

    // ✅ MUTE CHAT
    [HttpPost("mute/{chatId}")]
    public async Task<IActionResult> MuteChat(int chatId)
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