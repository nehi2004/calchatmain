public class MeetingResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public string? MeetingLink { get; set; }
    public List<string> ParticipantIds { get; set; }
    public bool HasRecording { get; set; }
    public string? Summary { get; set; }
}