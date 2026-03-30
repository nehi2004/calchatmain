using System.Collections.Generic;

namespace CalChatAPI.DTOs
{
    public class CreateNoteDto
    {
        public string Title { get; set; }

        public string Content { get; set; }

        public string Category { get; set; }

        public List<string> UserIds { get; set; }
    }
}