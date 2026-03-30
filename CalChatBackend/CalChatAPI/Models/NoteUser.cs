namespace CalChatAPI.Models
{
    public class NoteUser
    {
        public int Id { get; set; }

        public int NoteId { get; set; }

        public string UserId { get; set; }

        public Note Note { get; set; }
    }
}