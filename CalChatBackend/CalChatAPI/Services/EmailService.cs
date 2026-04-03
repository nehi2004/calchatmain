using System.Net;
using System.Net.Mail;

public interface IEmailService
{
    Task SendEmail(string to, string subject, string body);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmail(string to, string subject, string body)
    {
        var email = new MailMessage();
        email.From = new MailAddress(_config["EmailSettings:Email"]);
        email.To.Add(to);
        email.Subject = subject;
        email.Body = body;
        email.IsBodyHtml = true;
        var smtp = new SmtpClient
        {
            Host = _config["EmailSettings:Host"],
            Port = int.Parse(_config["EmailSettings:Port"]),
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(
                _config["EmailSettings:Email"],
                _config["EmailSettings:Password"]
            )
        };
        smtp.Timeout = 10000; // 10 sec max
        await smtp.SendMailAsync(email);

    }
}

//using SendGrid;
//using SendGrid.Helpers.Mail;

//namespace CalChatAPI.Services
//{
//    public class EmailService : IEmailService
//    {
//        private readonly IConfiguration _config;

//        public EmailService(IConfiguration config)
//        {
//            _config = config;
//        }

//        public async Task SendEmail(string to, string subject, string body)
//        {
//            var apiKey = _config["SendGrid:ApiKey"];

//            if (string.IsNullOrEmpty(apiKey))
//            {
//                throw new Exception("SendGrid API Key is missing");
//            }

//            var client = new SendGridClient(apiKey);

//            var from = new EmailAddress("nehipatel2004@gmail.com", "CalChat"); // ✅ verified sender
//            var toEmail = new EmailAddress(to);

//            var msg = MailHelper.CreateSingleEmail(
//                from,
//                toEmail,
//                subject,
//                plainTextContent: "",
//                htmlContent: body
//            );

//            var response = await client.SendEmailAsync(msg);

//            Console.WriteLine("SENDGRID STATUS: " + response.StatusCode);
//        }
//    }
//}