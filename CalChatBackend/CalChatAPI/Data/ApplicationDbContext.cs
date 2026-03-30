using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Models;

namespace CalChatAPI.Data
{
    public class ApplicationDbContext
        : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // =========================
        // EXISTING TABLES
        // =========================
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<EventItem> Events { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        
        public DbSet<AIChatHistory> AIChatHistories { get; set; }



        // Identity Users (for roles)
        public DbSet<ApplicationUser> AppUsers { get; set; } = null!;

        // Chat System
        public DbSet<Chat> Chats { get; set; } = null!;
        public DbSet<ChatMember> ChatMembers { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; }

        public DbSet<ChatMute> ChatMutes { get; set; }

        public DbSet<BlockUser> BlockUsers { get; set; }

        public DbSet<GroupReport> GroupReports { get; set; }

        public DbSet<GroupMember> GroupMembers { get; set; }

        public DbSet<PasswordToken> PasswordTokens { get; set; }
        public DbSet<Meeting> Meetings { get; set; }
        public DbSet<MeetingParticipant> MeetingParticipants { get; set; }
        public DbSet<Note> Notes { get; set; }

        public DbSet<NoteUser> NoteUsers { get; set; }
        public DbSet<Announcement> Announcements { get; set; }

        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<MessageRead> MessageReads { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // NoteUser relation
            modelBuilder.Entity<NoteUser>()
                .HasOne(nu => nu.Note)
                .WithMany(n => n.NoteUsers)
                .HasForeignKey(nu => nu.NoteId);

            // 🔥 MeetingParticipant relation (IMPORTANT)
            modelBuilder.Entity<MeetingParticipant>()
                .HasOne(mp => mp.Meeting)
                .WithMany(m => m.Participants)
                .HasForeignKey(mp => mp.MeetingId);
        }
    }
}