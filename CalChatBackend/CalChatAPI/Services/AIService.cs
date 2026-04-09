//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.EntityFrameworkCore;

//namespace CalChatAPI.Services
//{
//    public class AIService
//    {
//        private readonly ApplicationDbContext _context;

//        public AIService(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<object> ProcessMessage(string userId, string message)
//        {
//            var intent = IntentDetector.Detect(message);

//            switch (intent)
//            {
//                case AIIntent.CREATE_EVENT:
//                    return await HandleCreateEvent(userId, message);

//                case AIIntent.CHECK_SCHEDULE:
//                    return await HandleCheckSchedule(userId);

//                case AIIntent.DELETE_EVENT:
//                    return new
//                    {
//                        action = "delete_event",
//                        reply = "Which event would you like to delete?"
//                    };

//                case AIIntent.GREETING:
//                    return ResponseBuilder.Greeting();

//                case AIIntent.HELP:
//                    return ResponseBuilder.Help();

//                default:
//                    return ResponseBuilder.Unknown();
//            }
//        }

//        private async Task<object> HandleCreateEvent(string userId, string message)
//        {
//            // Extract event details
//            var extracted = EventExtractor.Extract(message);

//            // Get existing events
//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            // Check conflict
//            var conflict = ScheduleAnalyzer.HasConflict(
//                events,
//                extracted.Date,
//                extracted.Time
//            );

//            if (conflict)
//            {
//                var freeSlots = FreeTimeFinder.FindFreeSlots(events, extracted.Date);


//                return new
//                {
//                    action = "conflict",

//                    reply = $"⚠️ That time is already booked.\n\n" +
//        $"Here are some available times:\n\n" +
//        $"🕘 {string.Join("\n🕘 ", freeSlots.Take(3))}"

//                };
//            }

//            return new
//            {
//                action = "confirm_event",

//                eventData = extracted,

//                reply = $"Great planning! 📅\n\n" +
//                        $"Title: {extracted.Title}\n" +
//                        $"Date: {extracted.Date:yyyy-MM-dd}\n" +
//                        $"Time: {extracted.Time}\n\n" +
//                        $"Should I add it to your calendar?"
//            };
//        }

//        private async Task<object> HandleCheckSchedule(string userId)
//        {
//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .OrderBy(e => e.Date)
//                .Take(5)
//                .ToListAsync();

//            if (!events.Any())
//            {
//                return new
//                {
//                    reply = "📅 You don't have any upcoming events."
//                };
//            }

//            var eventList = string.Join("\n",
//                events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
//            );

//            var intro = AIPersonality.ScheduleOverview();

//            return new
//            {
//                reply = $"{intro}\n\n{eventList}"
//            };
//        }
//    }
//}
//=============================================================================================================

//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.EntityFrameworkCore;

//namespace CalChatAPI.Services
//{
//    public class AIService
//    {
//        private readonly ApplicationDbContext _context;

//        public AIService(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<object> ProcessMessage(string userId, string message)
//        {
//            message = message.ToLower();

//            // 🔹 Get last message from chat history
//            var lastMessage = await _context.AIChatHistories
//                .Where(x => x.UserId == userId)
//                .OrderByDescending(x => x.Timestamp)
//                .FirstOrDefaultAsync();

//            // 🔹 Context memory
//            if (lastMessage != null &&
//                lastMessage.Message.ToLower().Contains("what time") &&
//                (message.Contains("am") || message.Contains("pm")))
//            {
//                return new
//                {
//                    action = "confirm_event",
//                    reply = $"Got it 👍 Scheduling meeting at {message}. Should I add it to your calendar?"
//                };
//            }

//            var intent = IntentDetector.Detect(message);

//            switch (intent)
//            {
//                case AIIntent.CREATE_EVENT:
//                    return await HandleCreateEvent(userId, message);

//                case AIIntent.CHECK_SCHEDULE:
//                    return await HandleCheckSchedule(userId, message);

//                case AIIntent.FREE_TIME:
//                    return await HandleFreeTime(userId, message);

//                case AIIntent.DELETE_EVENT:
//                    return new
//                    {
//                        action = "delete_event",
//                        reply = "Which event would you like to delete?"
//                    };

//                case AIIntent.GREETING:
//                    return ResponseBuilder.Greeting();

//                case AIIntent.HELP:
//                    return ResponseBuilder.Help();

//                case AIIntent.CHAT:
//                    return ResponseBuilder.SmallTalk(message);

//                default:
//                    return ResponseBuilder.Unknown();
//            }
//        }

//        // 🔹 CREATE EVENT
//        private async Task<object> HandleCreateEvent(string userId, string message)
//        {
//            var extracted = EventExtractor.Extract(message);

