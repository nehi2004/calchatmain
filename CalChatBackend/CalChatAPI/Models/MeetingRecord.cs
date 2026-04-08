using System;

namespace CalChatAPI.Models
{
    public class MeetingRecord
    {
        public int Id { get; set; }

        public string FilePath { get; set; } = string.Empty;

        public string Transcript { get; set; } = string.Empty;

        public string Summary { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}