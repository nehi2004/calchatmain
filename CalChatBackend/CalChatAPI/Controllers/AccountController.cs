



    using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CalChatAPI.Models;
using CalChatAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    // ✅ ALL DEPENDENCIES
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _db;
    private readonly EmailSettings _emailSettings;

    // ✅ SINGLE CONSTRUCTOR (IMPORTANT)
    public AccountController(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        ApplicationDbContext db,
        IOptions<EmailSettings> emailSettings
    )
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _db = db;
        _emailSettings = emailSettings.Value;
    }

    // ================= REGISTER =================
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        try
        {
            if (model == null)
                return BadRequest("Invalid data");

            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
                return BadRequest("User already exists");

            var user = new ApplicationUser
            {
                Name = model.Name,
                UserName = model.Email,
                Email = model.Email,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // ✅ ADD ROLE (IMPORTANT)
            var roleName = model.Role?.ToLower() ?? "student";

            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }

            await _userManager.AddToRoleAsync(user, roleName);

            return Ok(new
            {
                message = "User registered successfully",
                role = roleName
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Internal Server Error",
                error = ex.Message
            });
        }
    }
    // ================= LOGIN =================
    // ================= LOGIN =================
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        try
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                return BadRequest("Email & password required");

            Console.WriteLine("🔥 LOGIN START");

            // ✅ FIX: case-insensitive email
            var user = await _db.Users
                .FirstOrDefaultAsync(x => x.Email.ToLower() == model.Email.ToLower());

            if (user == null)
                return Unauthorized("Invalid credentials");

            if (!user.IsActive)
                return Unauthorized(new
                {
                    message = "Your account has been deactivated",
                    code = "USER_DEACTIVATED"
                });

            Console.WriteLine("✅ User Found");

            // ✅ Password check
            var result = _userManager.PasswordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                model.Password
            );

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid credentials");

            Console.WriteLine("✅ Password OK");

            // ✅ FIX: get real role
            var userRoles = await _userManager.GetRolesAsync(user);
            var role = userRoles.FirstOrDefault() ?? "student";

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Name, user.Name ?? ""),
            new Claim(ClaimTypes.Role, role)
        };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            Console.WriteLine("🚀 LOGIN SUCCESS");

            return Ok(new
            {
                token = tokenString,
                role = role,
                userId = user.Id
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ LOGIN ERROR: " + ex.Message);
            return StatusCode(500, ex.Message);
        }
    }
    // ================= GET USERS =================
    [HttpGet("users")]
    [Authorize]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();

        var result = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            result.Add(new
            {
                id = user.Id,
                fullName = user.Name,
                email = user.Email,
                role = roles.FirstOrDefault(),
                isActive = user.IsActive,
                createdAt = user.CreatedAt
            });
        }

        return Ok(result);
    }
    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound();

        user.Name = model.Name ?? user.Name;
        user.Nickname = model.Nickname;
        user.Gender = model.Gender;
        user.Country = model.Country;
        user.Mobile = model.Mobile;
        user.ProfileImage = model.ProfileImage;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = "Profile updated successfully" });
    }


    // ================= GET PROFILE =================
    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound("User not found");

        return Ok(new
        {
            name = user.Name,
            email = user.Email,
            nickname = user.Nickname,
            gender = user.Gender,
            country = user.Country,
            mobile = user.Mobile,
            profileImage = user.ProfileImage
        });
    }
    // ================= UPDATE USER =================
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found");

        user.Name = dto.FullName ?? user.Name;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        if (!string.IsNullOrEmpty(dto.Role))
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, dto.Role);
        }

        return Ok("User updated successfully");
    }

    // ================= DEACTIVATE =================
    [HttpPut("users/{id}/deactivate")]
    public async Task<IActionResult> DeactivateUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found");

        user.IsActive = false;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok("User deactivated");
    }


    // ================= ACTIVATE =================
    [HttpPut("users/{id}/activate")]
    public async Task<IActionResult> ActivateUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return NotFound("User not found");

        if (user.IsActive)
            return BadRequest("User is already active");

        user.IsActive = true;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok("User activated");
    }
    // ================= SEND EMAIL =================

    //[HttpPost("send-email")]
    //public async Task<IActionResult> SendEmail([FromBody] EmailDto dto)
    //{
    //    var email = _configuration["EmailSettings:Email"];
    //    var password = _configuration["EmailSettings:Password"];
    //    var host = _configuration["EmailSettings:Host"];
    //    var portStr = _configuration["EmailSettings:Port"];

    //    if (string.IsNullOrEmpty(email) ||
    //        string.IsNullOrEmpty(password) ||
    //        string.IsNullOrEmpty(host) ||
    //        string.IsNullOrEmpty(portStr))
    //    {
    //        return BadRequest(new
    //        {
    //            message = "Email config missing"
    //        });
    //    }

    //    var port = int.Parse(portStr);



    //    return Ok(new
    //    {
    //        message = "Email sent"
    //    });
    //}

    [HttpPost("send-email")]
    public async Task<IActionResult> SendEmail([FromBody] EmailDto dto)
    {
        try
        {
            var apiKey = Environment.GetEnvironmentVariable("SendGrid__ApiKey");

            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, "SendGrid API key missing");

            var client = new SendGridClient(apiKey);

            var from = new EmailAddress("nehipatel2004@gmail.com", "CalChat+ Admin");
            var to = new EmailAddress(dto.To);

            var subject = dto.Subject ?? "Admin Message";

            //    var htmlContent = $@"
            //<div style='font-family: Arial; padding:40px; background:#f4f6f8;'>
            //    <div style='max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px;'>

            //        <h2>📩 Message from Admin</h2>

            //        <p>{dto.Message}</p>

            //        <hr style='margin:20px 0'/>

            //        <p style='font-size:12px; color:#888;'>
            //            This email was sent by CalChat+ Admin Panel
            //        </p>

            //    </div>
            //</div>";
            var htmlContent = $@"
<div style='margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Arial,sans-serif;'>

  <table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;'>
    <tr>
      <td align='center'>

        <table width='500' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);'>

          <!-- HEADER -->
          <tr>
            <td style='background:linear-gradient(135deg,#6366f1,#4f46e5);padding:20px;text-align:center;color:white;'>
              <h2 style='margin:0;font-size:20px;'>📩 CalChat+ Admin</h2>
              <p style='margin:5px 0 0;font-size:12px;opacity:0.8;'>Official Notification</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style='padding:30px;'>

              <h3 style='margin-top:0;color:#111827;'>Hello 👋</h3>

              <p style='font-size:14px;color:#374151;line-height:1.6;'>
                {dto.Message}
              </p>

              <!-- CTA BUTTON (optional) -->
              <div style='text-align:center;margin:30px 0;'>
                <a href='https://calchatmain-le3p.vercel.app'
                   style='background:#6366f1;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;font-size:14px;display:inline-block;'>
                   Open CalChat+
                </a>
              </div>

              <p style='font-size:12px;color:#6b7280;'>
                If you have any questions, feel free to contact support.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style='background:#f9fafb;padding:15px;text-align:center;font-size:11px;color:#9ca3af;'>
              © {DateTime.Now.Year} CalChat+ • All rights reserved
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);

            var response = await client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode(500, new
                {
                    message = "Email failed",
                    status = response.StatusCode
                });
            }

            return Ok(new
            {
                message = "Email sent successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Error sending email",
                error = ex.Message
            });
        }
    }


    [AllowAnonymous]
