public class Announcement
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string Audience { get; set; } = "All Users";

    public string Status { get; set; } = "Published";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}