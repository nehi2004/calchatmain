public class RolePermission
{
	public int Id { get; set; }

	public string Role { get; set; }   // Student, HR, Admin...

	public string Feature { get; set; } // Calendar, Tasks, AI Chat...

	public bool IsEnabled { get; set; }
}