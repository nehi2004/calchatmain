using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Models
{
    public class CalendarEvent
    {
        [Key]
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        public string Time { get; set; } = "09:00";

        public string Type { get; set; } = "Meeting";

        public string Priority { get; set; } = "Low";

        public string? Color { get; set; }

        public int? ReminderMinutes { get; set; }

        public string? Description { get; set; }

        public bool IsAllDay { get; set; } = false;

        public string? UserId { get; set; }

        public DateTimeOffset Created_At { get; set; }
    }
}
