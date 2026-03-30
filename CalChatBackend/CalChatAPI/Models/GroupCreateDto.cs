using System.Collections.Generic;

namespace CalChatAPI.Models
{
    public class GroupCreateDto
    {
        public string Name { get; set; } = null!;
        public List<string> Members { get; set; } = new List<string>();

        
    }
}