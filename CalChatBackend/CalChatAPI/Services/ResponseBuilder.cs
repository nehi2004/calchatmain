//namespace CalChatAPI.Services
//{
//    public static class ResponseBuilder
//    {
//        // Greeting
//        public static object Greeting()
//        {
//            return new
//            {
//                reply = "Hello! 😊 I can help you manage your calendar. Try asking me to schedule a meeting."
//            };
//        }

//        // Help
//        public static object Help()
//        {
//            return new
//            {
//                reply = "Here are some things I can do:\n\n• Schedule a meeting\n• Check your free time\n• View your calendar"
//            };
//        }

//        // Small Talk (fix for your error)
//        public static object SmallTalk(string message)
//        {
//            message = message.ToLower();

//            if (message.Contains("how are you"))
//            {
//                return new
//                {
//                    reply = "I'm doing great! 😊 Ready to help manage your schedule."
//                };
//            }

//            if (message.Contains("thank"))
//            {
//                return new
//                {
//                    reply = "You're welcome! Happy to help."
//                };
//            }

//            if (message.Contains("good morning"))
//            {
//                return new
//                {
//                    reply = "Good morning! ☀️ What would you like to schedule today?"
//                };
//            }

//            if (message.Contains("good night"))
//            {
//                return new
//                {
//                    reply = "Good night! 🌙 Don't forget to check tomorrow's schedule."
//                };
//            }

//            return new
//            {
//                reply = "😊 I'm here to help with your calendar. Try asking me to schedule a meeting or check your events."
//            };
//        }

//        // Unknown
//        public static object Unknown()
//        {
//            return new
//            {
//                reply = "I'm not sure I understood that. You can ask me to schedule meetings or check your free time."
//            };
//        }
//    }
//}


namespace CalChatAPI.Services
{
    public static class ResponseBuilder
    {
        public static object Greeting()
        {
            var responses = new List<string>
            {
                "Hello! 😊 I'm your AI calendar assistant.",
                "Hi there! 📅 Ready to plan your day?",
                "Hey! I can help manage your schedule.",
                "Welcome! Tell me if you'd like to schedule something."
            };

            return new
            {
                reply = responses[new Random().Next(responses.Count)]
            };
        }

        public static object SmallTalk(string message)
        {
            message = message.ToLower();

            if (message.Contains("how are you"))
            {
                return new
                {
                    reply = "I'm doing great! 😊 Ready to help manage your schedule."
                };
            }


            if (message.Contains("good afternoon"))
            {
                return new
                {
                    reply = "Good afternoon! 😊 how was your day going."
                };
            }

            if (message.Contains("thank"))
            {
                return new
                {
                    reply = "You're welcome! Happy to help."
                };
            }

            if (message.Contains("good morning"))
            {
                return new
                {
                    reply = "Good morning! ☀️ Let's plan your day."
                };
            }

            if (message.Contains("gm"))
            {
                return new
                {
                    reply = "Good morning! ☀️ Let's plan your day."
                };
            }

            if (message.Contains("excellent"))
            {
                return new
                {
                    reply = "Execellent✌️! Thank you"
                };
            }


            if (message.Contains("good night"))
            {
                return new
                {
                    reply = "Good night! 🌙 Don't forget to check tomorrow's schedule."
                };
            }

            if (message.Contains("gn"))
            {
                return new
                {
                    reply = "Good night! 🌙 Don't forget to check tomorrow's schedule."
                };
            }

            if (message.Contains("who are you"))
            {
                return new
                {
                    reply = "I'm your AI assistant for managing schedules, meetings, and daily plans."
                };
            }

            return new
            {
                reply = "😊 I'm here to help manage your calendar, meetings, classes, workouts, and more."
            };
        }

        public static object Help()
        {
            return new
            {
                reply =
                "Here are things I can help with:\n\n" +
                "• Schedule meetings\n" +
                "• Add gym / study sessions\n" +
                "• Plan breakfast / lunch / dinner\n" +
                "• Show your calendar\n" +
                "• Find free time\n" +
                "• Reschedule events"
            };
        }

        public static object Unknown()
        {
            return new
            {
                reply = "I didn't fully understand. You can ask me to schedule events, check your calendar, or find free time."
            };
        }
    }
}
