using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Services;
using CalChatAPI.Data;
using CalChatAPI.Models;

namespace CalChatAPI.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]
    public class AIController : ControllerBase
    {
        private readonly AIService _aiService;
        private readonly ApplicationDbContext _context;

        public AIController(AIService aiService, ApplicationDbContext context)
        {
            _aiService = aiService;
            _context = context;
        }

        // SEND MESSAGE TO AI
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";


            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Message required");

            // SAVE USER MESSAGE
            var userChat = new AIChatHistory
            {
                UserId = userId,
                Role = "user",
                Message = request.Message,
                Timestamp = DateTime.UtcNow
            };

            _context.AIChatHistories.Add(userChat);

            // PROCESS AI
            var result = await _aiService.ProcessMessage(userId, request.Message);

            var replyText = result.GetType()
                .GetProperty("reply")?
                .GetValue(result)?
                .ToString();

            // SAVE AI REPLY
            // SAVE AI REPLY (WITH DUPLICATE CHECK)

            var aiChat = new AIChatHistory
            {
                UserId = userId,
                Role = "assistant",
                Message = replyText,
                Timestamp = DateTime.UtcNow
            };

            // 🔥 CHECK DUPLICATE
            bool exists = await _context.AIChatHistories
                .AnyAsync(x => x.UserId == userId
                    && x.Message == replyText
                    && x.Role == "assistant"
                    && x.Timestamp > DateTime.UtcNow.AddSeconds(-2));

            // ✅ SAVE ONLY IF NOT EXISTS
            if (!exists)
            {
                _context.AIChatHistories.Add(aiChat);
            }

        

            await _context.SaveChangesAsync();

            return Ok(result);
        }

        // LOAD CHAT HISTORY
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var history = await _context.AIChatHistories
    .Where(x => x.UserId == userId)
    .OrderBy(x => x.Timestamp)
    .Take(500)
    .ToListAsync();

            return Ok(history);
        }
        [HttpPost("save")]
        public async Task<IActionResult> SaveMessage([FromBody] ChatMessageDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (dto == null || string.IsNullOrEmpty(dto.Message))
                return BadRequest("Invalid message");

            var message = new ChatMessage
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Role = dto.Role ?? "assistant",
                Message = dto.Message,
                Timestamp = DateTime.UtcNow
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPost("save-action")]
        public async Task<IActionResult> SaveAction([FromBody] ChatMessageDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var chat = new AIChatHistory
            {
                UserId = userId,
                Role = dto.Role,
                Message = dto.Message,
                Timestamp = DateTime.UtcNow
            };

            _context.AIChatHistories.Add(chat);
            await _context.SaveChangesAsync();

            return Ok();
        }


    }

    // REQUEST MODEL
    public class ChatRequest
    {
        public string Message { get; set; }
    }
}
