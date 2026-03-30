using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CalChatAPI.Models
{
    [Table("tasks")]
    public class TaskItem
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Required]
        [Column("priority")]
        public string Priority { get; set; }

        [Required]
        [Column("status")]
        public string Status { get; set; }

        [Column("deadline")]
        public DateTime? Deadline { get; set; }

        [Column("category")]
        public string? Category { get; set; }

        [Column("created_at")]
        public DateTime Created_At { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; } = string.Empty;   // assigned TO
        public string AssignedBy { get; set; } = string.Empty; // assigned BY (HR)



        //public string UserId { get; set; } = string.Empty;
    }
}