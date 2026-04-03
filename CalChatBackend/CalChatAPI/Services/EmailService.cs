//using System.Net;
//using System.Net.Mail;

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
//            var email = _config["EmailSettings:Email"];
//            var password = _config["EmailSettings:Password"];
//            var host = _config["EmailSettings:Host"];
//            var port = int.Parse(_config["EmailSettings:Port"]);

//            var smtpClient = new SmtpClient(host)
//            {
//                Port = port,
//                Credentials = new NetworkCredential(email, password),
//                EnableSsl = true,
//            };

//            var mail = new MailMessage
//            {
//                From = new MailAddress(email),
//                Subject = subject,
//                Body = body,
//                IsBodyHtml = true
//            };

//            mail.To.Add(to);

//            await smtpClient.SendMailAsync(mail);

//            Console.WriteLine("✅ EMAIL SENT via SMTP");
//        }
//    }
//}


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
            var apiKey = _config["SendGrid:ApiKey"];
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