[HttpPost("forgot-password")]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotDto dto)
{
    var user = await _userManager.FindByEmailAsync(dto.Email);

    if (user == null)
        return Ok("If email exists, reset link sent");

    var token = Guid.NewGuid().ToString();

    user.ResetToken = token;
    user.TokenExpiry = DateTime.UtcNow.AddMinutes(15);

    await _userManager.UpdateAsync(user);

        var resetLink = $"https://calchatmain-le3p.vercel.app/reset-password?token={token}";

        try
    {
        var apiKey = Environment.GetEnvironmentVariable("SendGrid__ApiKey");

        if (string.IsNullOrEmpty(apiKey))
            return StatusCode(500, "SendGrid API key missing");

        var client = new SendGridClient(apiKey);

        var from = new EmailAddress("nehipatel2004@gmail.com", "CalChat+");
        var to = new EmailAddress(dto.Email);

        var subject = "Reset Your Password - CalChat+";

        var htmlContent = $@"
        <div style='font-family: Arial; padding:40px; background:#f4f6f8;'>
            <div style='max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px; text-align:center;'>

                <h2>🔐 Reset Your Password</h2>

                <p>Click below to reset your password</p>

                <a href='{resetLink}' 
                   style='display:inline-block; margin-top:20px; padding:12px 20px; background:#6366f1; color:white; text-decoration:none; border-radius:6px;'>
                   Reset Password
                </a>

                <p style='margin-top:20px; font-size:12px; color:#888;'>
                    This link expires in 15 minutes.
                </p>

            </div>
        </div>";

        var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);

        var response = await client.SendEmailAsync(msg);

        Console.WriteLine("SENDGRID STATUS: " + response.StatusCode);

        return Ok("Reset link sent to email");
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ SENDGRID ERROR: " + ex.Message);
        return StatusCode(500, ex.Message);
    }
}

[HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetDto dto)
    {
        var user = await _userManager.Users
            .FirstOrDefaultAsync(x => x.ResetToken == dto.Token);

        if (user == null || user.TokenExpiry < DateTime.UtcNow)
            return BadRequest("Invalid or expired token");

        var hashedPassword = _userManager.PasswordHasher.HashPassword(user, dto.NewPassword);

        user.PasswordHash = hashedPassword;
        user.ResetToken = null;
        user.TokenExpiry = null;

        await _userManager.UpdateAsync(user);

        return Ok("Password reset successful");
    }
    [HttpGet("ping-db")]
    public async Task<IActionResult> PingDb()
    {
        try
        {
            Console.WriteLine("🔌 Testing DB connection...");

            await _db.Database.OpenConnectionAsync();

            Console.WriteLine("✅ DB Connected");

            return Ok("DB Connected ✅");
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ DB ERROR: " + ex.Message);
            return StatusCode(500, new
            {
                message = ex.Message
            });
        }


    }

    [HttpGet("check-env")]
    public IActionResult CheckEnv()
    {
        var key = Environment.GetEnvironmentVariable("SendGrid__ApiKey");
        return Ok(new { key });
    }
}