//using System.ComponentModel.DataAnnotations;

//public class Meeting
//{
//    public int Id { get; set; }


//    public string Title { get; set; }

//    public DateTimeOffset StartTime { get; set; }
//    public DateTimeOffset EndTime { get; set; }

//    public string OrganizerId { get; set; }

//    public string MeetingLink { get; set; }

//    // Navigation Property
//    public List<MeetingParticipant> Participants { get; set; }
//}

public class Meeting
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;

    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }

    public string MeetingLink { get; set; }
    public string OrganizerId { get; set; }
    // ✅ ADD THIS LINE(VERY IMPORTANT)
    public ICollection<MeetingParticipant> Participants { get; set; } = new List<MeetingParticipant>();
}