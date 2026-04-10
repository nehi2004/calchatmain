public class CallMessageDto
{
    public int ChatId { get; set; }   // ✅ int (NOT string)
    public string SenderId { get; set; }
    public string SenderName { get; set; }
    public string Message { get; set; }
}