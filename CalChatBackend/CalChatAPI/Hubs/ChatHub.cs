using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using CalChatAPI.Data;
using CalChatAPI.Models;

namespace CalChatAPI.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        private static Dictionary<string, DateTime> activeCalls = new();

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);

                if (role == "employee")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Employees");
                }
            }

            await base.OnConnectedAsync();
        }

        public async Task JoinChat(string chatId)
        {
            if (string.IsNullOrEmpty(chatId)) return;
            await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        }

        public async Task SendMessage(object message)
        {
            if (message == null) return;

            var chatId = message.GetType().GetProperty("ChatId")?.GetValue(message)?.ToString();
            if (string.IsNullOrEmpty(chatId)) return;

            var text =
                message.GetType().GetProperty("Text")?.GetValue(message) ??
                message.GetType().GetProperty("Message")?.GetValue(message);

            await Clients.Group(chatId).SendAsync("ReceiveMessage", new
            {
                id = message.GetType().GetProperty("Id")?.GetValue(message),
                senderId = message.GetType().GetProperty("SenderId")?.GetValue(message),
                senderName = message.GetType().GetProperty("SenderName")?.GetValue(message),
                message = text,
                fileUrl = message.GetType().GetProperty("FileUrl")?.GetValue(message),
                time = message.GetType().GetProperty("Time")?.GetValue(message),
                isCall = message.GetType().GetProperty("IsCall")?.GetValue(message) ?? false,
                chatId
            });
        }

        public async Task MessageRead(string chatId)
        {
            await Clients.Group(chatId).SendAsync("MessageRead");
        }

        public async Task CallUser(string toUserId, string chatId)
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = Context.User?.Identity?.Name;

            if (string.IsNullOrEmpty(fromUserName))
            {
                var user = await _context.Users.FindAsync(fromUserId);
                fromUserName = user?.Name ?? fromUserId;
            }

            if (string.IsNullOrEmpty(fromUserId) || string.IsNullOrEmpty(toUserId))
            {
                return;
            }

            await Clients.User(toUserId).SendAsync("IncomingCall", new
            {
                fromUserId,
                fromUserName,
                callType = "voice",
                chatId
            });
        }

        public async Task EndCall(string targetUserId, string chatId)
        {
            var callerId = Context.UserIdentifier;
            var callerName = Context.User?.Identity?.Name ?? "User";

            if (string.IsNullOrEmpty(callerId))
            {
                return;
            }

            if (string.IsNullOrEmpty(chatId) || !activeCalls.ContainsKey(chatId))
            {
                await Clients.User(targetUserId).SendAsync("CallEnded");
                await Clients.User(callerId).SendAsync("CallEnded");
                return;
            }

            var startTime = activeCalls[chatId];
            var duration = DateTime.UtcNow - startTime;
            activeCalls.Remove(chatId);

            string durationText =
                duration.TotalMinutes >= 1
                    ? $"{(int)duration.TotalMinutes} min {duration.Seconds} sec"
                    : $"{duration.Seconds} sec";

            var message = new Message
            {
                ChatId = int.Parse(chatId),
                SenderId = callerId,
                SenderName = callerName,
                Text = $"Voice call - {durationText}",
                Time = DateTime.UtcNow,
                IsCall = true,
                Status = "read"
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            await Clients.Group(chatId).SendAsync("ReceiveMessage", new
            {
                id = message.Id,
                senderId = message.SenderId,
                senderName = message.SenderName,
                message = message.Text,
                time = message.Time,
                isCall = true,
                chatId
            });

            await Clients.User(targetUserId).SendAsync("CallEnded");
            await Clients.User(callerId).SendAsync("CallEnded");
        }

        public async Task SendOffer(string offer, string toUserId)
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = Context.User?.Identity?.Name;

            if (string.IsNullOrEmpty(fromUserName))
            {
                var user = await _context.Users.FindAsync(fromUserId);
                fromUserName = user?.Name ?? fromUserId;
            }

            await Clients.User(toUserId).SendAsync("ReceiveOffer", new
            {
                offer,
                fromUserId,
                fromUserName
            });
        }

        public async Task SendAnswer(string answer, string toUserId)
        {
            var fromUserId = Context.UserIdentifier;

            await Clients.User(toUserId).SendAsync("ReceiveAnswer", new
            {
                answer,
                fromUserId
            });
        }

        public async Task SendIceCandidate(string candidate, string toUserId)
        {
            var fromUserId = Context.UserIdentifier;

            await Clients.User(toUserId).SendAsync("ReceiveIceCandidate", new
            {
                candidate,
                fromUserId
            });
        }

        public async Task AcceptCall(string toUserId, string chatId)
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = Context.User?.Identity?.Name;

            if (string.IsNullOrEmpty(fromUserName))
            {
                var user = await _context.Users.FindAsync(fromUserId);
                fromUserName = user?.Name ?? fromUserId;
            }

            if (string.IsNullOrEmpty(fromUserId) || string.IsNullOrEmpty(toUserId) || string.IsNullOrEmpty(chatId))
            {
                return;
            }

            activeCalls[chatId] = DateTime.UtcNow;

            var message = new Message
            {
                ChatId = int.Parse(chatId),
                SenderId = fromUserId,
                SenderName = fromUserName,
                Text = "Voice call started",
                Time = DateTime.UtcNow,
                IsCall = true,
                Status = "sent"
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            await Clients.Group(chatId).SendAsync("ReceiveMessage", new
            {
                id = message.Id,
                senderId = message.SenderId,
                senderName = message.SenderName,
                message = message.Text,
                time = message.Time,
                isCall = true,
                chatId
            });

            await Clients.User(toUserId).SendAsync("CallAccepted", new
            {
                fromUserId,
                fromUserName,
                toUserId,
                chatId
            });

            await Clients.User(fromUserId).SendAsync("CallAccepted", new
            {
                fromUserId,
                fromUserName,
                toUserId,
                chatId
            });
        }

        public async Task RejectCall(string toUserId, string chatId)
        {
            var fromUserId = Context.UserIdentifier;

            if (string.IsNullOrEmpty(fromUserId) || string.IsNullOrEmpty(toUserId))
            {
                return;
            }

            if (!string.IsNullOrEmpty(chatId) && activeCalls.ContainsKey(chatId))
            {
                activeCalls.Remove(chatId);
            }

            await Clients.User(toUserId).SendAsync("CallRejected", fromUserId);
            await Clients.User(fromUserId).SendAsync("CallRejected");
        }
    }
}