using SendGrid;
using SendGrid.Helpers.Mail;

namespace CalChatAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmail(string to, string subject, string body)
        {
            // ✅ Direct ENV variable
            var apiKey = Environment.GetEnvironmentVariable("SendGrid__ApiKey")?.Trim();

            Console.WriteLine("🔥 SENDGRID KEY: " + apiKey);

            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("SendGrid API Key missing");
            }

            var client = new SendGridClient(apiKey);

            var from = new EmailAddress("nehipatel2004@gmail.com", "CalChat");
            var toEmail = new EmailAddress(to);

            var msg = MailHelper.CreateSingleEmail(
                from,
                toEmail,
                subject,
                plainTextContent: "",
                htmlContent: body
            );

            var response = await client.SendEmailAsync(msg);

            Console.WriteLine("📧 SendGrid Status: " + response.StatusCode);
        }
    }
}