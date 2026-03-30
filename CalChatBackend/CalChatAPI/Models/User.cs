//namespace CalChatAPI.Models
//{
//    public class User
//    {
//        public int Id { get; set; }
//        public string? Name { get; set; }
//        public string? Email { get; set; }
//    }
//}


//public class User
//{
//    public Guid Id { get; set; }

//    public string Email { get; set; }

//    public string PasswordHash { get; set; }

//    public string Role { get; set; } = "";
//}




//public class User
//{
//    public Guid Id { get; set; }

//    public string Email { get; set; } = string.Empty;

//    public string PasswordHash { get; set; } = string.Empty;

//    public string Role { get; set; } = string.Empty;
//}

public class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;   // ✅ Add this

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public string? PasswordHash { get; set; }  // ✅ Nullable

    public Guid? CreatedBy { get; set; }       // ✅ HR Id (GUID because your Id is GUID)
}