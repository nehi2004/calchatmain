//using CalChatAPI.Hubs;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.AspNetCore.SignalR;

//[ApiController]
//[Route("api/messages")]
//public class MessagesController : ControllerBase
//{
//    private readonly ApplicationDbContext _context;
//    private readonly IWebHostEnvironment _env;
//    private readonly IHubContext<ChatHub> _hub;

//    public MessagesController(
//        ApplicationDbContext context,
//        IWebHostEnvironment env,
//        IHubContext<ChatHub> hub)
//    {
//        _context = context;
//        _env = env;
//        _hub = hub;
//    }

//    // GET MESSAGES
//    [HttpGet("{chatId}")]
//    public async Task<IActionResult> GetMessages(int chatId)
//    {
//        var userId = Request.Headers["UserId"].ToString();

//        var messages = await _context.Messages
//            .Where(m => m.ChatId == chatId)
//            .OrderBy(m => m.Time)
//            .ToListAsync();

//        foreach (var msg in messages)
//        {
//            if (msg.SenderId != userId && !msg.IsRead)
//            {
//                msg.IsRead = true;
//            }
//        }

//        await _context.SaveChangesAsync();

//        return Ok(messages.Select(m => new
//        {
//            id = m.Id,
//            senderId = m.SenderId,
//            senderName = m.SenderName,
//            message = m.Text,
//            fileUrl = m.FileUrl,
//            time = m.Time,
//            isRead = m.IsRead
//        }));
//    }

//    // MARK READ
//    [HttpPost("read/{chatId}")]
//    public async Task<IActionResult> MarkAsRead(int chatId)
//    {
//        var userId = Request.Headers["UserId"].ToString();

//        var messages = await _context.Messages
//            .Where(m => m.ChatId == chatId && m.SenderId != userId)
//            .ToListAsync();

//        foreach (var msg in messages)
//        {
//            var alreadyRead = await _context.MessageReads
//                .AnyAsync(r => r.MessageId == msg.Id && r.UserId == userId);

//            if (!alreadyRead)
//            {
//                _context.MessageReads.Add(new MessageRead
//                {
//                    MessageId = msg.Id,
//                    UserId = userId
//                });
//            }
//        }

//        await _context.SaveChangesAsync();

//        return Ok();
//    }

//    // SEND MESSAGE
//    [HttpPost]
//    public async Task<IActionResult> SendMessage(
//        [FromForm] int chatId,
//        [FromForm] string message,
//        IFormFile? file)
//    {
//        string? fileUrl = null;

//        if (file != null)
//        {
//            var uploads = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");

//            if (!Directory.Exists(uploads))
//                Directory.CreateDirectory(uploads);

//            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

//            var filePath = Path.Combine(uploads, fileName);

//            using (var stream = new FileStream(filePath, FileMode.Create))
//            {
//                await file.CopyToAsync(stream);
//            }

//            fileUrl = "/uploads/" + fileName;
//        }

//        var msg = new Message
//        {
//            ChatId = chatId,
//            SenderId = Request.Headers["UserId"].ToString(),
//            SenderName = Request.Headers["UserName"].ToString(),
//            Text = message,
//            FileUrl = fileUrl,
//            Time = DateTime.UtcNow,
//            IsRead = false
//        };

//        _context.Messages.Add(msg);

//        await _context.SaveChangesAsync();

//        return Ok(msg);
//    }
//    [HttpDelete("clear/{chatId}")]
//    public async Task<IActionResult> ClearChat(int chatId)
//    {
//        var messages = _context.Messages
//            .Where(m => m.ChatId == chatId);

//        _context.Messages.RemoveRange(messages);

//        await _context.SaveChangesAsync();

//        return Ok();
//    }
//    [HttpGet("export/{chatId}")]
//    public async Task<IActionResult> ExportChat(int chatId)
//    {
//        var messages = await _context.Messages
//            .Where(m => m.ChatId == chatId)
//            .OrderBy(m => m.Time)
//            .ToListAsync();

//        var text = string.Join("\n",
//           messages.Select(m => $"{m.SenderId}: {m.Text}")
//        );

