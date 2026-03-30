//using System.ComponentModel.DataAnnotations;


// public class CreateMeetingDto
//{
//	[Required]
//	public string Title { get; set; }

//	[Required]
//	public DateTime StartTime { get; set; }

//	[Required]
//	public DateTime EndTime { get; set; }

//	public string? MeetingLink { get; set; }

//	[Required]

//    public List<string> ParticipantIds { get; set; } = new();
//}

public class CreateMeetingDto
{
    public string Title { get; set; } = string.Empty;

    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }

    public string MeetingLink { get; set; }
    public List<string> ParticipantIds { get; set; }
}