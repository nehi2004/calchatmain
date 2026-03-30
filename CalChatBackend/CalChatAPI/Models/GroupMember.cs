using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Models
{
    public class GroupMember
    {
        [Key]
        public int Id { get; set; }

        public int GroupId { get; set; }

        public string UserId { get; set; }
    }
}