//            extracted.Time = ScheduleAnalyzer.NormalizeTime(extracted.Time);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            // 🔍 DEBUG
//            Console.WriteLine("=================================");
//            Console.WriteLine("Requested Date: " + extracted.Date);
//            Console.WriteLine("Requested Time: " + extracted.Time);

//            foreach (var e in events)
//            {
//                Console.WriteLine("Existing Event: " + e.Date + " " + e.Time);
//            }
//            Console.WriteLine("=================================");

//            var conflict = ScheduleAnalyzer.HasConflict(
//                events,
//                extracted.Date,
//                extracted.Time
//            );

//            if (conflict)
//            {
//                var freeSlots = FreeTimeFinder.FindFreeSlots(events, extracted.Date);

//                return new
//                {
//                    action = "conflict",
//                    reply = $"⚠️ That time is already booked.\n\n" +
//                            $"Here are some available times:\n\n" +
//                            $"🕘 {string.Join("\n🕘 ", freeSlots)}"
//                };
//            }

//            return new
//            {
//                action = "confirm_event",
//                eventData = new
//                {
//                    title = extracted.Title,
//                    date = extracted.Date,
//                    time = extracted.Time
//                },
//                reply = $"Great planning! 📅\n\n" +
//                        $"Title: {extracted.Title}\n" +
//                        $"Date: {extracted.Date:yyyy-MM-dd}\n" +
//                        $"Time: {extracted.Time}\n\n" +
//                        $"Should I add it to your calendar?"
//            };
//        }

//        // 🔹 CHECK SCHEDULE
//        private async Task<object> HandleCheckSchedule(string userId, string message)
//        {
//            var today = DateTime.UtcNow.Date;

//            IQueryable<CalendarEvent> query = _context.CalendarEvents
//                .Where(e => e.UserId == userId);

//            if (message.Contains("today"))
//            {
//                query = query.Where(e => e.Date.Date == today);
//            }
//            else if (message.Contains("upcoming"))
//            {
//                query = query.Where(e => e.Date.Date > today);
//            }
//            else if (message.Contains("all"))
//            {
//                // show all events
//            }
//            else
//            {
//                query = query.Where(e => e.Date.Date >= today);
//            }

//            var events = await query
//                .OrderBy(e => e.Date)
//                .Take(10)
//                .ToListAsync();

//            if (!events.Any())
//            {
//                return new
//                {
//                    reply = "📅 No events found."
//                };
//            }

//            var eventList = string.Join("\n",
//                events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
//            );

//            return new
//            {
//                reply = $"Here are your events 👇\n\n{eventList}"
//            };
//        }

//        // 🔹 FREE TIME FINDER
//        private async Task<object> HandleFreeTime(string userId, string message)
//        {
//            var (date, _) = NaturalTimeParser.Parse(message);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            var freeSlots = FreeTimeFinder.FindFreeSlots(events, date);

//            if (!freeSlots.Any())
//            {
//                return new
//                {
//                    reply = "😅 You are fully booked that day."
//                };
//            }

//            return new
//            {
//                reply = $"🕒 Here are your free times on {date:yyyy-MM-dd}:\n\n" +
//                        $"🕘 {string.Join("\n🕘 ", freeSlots)}"
//            };
//        }
//    }
//}



//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.EntityFrameworkCore;

//namespace CalChatAPI.Services
//{
//    public class AIService
//    {
//        private readonly ApplicationDbContext _context;

//        // temporary memory for reschedule
//        private static Dictionary<string, CalendarEvent> _rescheduleMemory = new();

//        public AIService(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<object> ProcessMessage(string userId, string message)
//        {
//            message = message.ToLower();

//            // save user message
//            await SaveMessage(userId, "user", message);

