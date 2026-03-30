namespace CalChatAPI.DTOs
{
    public class RemoveMemberRequest
    {
        public Guid GroupId { get; set; }

        public Guid UserId { get; set; }   // remove होने वाला member

        public Guid RequestedBy { get; set; }  // admin
    }
}