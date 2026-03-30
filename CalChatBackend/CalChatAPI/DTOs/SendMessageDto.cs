namespace CalChatAPI.DTOs
{
    public class SendMessageDto
    {
        public Guid ConversationId { get; set; }

        public string Message { get; set; }
        public string? ReceiverId { get; set; }
    }
}