//        return File(
//            System.Text.Encoding.UTF8.GetBytes(text),
//            "text/plain",
//            "chat.txt"
//        );
//    }

//}


using CalChatAPI.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/messages")]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly IHubContext<ChatHub> _hub;

    public MessagesController(
        ApplicationDbContext context,
        IWebHostEnvironment env,
        IHubContext<ChatHub> hub)
    {
        _context = context;
        _env = env;
        _hub = hub;
    }

    // GET MESSAGES
    [HttpGet("{chatId}")]
    public async Task<IActionResult> GetMessages(int chatId)
    {
        var userId = Request.Headers["UserId"].ToString();

        var messages = await _context.Messages
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.Time)
            .ToListAsync();

        foreach (var msg in messages)
        {
            if (msg.SenderId != userId && !msg.IsRead)
            {
                msg.IsRead = true;
            }
        }

        await _context.SaveChangesAsync();

        return Ok(messages.Select(m => new
        {
            id = m.Id,
            senderId = m.SenderId,
            senderName = m.SenderName,
            message = m.Text,
            fileUrl = m.FileUrl,
            time = m.Time,
            isRead = m.IsRead
        }));
    }

    // MARK READ
    [HttpPost("read/{chatId}")]
    public async Task<IActionResult> MarkAsRead(int chatId)
    {
        var userId = Request.Headers["UserId"].ToString();

        var messages = await _context.Messages
            .Where(m => m.ChatId == chatId && m.SenderId != userId)
            .ToListAsync();

        foreach (var msg in messages)
        {
            var alreadyRead = await _context.MessageReads
                .AnyAsync(r => r.MessageId == msg.Id && r.UserId == userId);

            if (!alreadyRead)
            {
                _context.MessageReads.Add(new MessageRead
                {
                    MessageId = msg.Id,
                    UserId = userId
                });
            }
        }

        await _context.SaveChangesAsync();

        return Ok();
    }

    // SEND MESSAGE
    [HttpPost]
    public async Task<IActionResult> SendMessage(
        [FromForm] int chatId,
        [FromForm] string message,
        IFormFile? file)
    {
        string? fileUrl = null;

        if (file != null)
        {
            var uploads = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");

            if (!Directory.Exists(uploads))
                Directory.CreateDirectory(uploads);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            var filePath = Path.Combine(uploads, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            fileUrl = "/uploads/" + fileName;
        }

        var msg = new Message
        {
            ChatId = chatId,
            SenderId = Request.Headers["UserId"].ToString(),
            SenderName = Request.Headers["UserName"].ToString(),
            Text = message,
            FileUrl = fileUrl,
            Time = DateTime.UtcNow,
            IsRead = false
        };

        _context.Messages.Add(msg);

        await _context.SaveChangesAsync();

        return Ok(msg);
    }
    [HttpDelete("clear/{chatId}")]
    public async Task<IActionResult> ClearChat(int chatId)
    {
        var messages = _context.Messages
            .Where(m => m.ChatId == chatId);

        _context.Messages.RemoveRange(messages);

        await _context.SaveChangesAsync();

        return Ok();
    }
    [HttpGet("export/{chatId}")]
    public async Task<IActionResult> ExportChat(int chatId)
    {
        var messages = await _context.Messages
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.Time)
            .ToListAsync();

        var text = string.Join("\n",
           messages.Select(m => $"{m.SenderId}: {m.Text}")
        );

        return File(
            System.Text.Encoding.UTF8.GetBytes(text),
            "text/plain",
            "chat.txt"
        );
    }
    [HttpPost("call")]
    public IActionResult SaveCallMessage([FromBody] Message dto)
    {
        if (dto == null)
            return BadRequest();

        var message = new Message
        {
            ChatId = dto.ChatId,
            SenderId = dto.SenderId,
            SenderName = dto.SenderName,
            Text = string.IsNullOrEmpty(dto.Text) ? "📞 Call" : dto.Text,
            Time = DateTime.UtcNow,
            IsCall = true,
            Status = "sent"
        };

        _context.Messages.Add(message);
        _context.SaveChanges();

        return Ok(message);
    }

}