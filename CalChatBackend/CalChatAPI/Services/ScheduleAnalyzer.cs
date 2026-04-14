

using CalChatAPI.Models;

namespace CalChatAPI.Services
{
    public class ScheduleAnalyzer
    {
        public static bool HasConflict(
            List<CalendarEvent> events,
            DateTime date,
            string time)
        {
            var normalizedTime = NormalizeTime(time);

            return events.Any(e =>
                e.Date.Date == date.Date &&
                NormalizeTime(e.Time) == normalizedTime
            );
        }

        public static string NormalizeTime(string time)
        {
            if (DateTime.TryParse(time, out DateTime parsed))
            {
                return parsed.ToString("HH:mm");
            }

            return time;
        }
    }
}
