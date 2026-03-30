using System;

namespace CalChatAPI.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public string FromUserId { get; set; }

        public string ToUserId { get; set; } = "";

        public string FromUserName { get; set; }   // ⭐ ADD THIS

        public string Type { get; set; }

        public string Content { get; set; }

        public bool IsRead { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}