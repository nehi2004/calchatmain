using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CalChatAPI.Data;
using CalChatAPI.Models;

namespace CalChatAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RolePermissionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RolePermissionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/RolePermission
        [HttpGet]
        public async Task<IActionResult> GetPermissions()
        {
            var data = await _context.RolePermissions.ToListAsync();
            return Ok(data);
        }

        // ✅ PUT: api/RolePermission
        [HttpPut]
        public async Task<IActionResult> UpdatePermission([FromBody] RolePermission model)
        {
            if (model == null || string.IsNullOrEmpty(model.Role) || string.IsNullOrEmpty(model.Feature))
            {
                return BadRequest("Invalid data");
            }

            var perm = await _context.RolePermissions
                .FirstOrDefaultAsync(x => x.Role == model.Role && x.Feature == model.Feature);

            if (perm == null)
            {
                // 🔥 create new
                var newPerm = new RolePermission
                {
                    Role = model.Role,
                    Feature = model.Feature,
                    IsEnabled = model.IsEnabled
                };

                _context.RolePermissions.Add(newPerm);
            }
            else
            {
                // 🔥 update existing
                perm.IsEnabled = model.IsEnabled;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Permission updated successfully" });
        }

        // ✅ OPTIONAL: GET by role
        [HttpGet("role/{role}")]
        public async Task<IActionResult> GetByRole(string role)
        {
            var data = await _context.RolePermissions
                .Where(x => x.Role.ToLower() == role.ToLower())
                .ToListAsync();

            return Ok(data);
        }
    }
}