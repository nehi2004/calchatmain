//using System.Collections.Generic;

//namespace CalChatAPI.Models
//{
//    public class Note
//    {
//        public int Id { get; set; }

//        public string Title { get; set; }

//        public string Content { get; set; }

//        public string Category { get; set; }

//        public string CreatedById { get; set; } // HR ID

//        public List<NoteUser> NoteUsers { get; set; }
//        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
//    }
//}


using System;
using System.Collections.Generic;

namespace CalChatAPI.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string CreatedById { get; set; }
        public List<NoteUser> NoteUsers { get; set; } = new();
        public List<NoteAttachment> Attachments { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
