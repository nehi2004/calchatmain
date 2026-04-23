using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace CalChatAPI.DTOs
{
    public class CreateNoteFormDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public List<string> UserIds { get; set; } = new();
        public List<IFormFile> Files { get; set; } = new();
    }
}
