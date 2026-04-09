//using Microsoft.AspNetCore.Mvc;

//namespace YourProject.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class ContactController : ControllerBase
//    {
//        [HttpPost]
//        public IActionResult SendMessage([FromBody] ContactRequest request)
//        {
//            // ✅ Basic validation
//            if (string.IsNullOrEmpty(request.Name) ||
//                string.IsNullOrEmpty(request.Email) ||
//                string.IsNullOrEmpty(request.Message))
//            {
//                return BadRequest(new { success = false, message = "All fields required" });
//            }

//            // 👉 Abhi sirf test karenge (email next step me bhejenge)

//            return Ok(new
//            {
//                success = true,
//                data = request
//            });
//        }
//    }

//    public class ContactRequest
//    {
//        public string Name { get; set; }
//        public string Email { get; set; }
//        public string Message { get; set; }
//    }
//}



using Microsoft.AspNetCore.Mvc;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace YourProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ContactController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ContactRequest request)
        {
            if (string.IsNullOrEmpty(request.Name) ||
                string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.Message))
            {
                return BadRequest(new { success = false });
            }

            try
            {
                var apiKey = _config["SendGrid:ApiKey"];
                var client = new SendGridClient(apiKey);
                Console.WriteLine("API KEY: " + apiKey);

                var from = new EmailAddress("nehipatel2004@gmail.com", "CalChat");
                var to = new EmailAddress("calchat26@gmail.com");

                var subject = $"New Contact from {request.Name}";
                var plainTextContent = $"Name: {request.Name}\nEmail: {request.Email}\nMessage: {request.Message}";
                var htmlContent = $@"
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }}
    .container {{
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }}
    .header {{
      background: linear-gradient(90deg, #2563eb, #4f46e5);
      color: white;
      padding: 20px;
      text-align: center;
    }}
    .header h1 {{
      margin: 0;
      font-size: 22px;
    }}
    .content {{
      padding: 25px;
      color: #333;
    }}
    .label {{
      font-weight: bold;
      color: #555;
      margin-top: 10px;
    }}
    .value {{
      background: #f9fafb;
      padding: 10px;
      border-radius: 6px;
      margin-top: 5px;
      word-break: break-word;
    }}
    .footer {{
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #888;
      background: #f1f5f9;
    }}
  </style>
</head>
<body>

  <div class='container'>

    <div class='header'>
      <h1>📩 New Contact Message</h1>
    </div>

    <div class='content'>
      
      <div class='label'>👤 Name</div>
      <div class='value'>{request.Name}</div>

      <div class='label'>📧 Email</div>
      <div class='value'>{request.Email}</div>

      <div class='label'>💬 Message</div>
      <div class='value'>{request.Message}</div>

    </div>

    <div class='footer'>
      Sent from CalChat+ Contact Form 🚀
    </div>

  </div>

</body>
</html>
";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

                var response = await client.SendEmailAsync(msg);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { success = false });
            }
        }
    }

    public class ContactRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}