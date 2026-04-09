//namespace CalChatAPI.Services
//{
//    public class EventExtractor
//    {
//        public static ExtractedEvent Extract(string message)
//        {
//            var (date, time) = NaturalTimeParser.Parse(message);

//            return new ExtractedEvent
//            {
//                Title = ExtractTitle(message),
//                Date = date,
//                Time = time
//            };
//        }

//           private static string ExtractTitle(string message)
//        {
//            message = message.ToLower();

//            if (message.Contains("meeting"))
//                return "Meeting";

//            if (message.Contains("class"))
//                return "Class";

//            if (message.Contains("lecture"))
//                return "Lecture";

//            if (message.Contains("event"))
//                return "Event";

//            if (message.Contains("marriage"))
//                return "Marriage";

//            if (message.Contains("exam"))
//                return "Exam";

//            if (message.Contains("job"))
//                return "Job";

//            if (message.Contains("call"))
//                return "Call";

//            return "Event";
//        }


        
//    }

//    public class ExtractedEvent
//    {
//        public string Title { get; set; }
//        public DateTime Date { get; set; }
//        public string Time { get; set; }
//    }
//}
