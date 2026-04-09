namespace CalChatAPI.Services
{
    public static class AIPersonality
    {
        public static string EventCreated()
        {
            var responses = new List<string>
            {
                "Nice! 🎉 Your event has been scheduled.",
                "Great planning! 📅 I've added it to your calendar.",
                "All set! ✅ Your event is now on the calendar.",
                "Awesome! 🚀 Your schedule has been updated."
            };

            return RandomResponse(responses);
        }

        public static string ConflictFound(string time)
        {
            return $"Looks like you're already busy at {time}. 😅";
        }

        public static string ScheduleOverview()
        {
            var responses = new List<string>
            {
                "📅 Here's what's coming up in your schedule:",
                "Let's take a look at your upcoming events:",
                "Here’s your calendar overview 👇"
            };

            return RandomResponse(responses);
        }

        private static string RandomResponse(List<string> responses)
        {
            var rand = new Random();
            return responses[rand.Next(responses.Count)];
        }
    }
}
