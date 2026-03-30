using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CalChatAPI.Models;

namespace CalChatAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly IConfiguration _configuration;

		public AuthController(
			UserManager<ApplicationUser> userManager,
			IConfiguration configuration)
		{
			_userManager = userManager;
			_configuration = configuration;
		}

		// ================= REGISTER =================
		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterModel model)
		{
			var user = new ApplicationUser
			{
				UserName = model.Email,
				Email = model.Email
			};

			var result = await _userManager.CreateAsync(user, model.Password);

			if (!result.Succeeded)
				return BadRequest(result.Errors);

			return Ok(new { message = "User registered successfully" });
		}

		// ================= LOGIN =================
		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginModel model)
		{
			var user = await _userManager.FindByEmailAsync(model.Email);

			if (user == null)
				return Unauthorized("Invalid email or password");

			var isValid = await _userManager.CheckPasswordAsync(user, model.Password);

			if (!isValid)
				return Unauthorized("Invalid email or password");

			var token = GenerateJwtToken(user);

			return Ok(new { token });
		}

		// ================= GENERATE JWT =================
		private string GenerateJwtToken(ApplicationUser user)
		{
			var jwtSection = _configuration.GetSection("Jwt");
			var key = Encoding.UTF8.GetBytes(jwtSection["Key"]!);

			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id),
				new Claim(ClaimTypes.Email, user.Email!),
				new Claim(ClaimTypes.Name, user.UserName!)
			};

			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(claims),
				Expires = DateTime.UtcNow.AddMinutes(
					Convert.ToDouble(jwtSection["DurationInMinutes"])),
				Issuer = jwtSection["Issuer"],
				Audience = jwtSection["Audience"],
				SigningCredentials = new SigningCredentials(
					new SymmetricSecurityKey(key),
					SecurityAlgorithms.HmacSha256)
			};

			var tokenHandler = new JwtSecurityTokenHandler();
			var token = tokenHandler.CreateToken(tokenDescriptor);

			return tokenHandler.WriteToken(token);
		}
	}

	//// ================= MODELS =================
	//public class RegisterModel
	//{
	//	public string Email { get; set; } = string.Empty;
	//	public string Password { get; set; } = string.Empty;
	//}

	//public class LoginModel
	//{
	//	public string Email { get; set; } = string.Empty;
	//	public string Password { get; set; } = string.Empty;
	//}
}