//            // ==============================
//            // STEP 1 — If user already selected event
//            // ==============================

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            var selectedEvent = events.FirstOrDefault(e =>
//     (!string.IsNullOrEmpty(e.Title) && message.Contains(e.Title.ToLower())) ||
//     (!string.IsNullOrEmpty(e.Time) && message.Contains(e.Time.ToLower()))
// );


//            if (_rescheduleMemory.ContainsKey(userId) == false && selectedEvent != null && !message.Contains("reschedule"))

//            {
//                _rescheduleMemory[userId] = selectedEvent;

//                var reply = $"Is the current {selectedEvent.Title} time convenient for you, or should we reschedule? ";

//                await SaveMessage(userId, "assistant", reply);

//                return new { reply };
//            }

//            // ==============================
//            // STEP 2 — If waiting for new time
//            // ==============================
//            if (_rescheduleMemory.ContainsKey(userId) &&
//    (message.Contains("am") || message.Contains("pm")))
//            {
//                var evMemory = _rescheduleMemory[userId];

//                var newTime = ScheduleAnalyzer.NormalizeTime(message);

//                // get fresh event from database
//                var ev = await _context.CalendarEvents
//                    .FirstOrDefaultAsync(e => e.Id == evMemory.Id);

//                if (ev == null)
//                {
//                    return new { reply = "Event not found." };
//                }

//                ev.Time = newTime;

//                await _context.SaveChangesAsync();

//                _rescheduleMemory.Remove(userId);

//                var reply = $"✅ Event rescheduled!\n\n{ev.Title} - {ev.Date:yyyy-MM-dd} {ev.Time}";

//                await SaveMessage(userId, "assistant", reply);

//                return new { reply };
//            }

//            // ==============================
//            // NORMAL INTENT DETECTION
//            // ==============================

//            var intent = IntentDetector.Detect(message);

//            switch (intent)
//            {
//                case AIIntent.RESCHEDULE_EVENT:
//                    return await HandleReschedule(userId);

//                case AIIntent.CREATE_EVENT:
//                    return await HandleCreateEvent(userId, message);

//                case AIIntent.CHECK_SCHEDULE:
//                    return await HandleCheckSchedule(userId, message);

//                case AIIntent.FREE_TIME:
//                    return await HandleFreeTime(userId, message);

//                case AIIntent.DELETE_EVENT:
//                    {
//                        var reply = "Which event would you like to delete?";
//                        await SaveMessage(userId, "assistant", reply);

//                        return new
//                        {
//                            action = "delete_event",
//                            reply = reply
//                        };
//                    }

//                case AIIntent.GREETING:
//                    {
//                        dynamic result = ResponseBuilder.Greeting();
//                        await SaveMessage(userId, "assistant", result.reply);
//                        return result;
//                    }

//                case AIIntent.HELP:
//                    {
//                        dynamic result = ResponseBuilder.Help();
//                        await SaveMessage(userId, "assistant", result.reply);
//                        return result;
//                    }

//                case AIIntent.CHAT:
//                    {
//                        dynamic result = ResponseBuilder.SmallTalk(message);
//                        await SaveMessage(userId, "assistant", result.reply);
//                        return result;
//                    }

//                default:
//                    {
//                        dynamic result = ResponseBuilder.Unknown();
//                        await SaveMessage(userId, "assistant", result.reply);
//                        return result;
//                    }
//            }
//        }

//        // ==============================
//        // CREATE EVENT
//        // ==============================

//        private async Task<object> HandleCreateEvent(string userId, string message)
//        {
//            var extracted = EventExtractor.Extract(message);

//            extracted.Time = ScheduleAnalyzer.NormalizeTime(extracted.Time);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            var conflict = ScheduleAnalyzer.HasConflict(events, extracted.Date, extracted.Time);

//            if (conflict)
//            {
//                var freeSlots = FreeTimeFinder.FindFreeSlots(events, extracted.Date);

//                var reply =
//                    $"⚠️ That time is already booked.\n\n" +
//                    $"Here are some available times:\n\n" +
//                    $"🕘 {string.Join("\n🕘 ", freeSlots)}";

//                await SaveMessage(userId, "assistant", reply);

//                return new
//                {
//                    action = "conflict",
//                    reply = reply
//                };
//            }

//            var confirmReply =
//                $"Great planning! 📅\n\n" +
//                $"Title: {extracted.Title}\n" +
//                $"Date: {extracted.Date:yyyy-MM-dd}\n" +
//                $"Time: {extracted.Time}\n\n" +
//                $"Should I add it to your calendar?";

//            await SaveMessage(userId, "assistant", confirmReply);

//            return new
//            {
//                action = "confirm_event",
//                eventData = new
//                {
//                    title = extracted.Title,
//                    date = extracted.Date,
//                    time = extracted.Time
//                },
//                reply = confirmReply
//            };
//        }

//        // ==============================
//        // RESCHEDULE EVENT
//        // ==============================

//        private async Task<object> HandleReschedule(string userId)
//        {
//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .OrderBy(e => e.Date)
//                .Take(5)
//                .ToListAsync();

//            if (!events.Any())
//            {
//                var reply = "No events found to reschedule.";

//                await SaveMessage(userId, "assistant", reply);

//                return new { reply };
//            }

//            var list = string.Join("\n",
//                events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
//            );

//            var result = $"Which event would you like to reschedule?\n\n{list}";

//            await SaveMessage(userId, "assistant", result);

//            return new
//            {
//                action = "reschedule_event",
//                reply = result
//            };
//        }

//        // ==============================
//        // CHECK SCHEDULE
//        // ==============================

//        private async Task<object> HandleCheckSchedule(string userId, string message)
//        {
//            var today = DateTime.UtcNow.Date;

//            IQueryable<CalendarEvent> query = _context.CalendarEvents
//                .Where(e => e.UserId == userId);

//            if (message.Contains("today"))
//                query = query.Where(e => e.Date.Date == today);

//            else if (message.Contains("upcoming"))
//                query = query.Where(e => e.Date.Date > today);

//            else if (!message.Contains("all"))
//                query = query.Where(e => e.Date.Date >= today);

//            var events = await query
//                .OrderBy(e => e.Date)
//                .Take(10)
//                .ToListAsync();

//            if (!events.Any())
//            {
//                var reply = "📅 No events found.";

//                await SaveMessage(userId, "assistant", reply);

//                return new { reply };
//            }

//            var eventList = string.Join("\n",
//                events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
//            );

//            var resultReply = $"Here are your events 👇\n\n{eventList}";

//            await SaveMessage(userId, "assistant", resultReply);

//            return new { reply = resultReply };
//        }

//        // ==============================
//        // FREE TIME
//        // ==============================

//        private async Task<object> HandleFreeTime(string userId, string message)
//        {
//            var (date, _) = NaturalTimeParser.Parse(message);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            var freeSlots = FreeTimeFinder.FindFreeSlots(events, date);

//            if (!freeSlots.Any())
//            {
//                var reply = "😅 You are fully booked that day.";

//                await SaveMessage(userId, "assistant", reply);

//                return new { reply };
//            }

//            var result =
//                $"🕒 Here are your free times on {date:yyyy-MM-dd}:\n\n" +
//                $"🕘 {string.Join("\n🕘 ", freeSlots)}";

//            await SaveMessage(userId, "assistant", result);

//            return new { reply = result };
//        }

//        // ==============================
//        // SAVE CHAT
//        // ==============================

//        private async Task SaveMessage(string userId, string role, string message)
//        {
//            _context.AIChatHistories.Add(new AIChatHistory
//            {
//                UserId = userId,
//                Role = role,
//                Message = message,
//                Timestamp = DateTime.UtcNow
//            });

//            await _context.SaveChangesAsync();
//        }
//    }
//}



//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.EntityFrameworkCore;
//using System.Text.RegularExpressions;

//namespace CalChatAPI.Services
//{
//    public class AIService
//    {
//        private readonly ApplicationDbContext _context;

//        private static Dictionary<string, CalendarEvent> _rescheduleMemory = new();

//        public AIService(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<object> ProcessMessage(string userId, string message)
//        {
//            message = message.ToLower();

//            await SaveMessage(userId, "user", message);

//            // ==============================
//            // EXAM PLANNER
//            // ==============================

//            if (message.Contains("exam"))
//            {
//                var examDate = ExtractDate(message);
//                var subject = ExtractSubject(message);

//                var plan = GenerateExamPlan(examDate, userId, subject);

//                _context.CalendarEvents.AddRange(plan);
//                await _context.SaveChangesAsync();

//                var reply =
//                    $"📚 Study plan created for your {subject} exam.\n\n" +
//                    $"• {examDate.AddDays(-7):yyyy-MM-dd} Study Basics\n" +
//                    $"• {examDate.AddDays(-5):yyyy-MM-dd} Advanced Topics\n" +
//                    $"• {examDate.AddDays(-3):yyyy-MM-dd} Practice Questions\n" +
//                    $"• {examDate.AddDays(-1):yyyy-MM-dd} Final Revision";

//                await SaveMessage(userId, "assistant", reply);

//                return new { reply };
//            }

//            // ==============================
//            // INTENT DETECTION
//            // ==============================

//            var intent = IntentDetector.Detect(message);

//            switch (intent)
//            {
//                case AIIntent.CREATE_EVENT:
//                    return await HandleCreateEvent(userId, message);

//                case AIIntent.RESCHEDULE_EVENT:
//                    return await HandleReschedule(userId);

//                case AIIntent.CHECK_SCHEDULE:
//                    return await HandleCheckSchedule(userId, message);

//                case AIIntent.FREE_TIME:
//                    return await HandleFreeTime(userId, message);

//                case AIIntent.GREETING:
//                    return ResponseBuilder.Greeting();

//                case AIIntent.HELP:
//                    return ResponseBuilder.Help();

//                case AIIntent.CHAT:
//                    return ResponseBuilder.SmallTalk(message);

//                default:
//                    return ResponseBuilder.Unknown();
//            }

//        }

//        // ==============================
//        // CREATE EVENT
//        // ==============================

//        private async Task<object> HandleCreateEvent(string userId, string message)
//        {
//            var extracted = EventExtractor.Extract(message);

//            extracted.Time = ScheduleAnalyzer.NormalizeTime(extracted.Time);

//            var newEvent = new CalendarEvent
//            {
//                Id = Guid.NewGuid(),
//                Title = extracted.Title,
//                Date = extracted.Date.ToUniversalTime(),
//                Time = extracted.Time,
//                Type = "Meeting",
//                Priority = "Medium",
//                Color = "#3b82f6",
//                UserId = userId
//            };

//            _context.CalendarEvents.Add(newEvent);
//            await _context.SaveChangesAsync();

//            var reply =
//                $"📅 Event created!\n\n" +
//                $"{newEvent.Title}\n" +
//                $"{newEvent.Date:yyyy-MM-dd} {newEvent.Time}";

//            await SaveMessage(userId, "assistant", reply);

//            return new { reply };
//        }

//        // ==============================
//        // RESCHEDULE
//        // ==============================

//        private async Task<object> HandleReschedule(string userId)
//        {
//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .OrderBy(e => e.Date)
//                .Take(5)
//                .ToListAsync();

//            if (!events.Any())
//                return new { reply = "No events found." };

//            var list = string.Join("\n",
//                events.Select(e => $"• {e.Title} {e.Date:yyyy-MM-dd} {e.Time}")
//            );

//            return new
//            {
//                reply = $"Which event would you like to reschedule?\n\n{list}"
//            };
//        }

//        // ==============================
//        // CHECK SCHEDULE
//        // ==============================

//        private async Task<object> HandleCheckSchedule(string userId, string message)
//        {
//            var today = DateTime.UtcNow.Date;

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId && e.Date >= today)
//                .OrderBy(e => e.Date)
//                .Take(10)
//                .ToListAsync();

