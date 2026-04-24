//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.AspNetCore.Authorization;
//using CalChatAPI.Data;
//using CalChatAPI.Models;

//namespace CalChatAPI.Controllers
//{
//    [Authorize]
//    [Route("api/[controller]")]
//    [ApiController]
//    public class RolePermissionController : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;

//        public RolePermissionController(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        // ✅ GET: api/RolePermission
//        [HttpGet]
//        public async Task<IActionResult> GetPermissions()
//        {
//            var data = await _context.RolePermissions.ToListAsync();
//            return Ok(data);
//        }

//        // ✅ PUT: api/RolePermission
//        [HttpPut]
//        public async Task<IActionResult> UpdatePermission([FromBody] RolePermission model)
//        {
//            if (model == null || string.IsNullOrEmpty(model.Role) || string.IsNullOrEmpty(model.Feature))
//            {
//                return BadRequest("Invalid data");
//            }

//            var perm = await _context.RolePermissions
//                .FirstOrDefaultAsync(x => x.Role == model.Role && x.Feature == model.Feature);

//            if (perm == null)
//            {
//                // 🔥 create new
//                var newPerm = new RolePermission
//                {
//                    Role = model.Role,
//                    Feature = model.Feature,
//                    IsEnabled = model.IsEnabled
//                };

//                _context.RolePermissions.Add(newPerm);
//            }
//            else
//            {
//                // 🔥 update existing
//                perm.IsEnabled = model.IsEnabled;
//            }

//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Permission updated successfully" });
//        }

//        // ✅ OPTIONAL: GET by role
//        [HttpGet("role/{role}")]
//        public async Task<IActionResult> GetByRole(string role)
//        {
//            var data = await _context.RolePermissions
//                .Where(x => x.Role.ToLower() == role.ToLower())
//                .ToListAsync();

//            return Ok(data);
//        }
//    }
//}



using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CalChatAPI.Data;
using CalChatAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CalChatAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class RolePermissionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RolePermissionController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class RolePermissionUpdateDto
        {
            [Required]
            public string Role { get; set; } = string.Empty;

            [Required]
            public string Feature { get; set; } = string.Empty;

            public bool IsEnabled { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetPermissions()
        {
            var data = await _context.RolePermissions
                .OrderBy(x => x.Role)
                .ThenBy(x => x.Feature)
                .ToListAsync();

            return Ok(data);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePermission([FromBody] RolePermissionUpdateDto model)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var role = model.Role.Trim();
            var feature = model.Feature.Trim();

            var perm = await _context.RolePermissions
                .FirstOrDefaultAsync(x => x.Role == role && x.Feature == feature);

            if (perm == null)
            {
                var newPerm = new RolePermission
                {
                    Role = role,
                    Feature = feature,
                    IsEnabled = model.IsEnabled
                };

                _context.RolePermissions.Add(newPerm);
            }
            else
            {
                perm.IsEnabled = model.IsEnabled;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Permission updated successfully" });
        }

        [HttpGet("role/{role}")]
        public async Task<IActionResult> GetByRole(string role)
        {
            var data = await _context.RolePermissions
                .Where(x => x.Role.ToLower() == role.ToLower())
                .OrderBy(x => x.Feature)
                .ToListAsync();

            return Ok(data);
        }
    }
}
