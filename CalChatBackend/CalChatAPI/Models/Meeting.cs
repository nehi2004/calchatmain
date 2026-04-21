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

        public string MeetingLink { get; set; } = string.Empty;
        public string OrganizerId { get; set; } = string.Empty;

        public ICollection<MeetingParticipant> Participants { get; set; } = new List<MeetingParticipant>();

        [Column("transcript")]
        public string? Transcript { get; set; }

        [Column("labeled_transcript")]
        public string? LabeledTranscript { get; set; }

        [Column("summary")]
        public string? Summary { get; set; }

        [Column("speakers")]
        public string? Speakers { get; set; }

        [Column("duration_seconds")]
        public int? DurationSeconds { get; set; }

        [Column("has_recording")]
        public bool HasRecording { get; set; }
    }
}