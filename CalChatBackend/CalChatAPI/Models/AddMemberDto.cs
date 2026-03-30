namespace CalChatAPI.Models
{
    public class AddMemberDto
    {
        public int GroupId { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
}