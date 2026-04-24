using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;
using CalChatAPI.Data;
using CalChatAPI.Models;

namespace CalChatAPI.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        private static readonly ConcurrentDictionary<string, DateTime> ActiveCalls = new();

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task<string> GetCurrentUserName()
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = Context.User?.Identity?.Name;

            if (string.IsNullOrWhiteSpace(fromUserName) && !string.IsNullOrWhiteSpace(fromUserId))
            {
                var user = await _context.Users.FindAsync(fromUserId);
                fromUserName = user?.Name ?? fromUserId;
            }

            return fromUserName ?? "User";
        }

        private Task SendToUserChannel(string userId, string method, object payload)
        {
            return Clients.Group(userId).SendAsync(method, payload);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

            if (!string.IsNullOrWhiteSpace(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);

                if (role == "employee")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Employees");
                }

                Console.WriteLine($"Connected: {userId}");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;

            if (!string.IsNullOrWhiteSpace(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
                Console.WriteLine($"Disconnected: {userId}");
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinChat(string chatId)
        {
            if (string.IsNullOrWhiteSpace(chatId))
            {
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        }

        public async Task SendMessage(object message)
        {
            if (message == null)
            {
                return;
            }

            var chatId = message.GetType().GetProperty("ChatId")?.GetValue(message)?.ToString();
            if (string.IsNullOrWhiteSpace(chatId))
            {
                return;
            }

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
            var fromUserName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(fromUserId) ||
                string.IsNullOrWhiteSpace(toUserId) ||
                string.IsNullOrWhiteSpace(chatId))
            {
                return;
            }

            var payload = new
            {
                fromUserId,
                fromUserName,
                toUserId,
                callType = "voice",
                chatId
            };

            await SendToUserChannel(toUserId, "IncomingCall", payload);
            await SendToUserChannel(fromUserId, "OutgoingCall", payload);
        }

        public async Task AcceptCall(string toUserId, string chatId)
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(fromUserId) ||
                string.IsNullOrWhiteSpace(toUserId) ||
                string.IsNullOrWhiteSpace(chatId))
            {
                return;
            }

            ActiveCalls[chatId] = DateTime.UtcNow;

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

            var payload = new
            {
                fromUserId,
                fromUserName,
                toUserId,
                chatId
            };

            await SendToUserChannel(toUserId, "CallAccepted", payload);
            await SendToUserChannel(fromUserId, "CallAccepted", payload);
        }

        public async Task RejectCall(string toUserId, string chatId)
        {
            var fromUserId = Context.UserIdentifier;

            if (string.IsNullOrWhiteSpace(fromUserId) || string.IsNullOrWhiteSpace(toUserId))
            {
                return;
            }

            if (!string.IsNullOrWhiteSpace(chatId))
            {
                ActiveCalls.TryRemove(chatId, out _);
            }

            await SendToUserChannel(toUserId, "CallRejected", new { fromUserId, chatId });
            await SendToUserChannel(fromUserId, "CallRejected", new { fromUserId, chatId });
        }

        public async Task SendOffer(string offer, string toUserId)
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(fromUserId) || string.IsNullOrWhiteSpace(toUserId))
            {
                return;
            }

            await SendToUserChannel(toUserId, "ReceiveOffer", new
            {
                offer,
                fromUserId,
                fromUserName
            });
        }

        public async Task SendAnswer(string answer, string toUserId)
        {
            var fromUserId = Context.UserIdentifier;
            if (string.IsNullOrWhiteSpace(fromUserId) || string.IsNullOrWhiteSpace(toUserId))
            {
                return;
            }

            await SendToUserChannel(toUserId, "ReceiveAnswer", new
            {
                answer,
                fromUserId
            });
        }

        public async Task SendIceCandidate(string candidate, string toUserId)
        {
            var fromUserId = Context.UserIdentifier;
            if (string.IsNullOrWhiteSpace(fromUserId) || string.IsNullOrWhiteSpace(toUserId))
            {
                return;
            }

            await SendToUserChannel(toUserId, "ReceiveIceCandidate", new
            {
                candidate,
                fromUserId
            });
        }

        public async Task EndCall(string targetUserId, string chatId)
        {
            var callerId = Context.UserIdentifier;
            var callerName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(callerId))
            {
                return;
            }

            if (string.IsNullOrWhiteSpace(chatId) || !ActiveCalls.TryRemove(chatId, out var startTime))
            {
                await SendToUserChannel(targetUserId, "CallEnded", new { chatId });
                await SendToUserChannel(callerId, "CallEnded", new { chatId });
                return;
            }

            var duration = DateTime.UtcNow - startTime;
            var durationText =
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

            await SendToUserChannel(targetUserId, "CallEnded", new { chatId });
            await SendToUserChannel(callerId, "CallEnded", new { chatId });
        }
    }
}