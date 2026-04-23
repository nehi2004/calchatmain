namespace CalChatAPI.Models
{
    public class ChatMessageDto
    {
        public string Role { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? EventDataJson { get; set; }
        public string? ActionState { get; set; }
    }
}
