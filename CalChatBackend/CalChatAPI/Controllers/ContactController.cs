using Microsoft.AspNetCore.Mvc;

namespace YourProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        [HttpPost]
        public IActionResult SendMessage([FromBody] ContactRequest request)
        {
            // ✅ Basic validation
            if (string.IsNullOrEmpty(request.Name) ||
                string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.Message))
            {
                return BadRequest(new { success = false, message = "All fields required" });
            }

            // 👉 Abhi sirf test karenge (email next step me bhejenge)

            return Ok(new
            {
                success = true,
                data = request
            });
        }
    }

    public class ContactRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}