using System;
using CalChatAPI.Models;

public class PasswordToken
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty; // ✅ FIX

    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; }

    public ApplicationUser User { get; set; } = null!; // ✅ FIX
}