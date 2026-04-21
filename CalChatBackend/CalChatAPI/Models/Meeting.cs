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


using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalChatAPI.Models
{
    public class Meeting
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }

        public string MeetingLink { get; set; }
        public string OrganizerId { get; set; }

        public ICollection<MeetingParticipant> Participants { get; set; } = new List<MeetingParticipant>();

        public string? Transcript { get; set; }
        public string? LabeledTranscript { get; set; }
        public string? Summary { get; set; }
        public string? Speakers { get; set; }
        public int? DurationSeconds { get; set; }

        [Column("has_recording")]   // ✅ correct mapping
        public bool HasRecording { get; set; } = false;
    }
}