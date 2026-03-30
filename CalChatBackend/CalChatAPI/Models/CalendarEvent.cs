
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalChatAPI.Models
{
    [Table("CalendarEvents")]
    public class CalendarEvent
    {
        [Key]
        [Column("Id")]
        public Guid Id { get; set; }

        [Column("Title")]
        public string Title { get; set; } = string.Empty;

        [Column("Date")]
        public DateTime Date { get; set; }


        [Column("Time")]
        public string Time { get; set; } = string.Empty;

        [Column("Type")]
        public string Type { get; set; } = string.Empty;

        [Column("Created_At")]
        public DateTimeOffset Created_At { get; set; } = DateTimeOffset.UtcNow;

        [Column("Priority")]
        public string? Priority { get; set; }

        [Column("Color")]
        public string? Color { get; set; }

        [Column("UserId")]
        public string? UserId { get; set; }

        [Column("ReminderMinutes")]
        public int? ReminderMinutes { get; set; }

    }
}
