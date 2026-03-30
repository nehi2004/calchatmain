using System;
using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Models
{
    public class ChatMessage
    {
        [Key]
        public Guid Id { get; set; }

        public string UserId { get; set; }

        public string Role { get; set; } // user / assistant

        public string Message { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
