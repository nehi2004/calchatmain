using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CalChatAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByHrId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedByHrId",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByHrId",
                table: "AspNetUsers");
        }
    }
}
