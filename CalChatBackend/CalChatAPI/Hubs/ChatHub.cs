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
        private static readonly ConcurrentDictionary<string, CallRoom> CallRooms = new();

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public sealed class StartCallRequest
        {
            public string ChatId { get; set; } = string.Empty;
            public string ChatName { get; set; } = string.Empty;
            public string CallType { get; set; } = "voice";
            public bool IsGroup { get; set; }
            public List<string> ParticipantIds { get; set; } = new();
        }

        private sealed class CallRoom
        {
            public string ChatId { get; set; } = string.Empty;
            public string ChatName { get; set; } = string.Empty;
            public string InitiatorId { get; set; } = string.Empty;
            public string InitiatorName { get; set; } = string.Empty;
            public string CallType { get; set; } = "voice";
            public bool IsGroup { get; set; }
            public DateTime StartedAtUtc { get; set; } = DateTime.UtcNow;
            public HashSet<string> InvitedUserIds { get; set; } = new();
            public HashSet<string> JoinedUserIds { get; set; } = new();
        }

        private async Task<string> GetCurrentUserName()
        {
            var userId = Context.UserIdentifier;
            var userName = Context.User?.Identity?.Name;

            if (string.IsNullOrWhiteSpace(userName) && !string.IsNullOrWhiteSpace(userId))
            {
                var user = await _context.Users.FindAsync(userId);
                userName = user?.Name ?? userId;
            }

            return userName ?? "User";
        }

        private Task SendToUserChannel(string userId, string method, object payload)
        {
            return Clients.Group(userId).SendAsync(method, payload);
        }

        private async Task PersistCallMessage(string chatId, string senderId, string senderName, string text, string status = "read")
        {
            if (!int.TryParse(chatId, out var parsedChatId))
            {
                return;
            }

            var message = new Message
            {
                ChatId = parsedChatId,
                SenderId = senderId,
                SenderName = senderName,
                Text = text,
                Time = DateTime.UtcNow,
                IsCall = true,
                Status = status
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
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;

            if (!string.IsNullOrWhiteSpace(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinChat(string chatId)
        {
            if (!string.IsNullOrWhiteSpace(chatId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
            }
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

        public async Task StartCall(StartCallRequest request)
        {
            var callerId = Context.UserIdentifier;
            var callerName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(callerId) ||
                string.IsNullOrWhiteSpace(request.ChatId) ||
                request.ParticipantIds == null ||
                request.ParticipantIds.Count == 0)
            {
                return;
            }

            var targetIds = request.ParticipantIds
                .Where(id => !string.IsNullOrWhiteSpace(id) && id != callerId)
                .Distinct()
                .ToHashSet();

            if (targetIds.Count == 0)
            {
                return;
            }

            var room = new CallRoom
            {
                ChatId = request.ChatId,
                ChatName = request.ChatName,
                InitiatorId = callerId,
                InitiatorName = callerName,
                CallType = request.CallType,
                IsGroup = request.IsGroup,
                StartedAtUtc = DateTime.UtcNow,
                InvitedUserIds = targetIds,
                JoinedUserIds = new HashSet<string> { callerId }
            };

            CallRooms[request.ChatId] = room;

            await PersistCallMessage(
                request.ChatId,
                callerId,
                callerName,
                request.IsGroup ? "Started a group call" : $"Started a {request.CallType} call",
                "sent");

            var payload = new
            {
                chatId = request.ChatId,
                chatName = request.ChatName,
                callerId,
                callerName,
                participantIds = targetIds.ToList(),
                isGroup = request.IsGroup,
                callType = request.CallType
            };

            foreach (var userId in targetIds)
            {
                await SendToUserChannel(userId, "IncomingCall", payload);
            }
        }

        public async Task AcceptCall(string chatId)
        {
            var userId = Context.UserIdentifier;
            var userName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(userId) ||
                string.IsNullOrWhiteSpace(chatId) ||
                !CallRooms.TryGetValue(chatId, out var room))
            {
                return;
            }

            room.JoinedUserIds.Add(userId);

            await PersistCallMessage(
                chatId,
                userId,
                userName,
                room.IsGroup ? $"{userName} joined the group call" : "Call accepted",
                "read");

            var payload = new
            {
                chatId,
                userId,
                userName
            };

            var notifyUsers = room.JoinedUserIds.Union(room.InvitedUserIds).Distinct().ToList();

            foreach (var targetUserId in notifyUsers)
            {
                await SendToUserChannel(targetUserId, "ParticipantJoinedCall", payload);
            }
        }

        public async Task RejectCall(string chatId)
        {
            var userId = Context.UserIdentifier;
            var userName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(userId) ||
                string.IsNullOrWhiteSpace(chatId) ||
                !CallRooms.TryGetValue(chatId, out var room))
            {
                return;
            }

            room.InvitedUserIds.Remove(userId);

            await PersistCallMessage(chatId, userId, userName, "Call rejected", "read");

            await SendToUserChannel(room.InitiatorId, "CallRejected", new
            {
                chatId,
                endedBy = userName
            });

            if (room.InvitedUserIds.Count == 0 && room.JoinedUserIds.Count <= 1)
            {
                CallRooms.TryRemove(chatId, out _);
            }
        }

        public async Task SendOffer(string chatId, string toUserId, string offer)
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(fromUserId) ||
                string.IsNullOrWhiteSpace(toUserId) ||
                string.IsNullOrWhiteSpace(chatId) ||
                string.IsNullOrWhiteSpace(offer))
            {
                return;
            }

            var callType = CallRooms.TryGetValue(chatId, out var room)
                ? room.CallType
                : "voice";

            await SendToUserChannel(toUserId, "ReceiveOffer", new
            {
                chatId,
                fromUserId,
                fromUserName,
                offer,
                callType
            });
        }

        public async Task SendAnswer(string chatId, string toUserId, string answer)
        {
            var fromUserId = Context.UserIdentifier;
            if (string.IsNullOrWhiteSpace(fromUserId) ||
                string.IsNullOrWhiteSpace(toUserId) ||
                string.IsNullOrWhiteSpace(chatId) ||
                string.IsNullOrWhiteSpace(answer))
            {
                return;
            }

            await SendToUserChannel(toUserId, "ReceiveAnswer", new
            {
                chatId,
                fromUserId,
                answer
            });
        }

        public async Task SendIceCandidate(string chatId, string toUserId, string candidate)
        {
            var fromUserId = Context.UserIdentifier;
            if (string.IsNullOrWhiteSpace(fromUserId) ||
                string.IsNullOrWhiteSpace(toUserId) ||
                string.IsNullOrWhiteSpace(chatId) ||
                string.IsNullOrWhiteSpace(candidate))
            {
                return;
            }

            await SendToUserChannel(toUserId, "ReceiveIceCandidate", new
            {
                chatId,
                fromUserId,
                candidate
            });
        }

        public async Task LeaveCall(string chatId)
        {
            var userId = Context.UserIdentifier;
            var userName = await GetCurrentUserName();

            if (string.IsNullOrWhiteSpace(userId) ||
                string.IsNullOrWhiteSpace(chatId) ||
                !CallRooms.TryGetValue(chatId, out var room))
            {
                return;
            }

            room.JoinedUserIds.Remove(userId);
            room.InvitedUserIds.Remove(userId);

            await PersistCallMessage(chatId, userId, userName, $"{userName} left the call", "read");

            var leftPayload = new
            {
                chatId,
                userId,
                userName
            };

            foreach (var targetUserId in room.JoinedUserIds.ToList())
            {
                await SendToUserChannel(targetUserId, "ParticipantLeftCall", leftPayload);
            }

            if (room.JoinedUserIds.Count <= 1)
            {
                foreach (var targetUserId in room.JoinedUserIds.ToList())
                {
                    await SendToUserChannel(targetUserId, "CallEnded", new
                    {
                        chatId,
                        chatName = room.ChatName,
                        endedBy = userName
                    });
                }

                CallRooms.TryRemove(chatId, out _);
            }
        }
    }
}
