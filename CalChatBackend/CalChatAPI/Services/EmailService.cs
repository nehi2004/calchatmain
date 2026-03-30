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

        var smtp = new SmtpClient(_config["EmailSettings:Host"])
        {
            Port = int.Parse(_config["EmailSettings:Port"]),
            Credentials = new NetworkCredential(
                _config["EmailSettings:Email"],
                _config["EmailSettings:Password"]
            ),
            EnableSsl = true   // ✅ VERY IMPORTANT
        };

        await smtp.SendMailAsync(email);
    }
}