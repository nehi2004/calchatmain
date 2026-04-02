namespace CalChatAPI.Services
{
    public interface IEmailService
    {
        Task SendEmail(string to, string subject, string body);
    }
}