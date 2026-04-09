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
                var htmlContent = $"<strong>Name:</strong> {request.Name}<br/><strong>Email:</strong> {request.Email}<br/><strong>Message:</strong> {request.Message}";

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