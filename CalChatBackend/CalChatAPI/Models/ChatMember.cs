//using System.ComponentModel.DataAnnotations;

//namespace CalChatAPI.Models
//{
//    public class ChatMember
//    {
//        [Key]
//        public int Id { get; set; }
//        public int ChatId { get; set; }
//        public string UserId { get; set; } = string.Empty;


//    }
//}



using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalChatAPI.Models
{
    public class ChatMember
    {
        [Key]
        public int Id { get; set; }

        public int ChatId { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        public bool IsAdmin { get; set; } = false;

        
    }
}