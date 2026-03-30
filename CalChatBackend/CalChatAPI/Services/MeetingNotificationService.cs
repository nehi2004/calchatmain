using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;

public class MeetingNotificationService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public MeetingNotificationService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var now = DateTime.UtcNow;

            var meetings = await context.Meetings
                .Include(m => m.Participants)
                .ToListAsync();

            foreach (var meeting in meetings)
            {
                // ⏰ REMINDER (1 HOUR BEFORE)
                if (now >= meeting.StartTime.AddHours(-1) && now < meeting.StartTime)
                {
                    foreach (var p in meeting.Participants)
                    {
                        bool alreadySent = context.Notifications.Any(n =>
                            n.Type == "meeting-reminder" &&
                            n.ToUserId == p.UserId &&
                            n.Content.Contains(meeting.Title));

                        if (!alreadySent)
                        {
                            context.Notifications.Add(new Notification
                            {
                                FromUserId = meeting.OrganizerId,
                                ToUserId = p.UserId,
                                FromUserName = "System",
                                Type = "meeting-reminder",
                                Content = $"⏰ Reminder: {meeting.Title} starts in 1 hour",
                                Status = "info",
                                IsRead = false,
                                CreatedAt = DateTime.UtcNow
                            });
                        }
                    }
                }

                // ✅ MEETING END
                if (now >= meeting.EndTime)
                {
                    foreach (var p in meeting.Participants)
                    {
                        bool alreadySent = context.Notifications.Any(n =>
                            n.Type == "meeting-end" &&
                            n.ToUserId == p.UserId &&
                            n.Content.Contains(meeting.Title));

                        if (!alreadySent)
                        {
                            context.Notifications.Add(new Notification
                            {
                                FromUserId = meeting.OrganizerId,
                                ToUserId = p.UserId,
                                FromUserName = "System",
                                Type = "meeting-end",
                                Content = $"✅ Meeting ended: {meeting.Title}",
                                Status = "info",
                                IsRead = false,
                                CreatedAt = DateTime.UtcNow
                            });
                        }
                    }
                }
            }

            await context.SaveChangesAsync();

            await Task.Delay(60000, stoppingToken); // every 1 min
        }
    }
}