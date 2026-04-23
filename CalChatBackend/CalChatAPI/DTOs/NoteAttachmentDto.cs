namespace CalChatAPI.DTOs
{
    public class NoteAttachmentDto
    {
        public int Id { get; set; }
        public string OriginalFileName { get; set; }
        public string ContentType { get; set; }
        public long FileSize { get; set; }
    }
}
