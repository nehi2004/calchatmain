namespace CalChatAPI.DTOs
{
    public class LeaveGroupRequest
    {
        public Guid GroupId { get; set; }

        public Guid UserId { get; set; }
    }
}