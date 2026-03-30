using System.ComponentModel.DataAnnotations;

public class ChatMute
{
    [Key]
    public int Id { get; set; }

    public int ChatId { get; set; }

    public string UserId { get; set; }

    public bool IsMuted { get; set; } = true;
}