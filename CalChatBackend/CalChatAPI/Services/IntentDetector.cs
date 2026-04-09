
//namespace CalChatAPI.Services
//{
//    public static class IntentDetector
//    {
//        public static AIIntent Detect(string message)
//        {
//            message = message.ToLower();

//            // RESCHEDULE EVENT (must come first)
//            if (message.Contains("reschedule") ||
//                message.Contains("move") ||
//                message.Contains("change time") ||
//                message.Contains("postpone"))
//            {
//                return AIIntent.RESCHEDULE_EVENT;
//            }

//            // CHECK SCHEDULE
//            if (message.Contains("show") ||
//                message.Contains("what") ||
//                message.Contains("check") ||
//                message.Contains("view") ||
//                message.Contains("calendar") ||
//                message.Contains("events"))
//            {
//                return AIIntent.CHECK_SCHEDULE;
//            }

//            // FREE TIME
//            if (message.Contains("free time") ||
//                message.Contains("when am i free") ||
//                message.Contains("available") ||
//                message.Contains("availability"))
//            {
//                return AIIntent.FREE_TIME;
//            }

//            // CREATE EVENT
//            if (message.Contains("schedule") ||
//                message.Contains("create") ||
//                message.Contains("add") ||
//                message.Contains("meeting") ||
//                message.Contains("event"))
//            {
//                return AIIntent.CREATE_EVENT;
//            }

//            // DELETE EVENT
//            if (message.Contains("delete") ||
//                message.Contains("remove") ||
//                message.Contains("cancel event"))
//            {
//                return AIIntent.DELETE_EVENT;
//            }

//            // GREETING
//            if (message.Contains("hello") ||
//                message.Contains("hi") ||
//                message.Contains("hey"))
//            {
//                return AIIntent.GREETING;
//            }

//            // HELP
//            if (message.Contains("help"))
//            {
//                return AIIntent.HELP;
//            }

//            return AIIntent.CHAT;
//        }
//    }
//}


namespace CalChatAPI.Services
{
    public static class IntentDetector
    {
        public static AIIntent Detect(string message)
        {
            message = message.ToLower().Trim();

            // =====================
            // CHECK SCHEDULE
            // =====================

            if (message.Contains("show my schedule") ||
                message.Contains("show schedule") ||
                message.Contains("what's my schedule") ||
                message.Contains("my calendar") ||
                message.Contains("today plan") ||
                message.Contains("what do i have") ||
                message.Contains("show events") ||
                message.Contains("check calendar") ||
                message.Contains("Remind me about my task") ||
                message.Contains("view schedule"))
            {
                return AIIntent.CHECK_SCHEDULE;
            }
            // =====================
            // RESCHEDULE EVENT
            // =====================

            //if (message.Contains("reschedule") ||
            //    message.Contains("move ") ||
            //    message.Contains("change time") ||
            //    message.Contains("postpone") ||
            //    message.Contains("shift"))
            //{
            //    return AIIntent.RESCHEDULE_EVENT;
            //}



            // =====================
            // FREE TIME
            // =====================

            if (message.Contains("free time") ||
                message.Contains("when am i free") ||
                message.Contains("available time") ||
                message.Contains("availability") ||
                message.Contains("any free slot") ||
                message.Contains("am i free"))
            {
                return AIIntent.FREE_TIME;
            }

            // =====================
            // CREATE EVENT
            // =====================

            if (
                // avoid reschedule confusion
                (message.Contains("schedule ") && !message.Contains("reschedule")) ||

                message.Contains("create") ||
                message.Contains("add event") ||
                message.Contains("plan") ||
                message.Contains("set meeting") ||

                // professional
                message.Contains("meeting") ||
                message.Contains("client meeting") ||
                message.Contains("office meeting") ||

                // student
                message.Contains("class") ||
                message.Contains("lecture") ||
                message.Contains("study") ||
                message.Contains("exam") ||

                // health
                message.Contains("gym") ||
                message.Contains("workout") ||
                message.Contains("doctor") ||
                message.Contains("appointment") ||

                // daily life
                message.Contains("breakfast") ||
                message.Contains("lunch") ||
                message.Contains("dinner") ||

                // travel
                message.Contains("train") ||
                message.Contains("flight") ||
                message.Contains("travel")
            )
            {
                return AIIntent.CREATE_EVENT;
            }

            // =====================
            // DELETE EVENT
            // =====================

            if (message.Contains("delete") ||
                message.Contains("remove") ||
                message.Contains("cancel event") ||
                message.Contains("cancel meeting"))
            {
                return AIIntent.DELETE_EVENT;
            }

            // =====================
            // GREETING
            // =====================

            if (message.Contains("hello") ||
                message.Contains("hi") ||
                message.Contains("hey") ||
                message.Contains("good morning") ||
                message.Contains("good afternoon") ||
                message.Contains("good evening"))
            {
                return AIIntent.GREETING;
            }

            // =====================
            // HELP
            // =====================

            if (message.Contains("help") ||
                message.Contains("what can you do") ||
                message.Contains("commands") ||
                message.Contains("features"))
            {
                return AIIntent.HELP;
            }

            return AIIntent.CHAT;
        }
    }
}
