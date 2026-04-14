

using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace CalChatAPI.Services
{
    public class AIService
    {
        private readonly ApplicationDbContext _context;
        private readonly HuggingFaceService _hfService;

        //private static Dictionary<string, CalendarEvent> _rescheduleMemory = new();

        public AIService(ApplicationDbContext context, HuggingFaceService hfService)
        {
            _context = context;
            _hfService = hfService;
        }
        public async Task<object> ProcessMessage(string userId, string message)
        {
            message = message.ToLower();

            // ==========================
            // EXAM PLANNER
            // ==========================

            if (message.Contains("exam"))
            {
                var examDate = ExtractDate(message);
                var subject = ExtractSubject(message);

                var plan = GenerateExamPlan(examDate, userId, subject);

                _context.CalendarEvents.AddRange(plan);
                await _context.SaveChangesAsync();

                var reply =
                    $"📚 Study plan created for your {subject} exam.\n\n" +
                    $"• {examDate.AddDays(-7):yyyy-MM-dd} Study Basics\n" +
                    $"• {examDate.AddDays(-5):yyyy-MM-dd} Advanced Topics\n" +
                    $"• {examDate.AddDays(-3):yyyy-MM-dd} Practice Questions\n" +
                    $"• {examDate.AddDays(-1):yyyy-MM-dd} Final Revision";

                return new { reply };
            }

            // ==========================
            // CHECK IF USER SELECTED EVENT
            // ==========================

            var events = await _context.CalendarEvents
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var selectedEvent = events.FirstOrDefault(e =>
                !string.IsNullOrEmpty(e.Title) &&
                message.Contains(e.Title.ToLower())
            );

            //if (!_rescheduleMemory.ContainsKey(userId) && selectedEvent != null && !message.Contains("reschedule"))
            //{
            //    _rescheduleMemory[userId] = selectedEvent;

            //    var reply = $"Is the current {selectedEvent.Title} time convenient for you, or should we reschedule?";

            //    return new { reply };
            //}

            // ==========================
            // WAITING FOR NEW TIME
            //// ==========================

            //if (_rescheduleMemory.ContainsKey(userId) &&
            //    (message.Contains("am") || message.Contains("pm")))
            //{
            //    var evMemory = _rescheduleMemory[userId];

            //    var newTime = ScheduleAnalyzer.NormalizeTime(message);

            //    var ev = await _context.CalendarEvents
            //        .FirstOrDefaultAsync(e => e.Id == evMemory.Id);

            //    if (ev == null)
            //        return new { reply = "Event not found." };

            //    ev.Time = newTime;

            //    await _context.SaveChangesAsync();

            //    _rescheduleMemory.Remove(userId);

            //    var reply = $"✅ Event rescheduled!\n\n{ev.Title} - {ev.Date:yyyy-MM-dd} {ev.Time}";

            //    return new { reply };
            //}

            // ==========================
            // INTENT DETECTION
            // ==========================

            var intent = IntentDetector.Detect(message);

            switch (intent)
            {
                case AIIntent.CREATE_EVENT:
                    return await HandleCreateEvent(userId, message);

                //case AIIntent.RESCHEDULE_EVENT:
                //    return await HandleReschedule(userId);

                case AIIntent.CHECK_SCHEDULE:
                    return await HandleCheckSchedule(userId, message);

                case AIIntent.FREE_TIME:
                    return await HandleFreeTime(userId, message);

                case AIIntent.DELETE_EVENT:
                    return new
                    {
                        action = "delete_event",
                        reply = "Which event would you like to delete?"
                    };

                case AIIntent.GREETING:
                    return ResponseBuilder.Greeting();

                case AIIntent.HELP:
                    return ResponseBuilder.Help();

                case AIIntent.CHAT:
                    return ResponseBuilder.SmallTalk(message);

                default:
                    return ResponseBuilder.Unknown();
            }
        }

        // ==========================
        // CREATE EVENT
        // ==========================

        private async Task<object> HandleCreateEvent(string userId, string message)
        {
            var extracted = EventExtractor.Extract(message);

            extracted.Time = ScheduleAnalyzer.NormalizeTime(extracted.Time);

            var events = await _context.CalendarEvents
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var conflict = ScheduleAnalyzer.HasConflict(events, extracted.Date, extracted.Time);

            if (conflict)
            {
                var freeSlots = FreeTimeFinder.FindFreeSlots(events, extracted.Date);

                var reply =
                    $"⚠️ That time is already booked.\n\n" +
                    $"Here are some available times:\n\n" +
                    $"🕘 {string.Join("\n🕘 ", freeSlots)}";

                return new
                {
                    action = "conflict",
                    reply
                };
            }

            var confirmReply =
                $"Great planning! 📅\n\n" +
                $"Title: {extracted.Title}\n" +
                $"Date: {extracted.Date:yyyy-MM-dd}\n" +
                $"Time: {extracted.Time}\n\n" +
                $"Should I add it to your calendar?";

            return new
            {
                action = "confirm_event",
                eventData = new
                {
                    title = extracted.Title,
                    date = extracted.Date,
                    time = extracted.Time
                },
                reply = confirmReply
            };
        }

        // ==========================
        // RESCHEDULE EVENT
        // ==========================

        //private async Task<object> HandleReschedule(string userId)
        //{
        //    var events = await _context.CalendarEvents
        //        .Where(e => e.UserId == userId)
        //        .OrderBy(e => e.Date)
        //        .Take(5)
        //        .ToListAsync();

        //    if (!events.Any())
        //    {
        //        return new { reply = "No events found to reschedule." };
        //    }

        //    var list = string.Join("\n",
        //        events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
        //    );

        //    return new
        //    {
        //        action = "reschedule_event",
        //        reply = $"Which event would you like to reschedule?\n\n{list}"
        //    };
        //}

        // ==========================
        // CHECK SCHEDULE
        // ==========================

        private async Task<object> HandleCheckSchedule(string userId, string message)
        {
            var today = DateTime.UtcNow.Date;

            IQueryable<CalendarEvent> query = _context.CalendarEvents
                .Where(e => e.UserId == userId);

            if (message.Contains("today"))
                query = query.Where(e => e.Date.Date == today);

            else if (message.Contains("upcoming"))
                query = query.Where(e => e.Date.Date > today);

            else if (!message.Contains("all"))
                query = query.Where(e => e.Date.Date >= today);

            var events = await query
                .OrderBy(e => e.Date)
                .Take(10)
                .ToListAsync();

            if (!events.Any())
                return new { reply = "📅 No events found." };

            var list = string.Join("\n",
                events.Select(e => $"• {e.Title} - {e.Date:yyyy-MM-dd} {e.Time}")
            );

            return new { reply = $"Here are your events 👇\n\n{list}" };
        }

        // ==========================
        // FREE TIME
        // ==========================

        private async Task<object> HandleFreeTime(string userId, string message)
        {
            var (date, _) = NaturalTimeParser.Parse(message);

            var events = await _context.CalendarEvents
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var freeSlots = FreeTimeFinder.FindFreeSlots(events, date);

            if (!freeSlots.Any())
                return new { reply = "😅 You are fully booked that day." };

            return new
            {
                reply = $"🕒 Free time on {date:yyyy-MM-dd}\n\n🕘 {string.Join("\n🕘 ", freeSlots)}"
            };
        }

        // ==========================
        // EXAM PLAN
        // ==========================

        private List<CalendarEvent> GenerateExamPlan(DateTime examDate, string userId, string subject)
        {
            examDate = examDate.ToUniversalTime();

            return new List<CalendarEvent>
            {
                new CalendarEvent
                {
                    Id = Guid.NewGuid(),
                    Title = $"Study {subject} Basics",
                    Date = examDate.AddDays(-7),
                    Time = "18:00",
                    UserId = userId
                },
                new CalendarEvent
                {
                    Id = Guid.NewGuid(),
                    Title = $"Study {subject} Advanced",
                    Date = examDate.AddDays(-5),
                    Time = "18:00",
                    UserId = userId
                },
                new CalendarEvent
                {
                    Id = Guid.NewGuid(),
                    Title = $"Practice {subject}",
                    Date = examDate.AddDays(-3),
                    Time = "19:00",
                    UserId = userId
                },
                new CalendarEvent
                {
                    Id = Guid.NewGuid(),
                    Title = $"Final Revision {subject}",
                    Date = examDate.AddDays(-1),
                    Time = "20:00",
                    UserId = userId
                }
            };
        }
        private DateTime ExtractDate(string message)
        {
            var parsed = NaturalTimeParser.Parse(message);
            return parsed.date;
        }

        private string ExtractSubject(string message)
        {
            if (message.Contains("data structures"))
                return "Data Structures";

            if (message.Contains("math"))
                return "Mathematics";

            if (message.Contains("physics"))
                return "Physics";

            return "Exam";
        }
    }
}