using System;
using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Models
{
    public class AIChatHistory
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }

        public string Role { get; set; }   // user or assistant

        public string Message { get; set; }

        public DateTime Timestamp { get; set; }
    }
}
