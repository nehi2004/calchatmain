//using Microsoft.AspNetCore.Identity;

//namespace CalChatAPI.Models
//{
//    public class ApplicationUser : IdentityUser
//    {
//        public string Name { get; set; } = "";
//    }
//}


//using Microsoft.AspNetCore.Identity;

//namespace CalChatAPI.Models
//{
//    public class ApplicationUser : IdentityUser
//    {
//        public string Name { get; set; } = string.Empty;

//        public string? Nickname { get; set; }

//        public string? Gender { get; set; }

//        public string? Country { get; set; }

//        public string? Mobile { get; set; }

//        public string? ProfileImage { get; set; }
//    }
//}




using Microsoft.AspNetCore.Identity;

namespace CalChatAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string? Nickname { get; set; }

        public string? Gender { get; set; }

        public string? Country { get; set; }

        public string? Mobile { get; set; }

        public string? ProfileImage { get; set; }

        public string? Department { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;// ✅ OK

        public bool IsActive { get; set; } = true;
        public string? ResetToken { get; set; }
        public DateTime? TokenExpiry { get; set; }
        public string? CreatedByHrId { get; set; }
    }
}