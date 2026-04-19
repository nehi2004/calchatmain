using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CalChatAPI.Migrations
{
    /// <inheritdoc />
    public partial class FreshInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
    name: "has_recording",
    table: "Meetings",
    type: "boolean",
    nullable: false,
    defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
     name: "has_recording",
     table: "Meetings");
        }
    }
}
