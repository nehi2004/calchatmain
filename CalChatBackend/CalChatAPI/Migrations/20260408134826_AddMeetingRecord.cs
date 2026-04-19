//using System;
//using Microsoft.EntityFrameworkCore.Migrations;
//using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

//#nullable disable

//namespace CalChatAPI.Migrations
//{
//    /// <inheritdoc />
//    public partial class AddMeetingRecord : Migration
//    {
//        /// <inheritdoc />
//        protected override void Up(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.CreateTable(
//                name: "MeetingRecords",
//                columns: table => new
//                {
//                    Id = table.Column<int>(type: "integer", nullable: false)
//                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
//                    FilePath = table.Column<string>(type: "text", nullable: false),
//                    Transcript = table.Column<string>(type: "text", nullable: false),
//                    Summary = table.Column<string>(type: "text", nullable: false),
//                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
//                },
//                constraints: table =>
//                {
//                    table.PrimaryKey("PK_MeetingRecords", x => x.Id);
//                });
//        }

//        /// <inheritdoc />
//        protected override void Down(MigrationBuilder migrationBuilder)
//        {
//            migrationBuilder.DropTable(
//                name: "MeetingRecords");
//        }
//    }
//}
using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CalChatAPI.Migrations
{
    public partial class AddMeetingRecord : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MeetingRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FilePath = table.Column<string>(type: "text", nullable: false),
                    Transcript = table.Column<string>(type: "text", nullable: false),
                    Summary = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingRecords", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ✅ SAFE DROP (IMPORTANT FIX)
            migrationBuilder.Sql(
                @"DO $$
                BEGIN
                    IF EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = 'MeetingRecords'
                    ) THEN
                        DROP TABLE ""MeetingRecords"";
                    END IF;
                END $$;"
            );
        }
    }
}
