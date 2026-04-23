using System;
using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Models
{
    public class AIChatHistory
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string? EventDataJson { get; set; }

        public string? ActionState { get; set; }
    }
}
