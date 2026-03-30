using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalChatAPI.Data;
using CalChatAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CalChatAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= GET TASKS (ONLY CURRENT USER) =================
        //[HttpGet]
        //public async Task<IActionResult> GetTasks()
        //{
        //    try
        //    {
        //        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //        var tasks = await _context.Tasks
        //            .Where(t => t.UserId == userId)
        //            .ToListAsync();

        //        return Ok(tasks);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, ex.Message); // 👈 IMPORTANT
        //    }
        //}
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirstValue(ClaimTypes.Role)?.ToLower();

                // ✅ Base query (filter based on role)
                var query = _context.Tasks.AsQueryable();

                if (role == "hr")
                {
                    // HR → tasks assigned by them
                    query = query.Where(t => t.AssignedBy == userId);
                }
                else
                {
                    // Employee → tasks assigned to them
                    query = query.Where(t => t.UserId == userId);
                }

                // ✅ Optimized JOIN with Users table
                var result = await (
                    from t in query

                    join u in _context.Users
                        on t.UserId equals u.Id into userJoin
                    from user in userJoin.DefaultIfEmpty()

                    join hr in _context.Users
                        on t.AssignedBy equals hr.Id into hrJoin
                    from assignedBy in hrJoin.DefaultIfEmpty()

                    select new
                    {
                        t.Id,
                        t.Title,
                        t.Description,
                        t.Priority,
                        t.Status,
                        t.Deadline,
                        t.Category,
                        t.UserId,
                        t.AssignedBy,

                        // ✅ Employee Name
                        assignedUserName = user != null ? user.Name : null,

                        // ✅ HR Name (avoid duplicate when self-assigned)
                        assignedByName = t.AssignedBy == t.UserId
                            ? null
                            : assignedBy != null ? assignedBy.Name : null
                    }
                ).ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Something went wrong",
                    error = ex.Message
                });
            }
        }
        // ================= CREATE TASK =================
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var role = User.FindFirstValue(ClaimTypes.Role);

                task.Id = Guid.NewGuid();

                if (role == "hr")
                {
                    if (string.IsNullOrEmpty(task.UserId))
                        return BadRequest("Employee UserId required");

                    // ✅ OPTIONAL: validate user exists
                    var userExists = await _context.Users.AnyAsync(u => u.Id == task.UserId);
                    if (!userExists)
                        return BadRequest("Invalid UserId");

                    task.AssignedBy = userId!;
                }
                else
                {
                    task.UserId = userId!;
                    task.AssignedBy = userId!;
                }
                task.Created_At = DateTime.UtcNow;

                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();



                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // 👈 IMPORTANT
            }
        }

        // ================= UPDATE TASK =================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(Guid id, TaskItem updatedTask)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null)
                return NotFound();  // either not exists or not owned by user

            if (!string.IsNullOrEmpty(updatedTask.Title))
                task.Title = updatedTask.Title;

            if (!string.IsNullOrEmpty(updatedTask.Description))
                task.Description = updatedTask.Description;

            if (!string.IsNullOrEmpty(updatedTask.Priority))
                task.Priority = updatedTask.Priority;

            if (!string.IsNullOrEmpty(updatedTask.Status))
                task.Status = updatedTask.Status;

            if (updatedTask.Deadline != null)
                task.Deadline = updatedTask.Deadline;

            if (!string.IsNullOrEmpty(updatedTask.Category))
                task.Category = updatedTask.Category;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ================= DELETE TASK =================
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            TaskItem? task;

            if (role == "HR" || role == "hr")
            {
                task = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Id == id && t.AssignedBy == userId);
            }
            else
            {
                task = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            }

            if (task == null)
                return NotFound("Task not found or no permission");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}