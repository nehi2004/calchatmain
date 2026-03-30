using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Models
{
    public class Chat
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "personal"; // personal / group
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        
    }
}