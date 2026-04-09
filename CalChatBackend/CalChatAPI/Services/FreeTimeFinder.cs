//using CalChatAPI.Models;

//namespace CalChatAPI.Services
//{
//    public class FreeTimeFinder
//    {
//        public static List<string> FindFreeSlots(List<CalendarEvent> events, DateTime date)
//        {
//            var freeSlots = new List<string>();

//            // Working hours 9 AM → 6 PM
//            for (int hour = 9; hour <= 18; hour++)
//            {
//                var slot = $"{hour:D2}:00";

//                bool occupied = events.Any(e =>
//                    e.Date.Date == date.Date &&
//                    e.Time.StartsWith($"{hour:D2}")
//                );

//                if (!occupied)
//                {
//                    freeSlots.Add(slot);
//                }
//            }

//            return freeSlots;
//        }
//    }
//}



//using CalChatAPI.Models;

//namespace CalChatAPI.Services
//{
//    public class FreeTimeFinder
//    {
//        public static List<string> FindFreeSlots(List<CalendarEvent> events, DateTime date)
//        {
//            var freeSlots = new List<string>();

//            for (int hour = 9; hour <= 18; hour++)
//            {
//                var slot = new TimeSpan(hour, 0, 0).ToString(@"hh\:mm");

//                bool occupied = events.Any(e =>
//                    e.Date.Date == date.Date &&
//                    ScheduleAnalyzer.NormalizeTime(e.Time) == slot
//                );

//                if (!occupied)
//                {
//                    freeSlots.Add(slot);
//                }
//            }

//            return freeSlots;
//        }
//    }
//}
