


//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.OpenApi.Models;
//using Microsoft.AspNetCore.SignalR;
//using System.Text;
//using System.Security.Claims;
//using CalChatAPI.Data;
//using CalChatAPI.Models;
//using CalChatAPI.Hubs;
//using CalChatAPI.Services;

//var builder = WebApplication.CreateBuilder(args);

////////////////////////////////////////////////////
//// DATABASE
////////////////////////////////////////////////////

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

////////////////////////////////////////////////////
//// IDENTITY
////////////////////////////////////////////////////

//builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
//    .AddEntityFrameworkStores<ApplicationDbContext>()
//    .AddDefaultTokenProviders();

////////////////////////////////////////////////////
//// JWT CONFIG (SignalR support)
////////////////////////////////////////////////////

//var jwtKey = builder.Configuration["Jwt:Key"] ?? "THIS_IS_SECRET_KEY_CHANGE_IT";
//var key = Encoding.UTF8.GetBytes(jwtKey);

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false;
//    options.SaveToken = true;

//    options.Events = new JwtBearerEvents
//    {
//        OnMessageReceived = context =>
//        {
//            var accessToken = context.Request.Query["access_token"];

//            var path = context.HttpContext.Request.Path;
//            if (!string.IsNullOrEmpty(accessToken) &&
//                path.StartsWithSegments("/chatHub"))
//            {
//                context.Token = accessToken;
//            }

//            return Task.CompletedTask;
//        }
//    };

//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = false,
//        ValidateAudience = false,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(key),

//        NameClaimType = ClaimTypes.Name,
//        RoleClaimType = ClaimTypes.Role
//    };
//});

////////////////////////////////////////////////////
//// PREVENT LOGIN REDIRECTS
////////////////////////////////////////////////////

//builder.Services.ConfigureApplicationCookie(options =>
//{
//    options.Events.OnRedirectToLogin = context =>
//    {
//        context.Response.StatusCode = 401;
//        return Task.CompletedTask;
//    };

//    options.Events.OnRedirectToAccessDenied = context =>
//    {
//        context.Response.StatusCode = 403;
//        return Task.CompletedTask;
//    };
//});

////////////////////////////////////////////////////
//// SIGNALR
////////////////////////////////////////////////////

//builder.Services.AddSignalR(options =>
//{
//    options.EnableDetailedErrors = true;
//});

//builder.Services.AddSingleton<IUserIdProvider, NameIdentifierUserIdProvider>();

////////////////////////////////////////////////////
//// SERVICES
////////////////////////////////////////////////////

//builder.Services.AddScoped<AIService>();
//builder.Services.AddScoped<IEmailService, EmailService>();
//builder.Services.AddHostedService<MeetingNotificationService>();

////////////////////////////////////////////////////
//// CONTROLLERS
////////////////////////////////////////////////////

//builder.Services.AddControllers();

////////////////////////////////////////////////////
//// CORS (ONLY ONE)
////////////////////////////////////////////////////

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend", policy =>
//    {
//        policy
//            .WithOrigins("https://calchatmain-le3p.vercel.app")
//            .AllowAnyHeader()
//            .AllowAnyMethod()
//            .AllowCredentials();
//    });
//});

////////////////////////////////////////////////////
//// SWAGGER
////////////////////////////////////////////////////

//builder.Services.AddEndpointsApiExplorer();

//builder.Services.AddSwaggerGen(options =>
//{
//    options.SwaggerDoc("v1", new OpenApiInfo
//    {
//        Title = "CalChat API",
//        Version = "v1"
//    });

//    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//    {
//        Name = "Authorization",
//        Type = SecuritySchemeType.Http,
//        Scheme = "bearer",
//        BearerFormat = "JWT",
//        In = ParameterLocation.Header
//    });

//    options.AddSecurityRequirement(new OpenApiSecurityRequirement
//    {
//        {
//            new OpenApiSecurityScheme
//            {
//                Reference = new OpenApiReference
//                {
//                    Type = ReferenceType.SecurityScheme,
//                    Id = "Bearer"
//                }
//            },
//            new string[] {}
//        }
//    });
//});

////////////////////////////////////////////////////
//// BUILD APP (ONLY ONCE)
////////////////////////////////////////////////////

//var app = builder.Build();

////////////////////////////////////////////////////
//// MIDDLEWARE
////////////////////////////////////////////////////

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseRouting();

//app.UseCors("AllowFrontend");

//app.UseAuthentication();
//app.UseAuthorization();

//app.UseStaticFiles();

////////////////////////////////////////////////////
//// ENDPOINTS
////////////////////////////////////////////////////

//app.MapControllers();

//app.MapHub<ChatHub>("/chatHub")
//   .RequireCors("AllowFrontend");

//app.Run();


using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.SignalR;
using System.Text;
using System.Security.Claims;
using CalChatAPI.Data;
using CalChatAPI.Models;
using CalChatAPI.Hubs;
using CalChatAPI.Services;

var builder = WebApplication.CreateBuilder(args);

//////////////////////////////////////////////////
// DATABASE
//////////////////////////////////////////////////
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .EnableSensitiveDataLogging()
           .LogTo(Console.WriteLine, LogLevel.Information));
//////////////////////////////////////////////////
// IDENTITY
//////////////////////////////////////////////////
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

//////////////////////////////////////////////////
// JWT
//////////////////////////////////////////////////
var jwtKey = builder.Configuration["Jwt:Key"] ?? "THIS_IS_SECRET_KEY_CHANGE_IT";
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/chatHub"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = ClaimTypes.Role
    };
});

//////////////////////////////////////////////////
// SERVICES
//////////////////////////////////////////////////
builder.Services.AddSignalR();
builder.Services.AddSingleton<IUserIdProvider, NameIdentifierUserIdProvider>();

builder.Services.AddScoped<AIService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddControllers();

//////////////////////////////////////////////////
// CORS
//////////////////////////////////////////////////
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://calchatmain-le3p.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

//////////////////////////////////////////////////
// SWAGGER
//////////////////////////////////////////////////
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//////////////////////////////////////////////////
// BUILD APP (ONLY ONE TIME)
//////////////////////////////////////////////////
var app = builder.Build();

//////////////////////////////////////////////////
// PORT FIX (Railway)
//////////////////////////////////////////////////
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://*:{port}");

//////////////////////////////////////////////////
// MIDDLEWARE
//////////////////////////////////////////////////
app.UseSwagger();
app.UseSwaggerUI();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        var error = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        await context.Response.WriteAsync("ERROR: " + error?.Error?.Message);
    });
});

app.UseRouting();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

//////////////////////////////////////////////////
// ENDPOINTS
//////////////////////////////////////////////////
app.MapControllers();
app.MapHub<ChatHub>("/chatHub").RequireCors("AllowFrontend");

app.Run();