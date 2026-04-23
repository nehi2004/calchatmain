using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CalChatAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteAttachments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Transcript",
                table: "Meetings",
                newName: "transcript");

            migrationBuilder.RenameColumn(
                name: "Summary",
                table: "Meetings",
                newName: "summary");

            migrationBuilder.RenameColumn(
                name: "Speakers",
                table: "Meetings",
                newName: "speakers");

            migrationBuilder.RenameColumn(
                name: "LabeledTranscript",
                table: "Meetings",
                newName: "labeled_transcript");

            migrationBuilder.RenameColumn(
                name: "DurationSeconds",
                table: "Meetings",
                newName: "duration_seconds");

            migrationBuilder.CreateTable(
                name: "NoteAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NoteId = table.Column<int>(type: "integer", nullable: false),
                    OriginalFileName = table.Column<string>(type: "text", nullable: false),
                    StoredFileName = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    FilePath = table.Column<string>(type: "text", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoteAttachments_Notes_NoteId",
                        column: x => x.NoteId,
                        principalTable: "Notes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NoteAttachments_NoteId",
                table: "NoteAttachments",
                column: "NoteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoteAttachments");

            migrationBuilder.RenameColumn(
                name: "transcript",
                table: "Meetings",
                newName: "Transcript");

            migrationBuilder.RenameColumn(
                name: "summary",
                table: "Meetings",
                newName: "Summary");

            migrationBuilder.RenameColumn(
                name: "speakers",
                table: "Meetings",
                newName: "Speakers");

            migrationBuilder.RenameColumn(
                name: "labeled_transcript",
                table: "Meetings",
                newName: "LabeledTranscript");

            migrationBuilder.RenameColumn(
                name: "duration_seconds",
                table: "Meetings",
                newName: "DurationSeconds");
        }
    }
}
