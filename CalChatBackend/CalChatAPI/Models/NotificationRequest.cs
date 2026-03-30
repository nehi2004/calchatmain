//public class NotificationRequest
//{
//    public string FromUserId { get; set; }

//    public string FromUserName { get; set; }   // ⭐ ADD THIS

//    public string ToUserId { get; set; }

//    public string Content { get; set; }
//}


namespace CalChatAPI.Models
{
	public class NotificationRequest
	{
		public string FromUserId { get; set; }
		public string FromUserName { get; set; }
		public string ToUserId { get; set; }
		public string Content { get; set; }
	}
}