//            if (!events.Any())
//                return new { reply = "📅 No upcoming events." };

//            var list = string.Join("\n",
//                events.Select(e => $"• {e.Title} {e.Date:yyyy-MM-dd} {e.Time}")
//            );

//            return new { reply = $"Here are your events:\n\n{list}" };
//        }

//        // ==============================
//        // FREE TIME
//        // ==============================

//        private async Task<object> HandleFreeTime(string userId, string message)
//        {
//            var (date, _) = NaturalTimeParser.Parse(message);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId && e.Date.Date == date.Date)
//                .ToListAsync();

//            var freeSlots = FreeTimeFinder.FindFreeSlots(events, date);

//            if (!freeSlots.Any())
//                return new { reply = "😅 No free time that day." };

//            var result =
//                $"Free time on {date:yyyy-MM-dd}\n\n" +
//                string.Join("\n", freeSlots);

//            return new { reply = result };
//        }

//        // ==============================
//        // EXAM PLAN GENERATOR
//        // ==============================

//        private List<CalendarEvent> GenerateExamPlan(DateTime examDate, string userId, string subject)
//        {
//            examDate = examDate.ToUniversalTime();

//            return new List<CalendarEvent>
//    {
//        new CalendarEvent
//        {
//            Id = Guid.NewGuid(),
//            Title = $"Study {subject} Basics",
//            Date = examDate.AddDays(-7).ToUniversalTime(),
//            Time = "18:00",
//            UserId = userId
//        },

