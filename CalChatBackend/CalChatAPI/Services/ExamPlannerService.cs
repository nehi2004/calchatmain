using CalChatAPI.Models;

namespace CalChatAPI.Services
{
    public class ExamPlannerService
    {
        public List<CalendarEvent> GenerateExamPlan(DateTime examDate)
        {
            examDate = DateTime.SpecifyKind(examDate, DateTimeKind.Utc);

            var plan = new List<CalendarEvent>();

            plan.Add(new CalendarEvent
            {
                Title = "Study Arrays",
                Date = examDate.AddDays(-7),
                Time = "18:00"
            });

            plan.Add(new CalendarEvent
            {
                Title = "Study Linked Lists",
                Date = examDate.AddDays(-5),
                Time = "18:00"
            });

            plan.Add(new CalendarEvent
            {
                Title = "Practice Questions",
                Date = examDate.AddDays(-3),
                Time = "18:00"
            });

            plan.Add(new CalendarEvent
            {
                Title = "Final Revision",
                Date = examDate.AddDays(-1),
                Time = "19:00"
            });

            return plan;
        }

    }
}
