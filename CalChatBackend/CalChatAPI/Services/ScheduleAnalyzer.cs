//using CalChatAPI.Models;

//namespace CalChatAPI.Services
//{
//    public class ScheduleAnalyzer
//    {
//        public static bool HasConflict(
//            List<CalendarEvent> events,
//            DateTime date,
//            string time)
//        {
//            return events.Any(e =>
//                e.Date.Date == date.Date &&
//                e.Time == time
//            );
//        }

//        public static List<string> SuggestFreeSlots(
//            List<CalendarEvent> events,
//            DateTime date)
//        {
//            var freeSlots = new List<string>();

//            var workingHours = new List<string>
//            {
//                "09:00","10:00","11:00","12:00",
//                "13:00","14:00","15:00","16:00","17:00"
//            };

//            foreach (var slot in workingHours)
//            {
//                bool occupied = events.Any(e =>
//                    e.Date.Date == date.Date &&
//                    e.Time == slot);

//                if (!occupied)
//                    freeSlots.Add(slot);
//            }

//            return freeSlots;
//        }
//    }
//}

//using CalChatAPI.Models;

//namespace CalChatAPI.Services
//{
//    public class ScheduleAnalyzer
//    {
//        public static bool HasConflict(
//            List<CalendarEvent> events,
//            DateTime date,
//            string time)
//        {
//            var normalizedTime = NormalizeTime(time);

//            return events.Any(e =>
//                e.Date.Date == date.Date &&
//                NormalizeTime(e.Time) == normalizedTime
//            );
//        }

//        public static string NormalizeTime(string time)
//        {
//            if (DateTime.TryParse(time, out DateTime parsed))
//            {
//                return parsed.ToString("HH:mm");
//            }

//            return time;
//        }
//    }
//}
