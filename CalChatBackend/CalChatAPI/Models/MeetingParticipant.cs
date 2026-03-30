//public class MeetingParticipant
//{
//    public int Id { get; set; }

//    public int MeetingId { get; set; }
//    public string UserId { get; set; }

//    // Navigation
//    public Meeting Meeting { get; set; }
//}
using CalChatAPI.Models;

public class MeetingParticipant
{
    public int Id { get; set; }

    public int MeetingId { get; set; }
    public Meeting Meeting { get; set; }

    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
}