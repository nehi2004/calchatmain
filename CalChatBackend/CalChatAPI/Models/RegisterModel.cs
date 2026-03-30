//namespace CalChatAPI.Models
//{
//    public class RegisterModel
//    {
//        public string Email { get; set; }
//        public string Password { get; set; }

//            public string Name { get; set; }     // NEW


//        public string? Role { get; set; }
//    }
//}


namespace CalChatAPI.Models
{
    public class RegisterModel
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string Role { get; set; } = "student";
    }
}