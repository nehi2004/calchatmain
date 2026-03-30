namespace CalChatAPI.DTOs
{
    public class SendGroupMessageRequest
    {
        public Guid GroupId { get; set; }

        public Guid SenderId { get; set; }

        public string Message { get; set; }
    }
}