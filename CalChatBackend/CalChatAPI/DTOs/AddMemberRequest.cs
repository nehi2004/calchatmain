using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.DTOs
{
    public class AddMemberRequest
    {
        [Required]
        public Guid GroupId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid RequestedBy { get; set; }
    }
}