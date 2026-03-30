namespace CalChatAPI.Helpers
{
    public static class DateParser
    {
        public static DateTime ParseDate(string message)
        {
            var today = DateTime.Today;
            message = message.ToLower();

            if (message.Contains("tomorrow"))
                return today.AddDays(1);

            if (message.Contains("next monday"))
                return NextDayOfWeek(today, DayOfWeek.Monday);

            if (message.Contains("next tuesday"))
                return NextDayOfWeek(today, DayOfWeek.Tuesday);

            if (message.Contains("next wednesday"))
                return NextDayOfWeek(today, DayOfWeek.Wednesday);

            if (message.Contains("next thursday"))
                return NextDayOfWeek(today, DayOfWeek.Thursday);

            if (message.Contains("next friday"))
                return NextDayOfWeek(today, DayOfWeek.Friday);

            return today;
        }

        private static DateTime NextDayOfWeek(DateTime start, DayOfWeek day)
        {
            int daysToAdd = ((int)day - (int)start.DayOfWeek + 7) % 7;

            if (daysToAdd == 0)
                daysToAdd = 7;

            return start.AddDays(daysToAdd);
        }
    }
}
