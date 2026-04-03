using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Security.Cryptography;
using CalChatAPI.Data;
using CalChatAPI.Models;
using CalChatAPI.DTOs;
using CalChatAPI.Services;


[ApiController]
[Route("api/hr")]
public class HrController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IEmailService _emailService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public HrController(
        ApplicationDbContext db,
        IEmailService emailService,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _db = db;
        _emailService = emailService;
        _userManager = userManager;
        _roleManager = roleManager;
    }

     ================= ADD EMPLOYEE =================
        [Authorize(Roles = "hr")]
    [HttpPost("add-employee")]
    public async Task<IActionResult> AddEmployee([FromBody] AddEmployeeDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existing = await _userManager.FindByEmailAsync(model.Email);
        if (existing != null)
            return BadRequest("Email already exists");

        // ✅ Create user
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid().ToString(),
            UserName = model.Email,
            Email = model.Email,
            Name = model.Name,
            FullName = model.Name,
            Department = model.Department
        };

        var createResult = await _userManager.CreateAsync(user);
        if (!createResult.Succeeded)
            return BadRequest(createResult.Errors);

        // ✅ Role assign
        var roleName = "professional";

        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            await _roleManager.CreateAsync(new IdentityRole(roleName));
        }

        await _userManager.AddToRoleAsync(user, roleName);

        // ✅ Generate token
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

        var passwordToken = new PasswordToken
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            IsUsed = false
        };

        _db.PasswordTokens.Add(passwordToken);
        await _db.SaveChangesAsync();

        var link = $"https://calchatmain-le3p.vercel.app/set-password?token={token}";

        Console.WriteLine("SET PASSWORD LINK: " + link);

        // ✅ Email body
        var emailBody = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;'>

        <h2 style='color: #4CAF50;'>Welcome to CalChat 🚀</h2>

        <p>Hello <b>{user.Name}</b>,</p>

        <p>You have been invited to join our platform. Please click below to set your password.</p>

        <div style='text-align: center; margin: 30px 0;'>
            <a href='{link}' 
               style='background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;'>
               Set Password
            </a>
        </div>

        <p>Or copy link:</p>
        <p>{link}</p>

    </div>";
        var emailSent = true;

        try
        {
            await _emailService.SendEmail(user.Email!, "Activate your CalChat account", emailBody);
        }
        catch (Exception ex)
        {
            emailSent = false;
            Console.WriteLine("❌ Email failed: " + ex.Message);
        }

        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            department = user.Department,
            emailSent = emailSent,
            message = "Employee created successfully 🚀"
        });
    }
    // ================= ADD EMPLOYEE =================
    [Authorize(Roles = "hr")]
    [HttpPost("add-employee")]
    public async Task<IActionResult> AddEmployee([FromBody] AddEmployeeDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existing = await _userManager.FindByEmailAsync(model.Email);
        if (existing != null)
            return BadRequest("Email already exists");

        // ✅ Create user
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid().ToString(),
            UserName = model.Email,
            Email = model.Email,
            Name = model.Name,
            FullName = model.Name,
            Department = model.Department
        };

        var createResult = await _userManager.CreateAsync(user);
        if (!createResult.Succeeded)
            return BadRequest(createResult.Errors);

        // ✅ Role assign
        var roleName = "professional";

        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            await _roleManager.CreateAsync(new IdentityRole(roleName));
        }

        await _userManager.AddToRoleAsync(user, roleName);

        // ✅ Generate token
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

        var passwordToken = new PasswordToken
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            IsUsed = false
        };

        _db.PasswordTokens.Add(passwordToken);
        await _db.SaveChangesAsync();

        var link = $"https://calchatmain-le3p.vercel.app/set-password?token={token}";

        var emailBody = $@"
        <h2>Welcome to CalChat 🚀</h2>
        <p>Hello {user.Name},</p>
        <a href='{link}'>Set Password</a>
    ";

        // ✅ CRITICAL FIX (EMAIL FAIL SHOULD NOT BREAK API)
        try
        {
            await _emailService.SendEmail(
                user.Email!,
                "Activate your CalChat account",
                emailBody
            );

            Console.WriteLine("✅ Email sent");
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Email failed: " + ex.Message);
            // ❗ DO NOT THROW
        }

        // ✅ ALWAYS SUCCESS RESPONSE
        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            department = user.Department,
            message = "Employee created successfully 🚀"
        });
    }


    // ================= GET EMPLOYEES =================

    [Authorize(Roles = "hr")]
    [HttpGet("employees")]
    public async Task<IActionResult> GetEmployees()
    {
        var users = await _userManager.GetUsersInRoleAsync("professional");

        var result = users.Select(u =>
        {
            var latestToken = _db.PasswordTokens
                .Where(t => t.UserId == u.Id)
                .OrderByDescending(t => t.ExpiresAt)
                .FirstOrDefault();

            var status = (latestToken != null && !latestToken.IsUsed)
                ? "Invited"
                : "Active";

            return new
            {
                id = u.Id,
                name = u.Name,
                email = u.Email,
                department = u.Department,
                status = status
            };
        });

        return Ok(result);
    }

    // ================= DELETE =================
    [Authorize(Roles = "hr")]
    [HttpDelete("delete-employee/{id}")]
    public async Task<IActionResult> DeleteEmployee(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound("Employee not found");

        await _userManager.DeleteAsync(user);

        return Ok(new { message = "Deleted" });
    }

    // ================= UPDATE =================
    [Authorize(Roles = "hr")]
    [HttpPut("update-employee/{id}")]
    public async Task<IActionResult> UpdateEmployee(string id, [FromBody] AddEmployeeDto model)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound("Employee not found");

        // ✅ FIXED (Department update)
        user.Name = model.Name;
        user.FullName = model.Name;
        user.Email = model.Email;
        user.UserName = model.Email;
        user.Department = model.Department;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = "Updated successfully" });
    }

    [Authorize(Roles = "hr")]
    [HttpPost("resend-invite/{userId}")]
    public async Task<IActionResult> ResendInvite(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return NotFound("User not found");

        // Generate new token
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

        var passwordToken = new PasswordToken
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            IsUsed = false
        };

        _db.PasswordTokens.Add(passwordToken);
        await _db.SaveChangesAsync();

        var link = $"https://calchatmain-le3p.vercel.app/set-password?token={token}";

        // SAME PROFESSIONAL TEMPLATE
        var emailBody = $@"
    <h2>Resend Invitation</h2>
    <p>Hello {user.Name},</p>
    <p>Click below to set your password:</p>
    <a href='{link}'>Set Password</a>
    ";

        await _emailService.SendEmail(user.Email!, "Resend Invite", emailBody);

        return Ok(new { message = "Invite resent successfully" });
    }
    [HttpPost("set-password")]
    public async Task<IActionResult> SetPassword(SetPasswordDto model)
    {
        var tokenEntry = await _db.PasswordTokens
            .FirstOrDefaultAsync(t => t.Token == model.Token && !t.IsUsed);

        if (tokenEntry == null)
            return BadRequest("Invalid or expired token");

        var user = await _userManager.FindByIdAsync(tokenEntry.UserId);

        if (user == null)
            return BadRequest("User not found");

        var result = await _userManager.AddPasswordAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // ✅ VERY IMPORTANT FIX
        tokenEntry.IsUsed = true;

        await _db.SaveChangesAsync();

        return Ok(new { message = "Password set successfully" });
    }
}