//        new CalendarEvent
//        {
//            Id = Guid.NewGuid(),
//            Title = $"Study {subject} Advanced",
//            Date = examDate.AddDays(-5).ToUniversalTime(),
//            Time = "18:00",
//            UserId = userId
//        },

//        new CalendarEvent
//        {
//            Id = Guid.NewGuid(),
//            Title = $"Practice {subject}",
//            Date = examDate.AddDays(-3).ToUniversalTime(),
//            Time = "19:00",
//            UserId = userId
//        },

//        new CalendarEvent
//        {
//            Id = Guid.NewGuid(),
//            Title = $"Final Revision {subject}",
//            Date = examDate.AddDays(-1).ToUniversalTime(),
//            Time = "20:00",
//            UserId = userId
//        }
//    };
//        }

//        // ==============================
//        // DATE EXTRACTOR
//        // ==============================
//        private DateTime ExtractDate(string message)
//        {
//            var match = Regex.Match(message, @"\d{1,2}\s+\w+");

//            if (match.Success)
//                return DateTime.Parse(match.Value).ToUniversalTime();

//            return DateTime.UtcNow.AddDays(7);
//        }


//        // ==============================
//        // SUBJECT DETECTOR
//        // ==============================

//        private string ExtractSubject(string message)
//        {
//            if (message.Contains("data structures"))
//                return "Data Structures";

//            if (message.Contains("math"))
//                return "Mathematics";

//            if (message.Contains("physics"))
//                return "Physics";

//            return "Exam";
//        }

//        // ==============================
//        // SAVE CHAT
//        // ==============================

//        private async Task SaveMessage(string userId, string role, string message)
//        {
//            _context.AIChatHistories.Add(new AIChatHistory
//            {
//                UserId = userId,
//                Role = role,
//                Message = message,
//                Timestamp = DateTime.UtcNow
//            });

//            await _context.SaveChangesAsync();
//        }
//    }
//}


//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.EntityFrameworkCore;
//using System.Text.RegularExpressions;

//namespace CalChatAPI.Services
//{
//    public class AIService
//    {
//        private readonly ApplicationDbContext _context;

//        //private static Dictionary<string, CalendarEvent> _rescheduleMemory = new();

