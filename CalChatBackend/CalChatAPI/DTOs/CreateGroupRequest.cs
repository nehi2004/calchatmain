using System;
using System.Collections.Generic;

namespace CalChatAPI.DTOs
{
    public class CreateGroupRequest
    {
        public string Name { get; set; }

        public Guid CreatedBy { get; set; }

        public List<Guid> MemberIds { get; set; }
    }
}