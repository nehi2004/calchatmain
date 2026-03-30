//using System.Text.RegularExpressions;

//namespace CalChatAPI.Services
//{
//    public static class NaturalTimeParser
//    {
//        public static (DateTime date, string time) Parse(string message)
//        {
//            message = message.ToLower();

//            var date = DateTime.UtcNow.Date;
//            var time = "10:00";

//            // DATE PARSING
//            if (message.Contains("tomorrow"))
//            {
//                date = DateTime.UtcNow.Date.AddDays(1);
//            }

//            if (message.Contains("today"))
//            {
//                date = DateTime.UtcNow.Date;
//            }

//            // TIME PARSING (HH:MM)
//            var match = Regex.Match(message, @"\b([0-2]?[0-9]):([0-5][0-9])\b");

//            if (match.Success)
//            {
//                time = $"{int.Parse(match.Groups[1].Value):D2}:{match.Groups[2].Value}";
//                return (date, time);
//            }

//            // TIME PARSING (AM/PM)
//            var match2 = Regex.Match(message, @"\b([0-9]{1,2})\s?(am|pm)\b");

//            if (match2.Success)
//            {
//                int hour = int.Parse(match2.Groups[1].Value);
//                var period = match2.Groups[2].Value;

//                if (period == "pm" && hour < 12)
//                    hour += 12;

//                if (period == "am" && hour == 12)
//                    hour = 0;

//                time = $"{hour:D2}:00";
//            }

//            // fallback keywords
//            if (message.Contains("morning"))
//                time = "09:00";

//            if (message.Contains("afternoon"))
//                time = "14:00";

//            if (message.Contains("evening"))
//                time = "18:00";

//            if (message.Contains("tonight"))
//                time = "20:00";

//            // meal time keywords
//            if (message.Contains("breakfast"))
//                time = "08:00";

//            if (message.Contains("lunch"))
//                time = "13:00";

//            if (message.Contains("dinner"))
//                time = "20:00";

//            // health lifestyle
//            if (message.Contains("gym"))
//                time = "18:00";

//            if (message.Contains("workout"))
//                time = "18:00";

//            if (message.Contains("study"))
//                time = "19:00";

//            return (date, time);
//        }
//    }
//}
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace CalChatAPI.Services
{
    public static class NaturalTimeParser
    {
        public static (DateTime date, string time) Parse(string message)
        {
            message = message.ToLower();

            var date = DateTime.Now.Date;
            var time = "10:00";

            // -------------------------
            // TODAY / TOMORROW
            // -------------------------

            if (message.Contains("tomorrow"))
            {
                date = DateTime.Now.Date.AddDays(1);
            }

            if (message.Contains("today"))
            {
                date = DateTime.Now.Date;
            }

            // -------------------------
            // WEEKDAY PARSING
            // -------------------------

            var days = new Dictionary<string, DayOfWeek>()
            {
                { "monday", DayOfWeek.Monday },
                { "tuesday", DayOfWeek.Tuesday },
                { "wednesday", DayOfWeek.Wednesday },
                { "thursday", DayOfWeek.Thursday },
                { "friday", DayOfWeek.Friday },
                { "saturday", DayOfWeek.Saturday },
                { "sunday", DayOfWeek.Sunday }
            };

            foreach (var day in days)
            {
                if (message.Contains(day.Key))
                {
                    int diff = day.Value - DateTime.Now.DayOfWeek;

                    if (diff <= 0)
                        diff += 7;

                    date = DateTime.Now.Date.AddDays(diff);
                    break;
                }
            }

            // -------------------------
            // TIME HH:MM
            // -------------------------

            var match = Regex.Match(message, @"\b([0-2]?[0-9]):([0-5][0-9])\b");

            if (match.Success)
            {
                time = $"{int.Parse(match.Groups[1].Value):D2}:{match.Groups[2].Value}";
                return (date, time);
            }

            // -------------------------
            // TIME AM / PM
            // -------------------------

            var match2 = Regex.Match(message, @"\b([0-9]{1,2})\s?(am|pm)\b");

            if (match2.Success)
            {
                int hour = int.Parse(match2.Groups[1].Value);
                var period = match2.Groups[2].Value;

                if (period == "pm" && hour < 12)
                    hour += 12;

                if (period == "am" && hour == 12)
                    hour = 0;

                time = $"{hour:D2}:00";
            }

            return (date, time);
        }
    }
}
