


//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.EntityFrameworkCore;
//using CalChatAPI.Models;

//namespace CalChatAPI.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    [Authorize]
//    public class UserController : ControllerBase
//    {
//        private readonly UserManager<ApplicationUser> _userManager;

//        public UserController(UserManager<ApplicationUser> userManager)
//        {
//            _userManager = userManager;
//        }


//        // ================= GET ALL USERS =================

//        [HttpGet]
//        public async Task<IActionResult> GetUsers()
//        {
//            var users = await _userManager.Users
//                .Select(u => new
//                {
//                    u.Id,
//                    u.UserName,
//                    u.Email
//                })
//                .ToListAsync();

//            return Ok(users);
//        }


//        // ================= GET USER BY ID =================

//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetUser(string id)
//        {
//            var user = await _userManager.Users
//                .Where(u => u.Id == id)
//                .Select(u => new
//                {
//                    u.Id,
//                    u.UserName,
//                    u.Email
//                })
//                .FirstOrDefaultAsync();

//            if (user == null)
//                return NotFound();

//            return Ok(user);
//        }


//        // ================= SEARCH USERS =================

//        [HttpGet("search")]
//        public async Task<IActionResult> SearchUsers(string query)
//        {
//            if (string.IsNullOrEmpty(query))
//                return Ok(new List<object>());

//            var users = await _userManager.Users
//                .Where(u => u.UserName!.ToLower().Contains(query.ToLower()))
//                .Select(u => new
//                {
//                    u.Id,
//                    u.UserName,
//                    u.Email
//                })
//                .ToListAsync();

//            return Ok(users);
//        }


//        // GET: api/User/students
//        [AllowAnonymous]
//        [HttpGet("students")]
//        public async Task<IActionResult> GetStudents()
//        {
//            var users = await _userManager.Users.ToListAsync();
//            var students = new List<object>();

//            foreach (var user in users)
//            {
//                var roles = await _userManager.GetRolesAsync(user);

//                if (roles.Any(r => r.ToLower() == "student"))
//                {
//                    students.Add(new
//                    {
//                        id = user.Id,
//                        name=user.UserName,
//                        email = user.Email
//                    });
//                }
//            }

//            return Ok(students);
//        }


//        // ================= CURRENT USER =================

//        [HttpGet("me")]
//        public async Task<IActionResult> GetCurrentUser()
//        {
//            var user = await _userManager.GetUserAsync(User);

//            if (user == null)
//                return Unauthorized();

//            return Ok(new
//            {
//                user.Id,
//                user.UserName,
//                user.Email
//            });
//        }
//    }
//}













using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CalChatAPI.Models;
using CalChatAPI.Data;

namespace CalChatAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // ================= GET ALL USERS =================

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email
                })
                .ToListAsync();

            return Ok(users);
        }


        // ================= GET USER BY ID =================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManager.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound();

            return Ok(user);
        }


        // ================= SEARCH USERS =================

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string query)
        {
            if (string.IsNullOrEmpty(query))
                return Ok(new List<object>());

            var users = await _userManager.Users
                .Where(u => u.UserName!.ToLower().Contains(query.ToLower()))
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email
                })
                .ToListAsync();

            return Ok(users);
        }


        // ================= GET STUDENTS =================

        [AllowAnonymous]
        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var currentUserId =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            var students = await _userManager
                .GetUsersInRoleAsync("student");

            var result = students
                .Where(u => u.Id != currentUserId)
                .Select(u => new
                {
                    id = u.Id,
                    name = u.UserName ?? u.Email,
                    email = u.Email
                })
                .ToList();

            return Ok(result);
        }


        // ================= CURRENT USER =================

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email
            });
        }


        // ================= BLOCK USER =================

        [HttpPost("block/{userId}")]
        public async Task<IActionResult> BlockUser(string userId)
        {
            var currentUser =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            var alreadyBlocked = await _context.BlockUsers
                .FirstOrDefaultAsync(b =>
                    b.UserId == currentUser &&
                    b.BlockedUserId == userId);

            if (alreadyBlocked != null)
                return Ok("Already blocked");

            var block = new BlockUser
            {
                UserId = currentUser,
                BlockedUserId = userId
            };

            _context.BlockUsers.Add(block);

            await _context.SaveChangesAsync();

            return Ok("User blocked");
        }


        // ================= UNBLOCK USER =================

        [HttpDelete("unblock/{userId}")]
        public async Task<IActionResult> UnblockUser(string userId)
        {
            var currentUser =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            var block = await _context.BlockUsers
                .FirstOrDefaultAsync(b =>
                    b.UserId == currentUser &&
                    b.BlockedUserId == userId);

            if (block != null)
            {
                _context.BlockUsers.Remove(block);
                await _context.SaveChangesAsync();
            }

            return Ok("User unblocked");
        }


        // ================= CHECK BLOCK =================

        [HttpGet("is-blocked/{userId}")]
        public async Task<IActionResult> IsBlocked(string userId)
        {
            var currentUser =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            var blocked = await _context.BlockUsers
                .AnyAsync(b =>
                    b.UserId == currentUser &&
                    b.BlockedUserId == userId);

            return Ok(new { blocked });
        }
    }
}