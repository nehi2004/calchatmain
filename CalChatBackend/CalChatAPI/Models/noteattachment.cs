using System;

namespace CalChatAPI.Models
{
    public class NoteAttachment
    {
        public int Id { get; set; }
        public int NoteId { get; set; }

        public string OriginalFileName { get; set; }
        public string StoredFileName { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public Note Note { get; set; }
    }
}
