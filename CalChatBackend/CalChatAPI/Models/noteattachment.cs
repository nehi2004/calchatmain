using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalChatAPI.Models
{
    public class NoteAttachment
    {
        [Key]
        public int Id { get; set; }

        public int NoteId { get; set; }

        [ForeignKey(nameof(NoteId))]
        public Note Note { get; set; } = null!;

        public string OriginalFileName { get; set; } = string.Empty;

        public string StoredFileName { get; set; } = string.Empty;

        public string ContentType { get; set; } = string.Empty;

        public long FileSize { get; set; }

        public string FilePath { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }

        // NEW: actual file content
        public byte[] FileData { get; set; } = Array.Empty<byte>();
    }
}
