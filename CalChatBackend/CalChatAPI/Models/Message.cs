using System;
using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        public int ChatId { get; set; }

        public string SenderId { get; set; } = "";

        public string SenderName { get; set; } = "";

        public string Text { get; set; } = "";   // 🔥 CHANGE THIS

        public string? FileUrl { get; set; }

        public DateTime Time { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;
    }
}