//        public AIService(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<object> ProcessMessage(string userId, string message)
//        {
//            message = message.ToLower();

//            // ==========================
//            // EXAM PLANNER
//            // ==========================

//            if (message.Contains("exam"))
//            {
//                var examDate = ExtractDate(message);
//                var subject = ExtractSubject(message);

//                var plan = GenerateExamPlan(examDate, userId, subject);

//                _context.CalendarEvents.AddRange(plan);
//                await _context.SaveChangesAsync();

//                var reply =
//                    $"📚 Study plan created for your {subject} exam.\n\n" +
//                    $"• {examDate.AddDays(-7):yyyy-MM-dd} Study Basics\n" +
//                    $"• {examDate.AddDays(-5):yyyy-MM-dd} Advanced Topics\n" +
//                    $"• {examDate.AddDays(-3):yyyy-MM-dd} Practice Questions\n" +
//                    $"• {examDate.AddDays(-1):yyyy-MM-dd} Final Revision";

//                return new { reply };
//            }

//            // ==========================
//            // CHECK IF USER SELECTED EVENT
//            // ==========================

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            var selectedEvent = events.FirstOrDefault(e =>
//                !string.IsNullOrEmpty(e.Title) &&
//                message.Contains(e.Title.ToLower())
//            );

//            //if (!_rescheduleMemory.ContainsKey(userId) && selectedEvent != null && !message.Contains("reschedule"))
//            //{
//            //    _rescheduleMemory[userId] = selectedEvent;

//            //    var reply = $"Is the current {selectedEvent.Title} time convenient for you, or should we reschedule?";

//            //    return new { reply };
//            //}

//            // ==========================
//            // WAITING FOR NEW TIME
//            //// ==========================

//            //if (_rescheduleMemory.ContainsKey(userId) &&
//            //    (message.Contains("am") || message.Contains("pm")))
//            //{
//            //    var evMemory = _rescheduleMemory[userId];

//            //    var newTime = ScheduleAnalyzer.NormalizeTime(message);

//            //    var ev = await _context.CalendarEvents
//            //        .FirstOrDefaultAsync(e => e.Id == evMemory.Id);

//            //    if (ev == null)
//            //        return new { reply = "Event not found." };

//            //    ev.Time = newTime;

//            //    await _context.SaveChangesAsync();

//            //    _rescheduleMemory.Remove(userId);

//            //    var reply = $"✅ Event rescheduled!\n\n{ev.Title} - {ev.Date:yyyy-MM-dd} {ev.Time}";

//            //    return new { reply };
//            //}

//            // ==========================
//            // INTENT DETECTION
//            // ==========================

//            var intent = IntentDetector.Detect(message);

//            switch (intent)
//            {
//                case AIIntent.CREATE_EVENT:
//                    return await HandleCreateEvent(userId, message);

//                //case AIIntent.RESCHEDULE_EVENT:
//                //    return await HandleReschedule(userId);

//                case AIIntent.CHECK_SCHEDULE:
//                    return await HandleCheckSchedule(userId, message);

//                case AIIntent.FREE_TIME:
//                    return await HandleFreeTime(userId, message);

//                case AIIntent.DELETE_EVENT:
//                    return new
//                    {
//                        action = "delete_event",
//                        reply = "Which event would you like to delete?"
//                    };

//                case AIIntent.GREETING:
//                    return ResponseBuilder.Greeting();

//                case AIIntent.HELP:
//                    return ResponseBuilder.Help();

//                case AIIntent.CHAT:
//                    return ResponseBuilder.SmallTalk(message);

//                default:
//                    return ResponseBuilder.Unknown();
//            }
//        }

//        // ==========================
//        // CREATE EVENT
//        // ==========================

//        private async Task<object> HandleCreateEvent(string userId, string message)
//        {
//            var extracted = EventExtractor.Extract(message);

//            extracted.Time = ScheduleAnalyzer.NormalizeTime(extracted.Time);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            var conflict = ScheduleAnalyzer.HasConflict(events, extracted.Date, extracted.Time);

//            if (conflict)
//            {
//                var freeSlots = FreeTimeFinder.FindFreeSlots(events, extracted.Date);

//                var reply =
//                    $"⚠️ That time is already booked.\n\n" +
//                    $"Here are some available times:\n\n" +
//                    $"🕘 {string.Join("\n🕘 ", freeSlots)}";

//                return new
//                {
//                    action = "conflict",
//                    reply
//                };
//            }

//            var confirmReply =
//                $"Great planning! 📅\n\n" +
//                $"Title: {extracted.Title}\n" +
//                $"Date: {extracted.Date:yyyy-MM-dd}\n" +
//                $"Time: {extracted.Time}\n\n" +
//                $"Should I add it to your calendar?";

//            return new
//            {
//                action = "confirm_event",
//                eventData = new
//                {
//                    title = extracted.Title,
//                    date = extracted.Date,
//                    time = extracted.Time
//                },
//                reply = confirmReply
//            };
//        }

//        // ==========================
//        // RESCHEDULE EVENT
//        // ==========================

//        //private async Task<object> HandleReschedule(string userId)
//        //{
//        //    var events = await _context.CalendarEvents
//        //        .Where(e => e.UserId == userId)
//        //        .OrderBy(e => e.Date)
//        //        .Take(5)
//        //        .ToListAsync();

//        //    if (!events.Any())
//        //    {
//        //        return new { reply = "No events found to reschedule." };
//        //    }

//        //    var list = string.Join("\n",
//        //        events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
//        //    );

//        //    return new
//        //    {
//        //        action = "reschedule_event",
//        //        reply = $"Which event would you like to reschedule?\n\n{list}"
//        //    };
//        //}

//        // ==========================
//        // CHECK SCHEDULE
//        // ==========================

//        private async Task<object> HandleCheckSchedule(string userId, string message)
//        {
//            var today = DateTime.UtcNow.Date;

//            IQueryable<CalendarEvent> query = _context.CalendarEvents
//                .Where(e => e.UserId == userId);

//            if (message.Contains("today"))
//                query = query.Where(e => e.Date.Date == today);

//            else if (message.Contains("upcoming"))
//                query = query.Where(e => e.Date.Date > today);

//            else if (!message.Contains("all"))
//                query = query.Where(e => e.Date.Date >= today);

//            var events = await query
//                .OrderBy(e => e.Date)
//                .Take(10)
//                .ToListAsync();

//            if (!events.Any())
//                return new { reply = "📅 No events found." };

//            var list = string.Join("\n",
//                events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
//            );

//            return new { reply = $"Here are your events 👇\n\n{list}" };
//        }

//        // ==========================
//        // FREE TIME
//        // ==========================

//        private async Task<object> HandleFreeTime(string userId, string message)
//        {
//            var (date, _) = NaturalTimeParser.Parse(message);

//            var events = await _context.CalendarEvents
//                .Where(e => e.UserId == userId)
//                .ToListAsync();

//            var freeSlots = FreeTimeFinder.FindFreeSlots(events, date);

//            if (!freeSlots.Any())
//                return new { reply = "😅 You are fully booked that day." };

//            return new
//            {
//                reply = $"🕒 Free time on {date:yyyy-MM-dd}\n\n🕘 {string.Join("\n🕘 ", freeSlots)}"
//            };
//        }

//        // ==========================
//        // EXAM PLAN
//        // ==========================

//        private List<CalendarEvent> GenerateExamPlan(DateTime examDate, string userId, string subject)
//        {
//            examDate = examDate.ToUniversalTime();

//            return new List<CalendarEvent>
//            {
//                new CalendarEvent
//                {
//                    Id = Guid.NewGuid(),
//                    Title = $"Study {subject} Basics",
//                    Date = examDate.AddDays(-7),
//                    Time = "18:00",
//                    UserId = userId
//                },
//                new CalendarEvent
//                {
//                    Id = Guid.NewGuid(),
//                    Title = $"Study {subject} Advanced",
//                    Date = examDate.AddDays(-5),
//                    Time = "18:00",
//                    UserId = userId
//                },
//                new CalendarEvent
//                {
//                    Id = Guid.NewGuid(),
//                    Title = $"Practice {subject}",
//                    Date = examDate.AddDays(-3),
//                    Time = "19:00",
//                    UserId = userId
//                },
//                new CalendarEvent
//                {
//                    Id = Guid.NewGuid(),
//                    Title = $"Final Revision {subject}",
//                    Date = examDate.AddDays(-1),
//                    Time = "20:00",
//                    UserId = userId
//                }
//            };
//        }
//        private DateTime ExtractDate(string message)
//        {
//            var parsed = NaturalTimeParser.Parse(message);
//            return parsed.date;
//        }

//        private string ExtractSubject(string message)
//        {
//            if (message.Contains("data structures"))
//                return "Data Structures";

//            if (message.Contains("math"))
//                return "Mathematics";

//            if (message.Contains("physics"))
//                return "Physics";

//            return "Exam";
//        }
//    }
//}


//using OpenAIChat = OpenAI.Chat;
//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using Microsoft.EntityFrameworkCore;

//namespace CalChatAPI.Services
//{
//    public class AIService
//    {
//        private readonly IConfiguration _config;
//        private readonly ApplicationDbContext _context;

//        public AIService(IConfiguration config, ApplicationDbContext context)
//        {
//            _config = config;
//            _context = context;
//        }

//        public async Task<object> ProcessMessage(string userId, string message)
//        {
//            var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");

//            if (string.IsNullOrEmpty(apiKey))
//            {
//                return new { reply = "❌ API key missing" };
//            }
//            var client = new OpenAIChat.ChatClient("gpt-3.5-turbo", apiKey);


//            // 🔥 GET LAST 10 MESSAGES
//            var history = await _context.AIChatHistories
//                .Where(x => x.UserId == userId)
//                .OrderByDescending(x => x.Timestamp)
//                .Take(10)
//                .ToListAsync();

//            // ✅ IMPORTANT: OpenAI wala ChatMessage use ho raha hai
//            var messages = new List<OpenAIChat.ChatMessage>();

//            // ✅ SYSTEM MESSAGE
//            messages.Add(OpenAIChat.ChatMessage.CreateSystemMessage(@"
//You are a smart AI assistant like ChatGPT.

//You can:
//- chat normally
//- schedule events
//- understand natural language

//If user wants to create event → return JSON:

//{
//  ""action"": ""confirm_event"",
//  ""eventData"": {
//    ""title"": """",
//    ""date"": """",
//    ""time"": """"
//  },
//  ""reply"": ""friendly message""
//}

//Otherwise return:
//{
//  ""reply"": ""normal answer""
//}
//"));

//            // ✅ HISTORY
//            foreach (var h in history.OrderBy(x => x.Timestamp))
//            {
//                if (h.Role == "user")
//                {
//                    messages.Add(OpenAIChat.ChatMessage.CreateUserMessage(h.Message));
//                }
//                else
//                {
//                    messages.Add(OpenAIChat.ChatMessage.CreateAssistantMessage(h.Message));
//                }
//            }

//            // ✅ CURRENT USER MESSAGE
//            messages.Add(OpenAIChat.ChatMessage.CreateUserMessage(message));

//            // 🔥 CALL OPENAI
//            var response = await client.CompleteChatAsync(messages);

//            var text = response?.Value?.Content?.FirstOrDefault()?.Text
//                       ?? "⚠️ AI returned empty response";


//            return ParseResponse(text);
//        }

//        private object ParseResponse(string text)
//        {
//            try
//            {
//                return System.Text.Json.JsonSerializer.Deserialize<object>(text);
//            }
//            catch
//            {
//                return new { reply = text };
//            }
//        }
//    }
//}
using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CalChatAPI.Services
{
    public class AIService
    {
        private readonly ApplicationDbContext _context;

        public AIService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object> ProcessMessage(string userId, string message)
        {
            var apiKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");

            if (string.IsNullOrEmpty(apiKey))
            {
                return new { reply = "❌ OpenRouter API key missing" };
            }

            // 🔥 GET LAST 10 MESSAGES
            var history = await _context.AIChatHistories
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.Timestamp)
                .Take(10)
                .ToListAsync();

            var messages = new List<object>();

            // ✅ SYSTEM PROMPT
            messages.Add(new
            {
                role = "system",
                content = @"You are a smart AI assistant like ChatGPT.

If user wants to create event → return JSON:
{
  ""action"": ""confirm_event"",
  ""eventData"": {
    ""title"": """",
    ""date"": """",
    ""time"": """"
  },
  ""reply"": ""friendly message""
}

Otherwise:
{
  ""reply"": ""normal answer""
}"
            });

            // ✅ HISTORY
            foreach (var h in history.OrderBy(x => x.Timestamp))
            {
                messages.Add(new
                {
                    role = h.Role == "user" ? "user" : "assistant",
                    content = h.Message
                });
            }

            // ✅ CURRENT MESSAGE
            messages.Add(new
            {
                role = "user",
                content = message
            });

            // 🔥 HTTP CLIENT
            var client = new HttpClient();

            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            // ✅ REQUIRED HEADERS (IMPORTANT)
            client.DefaultRequestHeaders.Add("HTTP-Referer", "https://calchatmain-le3p.vercel.app");
            client.DefaultRequestHeaders.Add("X-Title", "CalChat AI");

            // ✅ BEST FREE MODEL (AUTO)
            var requestBody = new
            {
                model = "openrouter/auto",
                messages = messages
            };

            var json = JsonSerializer.Serialize(requestBody);

            var response = await client.PostAsync(
                "https://openrouter.ai/api/v1/chat/completions",
                new StringContent(json, Encoding.UTF8, "application/json")
            );

            var responseString = await response.Content.ReadAsStringAsync();

            // ❌ ERROR HANDLE
            if (!response.IsSuccessStatusCode)
            {
                return new
                {
                    reply = "❌ AI error",
                    raw = responseString
                };
            }

            // ✅ PARSE RESPONSE
            var result = JsonDocument.Parse(responseString);

            var reply = result
                .RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return ParseResponse(reply ?? "⚠️ Empty response");
        }

        private object ParseResponse(string text)
        {
            try
            {
                return JsonSerializer.Deserialize<object>(text);
            }
            catch
            {
                return new { reply = text };
            }
        }
    }
}

