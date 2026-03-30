public class EventItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime? Date { get; set; }
    public string Time { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int Attendees { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = "Upcoming";

    public string UserId { get; set; } = string.Empty;  // 🔥 IMPORTANT
}