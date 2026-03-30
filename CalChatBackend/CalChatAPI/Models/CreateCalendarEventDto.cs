namespace CalChatAPI.Models
{
    public class CreateCalendarEventDto
    {
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string? Time { get; set; }
        public string Type { get; set; }
        public string? Priority { get; set; }
        public string? Color { get; set; }
    }
}