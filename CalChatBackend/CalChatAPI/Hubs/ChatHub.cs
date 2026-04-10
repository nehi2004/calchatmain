using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace CalChatAPI.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        // ===============================
        // CONNECTION HANDLING
        // ===============================

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier; // ✅ FIX
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                // ✅ user specific group
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);

                // ✅ ONLY EMPLOYEES GROUP
                if (role == "employee")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Employees");
                }

                Console.WriteLine($"✅ User CONNECTED: {userId} | Role: {role}");
            }

            await base.OnConnectedAsync();
            Console.WriteLine($"🟢 Joined Group: {userId}");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;

            if (!string.IsNullOrEmpty(userId))
            {
                Console.WriteLine($"❌ User DISCONNECTED: {userId}");
            }

            await base.OnDisconnectedAsync(exception);
        }

        // ===============================
        // JOIN CHAT (🔥 IMPORTANT)
        // ===============================

        public async Task JoinChat(string chatId)
        {
            if (string.IsNullOrEmpty(chatId))
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        }

        // ===============================
        // SEND MESSAGE (🔥 FIXED)
        // ===============================

        public async Task SendMessage(object message)
        {
            if (message == null) return;

            var chatId = message.GetType()
                .GetProperty("chatId")?
                .GetValue(message)?
                .ToString();

            if (string.IsNullOrEmpty(chatId)) return;

            await Clients.Group(chatId).SendAsync("ReceiveMessage", new
            {
                id = message.GetType().GetProperty("Id")?.GetValue(message),
                senderId = message.GetType().GetProperty("SenderId")?.GetValue(message),
                senderName = message.GetType().GetProperty("SenderName")?.GetValue(message),
                message = message.GetType().GetProperty("Message")?.GetValue(message),
                fileUrl = message.GetType().GetProperty("FileUrl")?.GetValue(message),
                time = message.GetType().GetProperty("Time")?.GetValue(message),
                chatId = chatId   // ✅ ADD THIS
            });
        }

        // ===============================
        // MESSAGE READ
        // ===============================

        public async Task MessageRead(string chatId)
        {
            await Clients.Group(chatId).SendAsync("MessageRead");
        }

        // ===============================
        // GROUP CHAT (OPTIONAL)
        // ===============================

        public async Task JoinGroup(string groupId)
        {
            if (string.IsNullOrEmpty(groupId))
                return;

            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        }

        // ===============================
        // NOTIFICATIONS
        // ===============================

        public async Task SendNotificationToUser(string targetUserId, string message)
        {
            if (string.IsNullOrEmpty(targetUserId))
                return;

            await Clients.User(targetUserId).SendAsync("ReceiveNotification", new
            {
                message
            });
        }

        public async Task SendAnnouncementToEmployees(string title, string content)
        {
            var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

            // 🚫 BLOCK NON-EMPLOYEE CALL
            if (role != "employee")
                return;

            await Clients.Group("Employees").SendAsync("ReceiveNotification", new
            {
                title,
                content
            });
        }

        // ===============================
        // CALLING SYSTEM
        // ===============================

        public async Task CallUser(string toUserId, string chatId)
        {
            var fromUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var fromUserName = Context.User?.Identity?.Name ?? "User";

            if (string.IsNullOrEmpty(fromUserId) || string.IsNullOrEmpty(toUserId))
                return;

            var callMessage = new
            {
                id = Guid.NewGuid(),
                senderId = fromUserId,
                senderName = fromUserName,
                message = "📞 Call Started",
                time = DateTime.UtcNow,
                status = "sent",
                isCall = true,
                chatId = chatId   // ✅ FIXED
            };

            await Clients.Group(chatId).SendAsync("ReceiveMessage", callMessage);

            await Clients.User(toUserId).SendAsync("IncomingCall", new
            {
                fromUserId,
                fromUserName,
                callType = "voice"
            });
        }

        // ===============================
        // 🔥 SEND OFFER (MISSING METHOD)
        // ===============================
        public async Task SendOffer(string offer, string toUserId)
        {
            var fromUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(fromUserId)) return;

            await Clients.User(toUserId).SendAsync("ReceiveOffer", new
            {
                offer,
                fromUserId
            });
        }



        public async Task AcceptCall(string toUserId)
        {
            var fromUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await Clients.User(toUserId).SendAsync("CallAccepted", new
            {
                fromUserId
            });
        }




        public async Task RejectCall(string toUserId)
        {
            await Clients.User(toUserId).SendAsync("CallRejected", toUserId);
        }



        public async Task EndCall(string targetUserId, string chatId)
        {
            var callerId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(callerId)) return;

            var endMessage = new
            {
                id = Guid.NewGuid(),
                senderId = callerId,
                senderName = "User",
                message = "📞 Call Ended",
                time = DateTime.UtcNow,
                status = "read",
                isCall = true,
                chatId = chatId   // ✅ FIXED
            };

            await Clients.Group(chatId).SendAsync("ReceiveMessage", endMessage);

            await Clients.User(targetUserId).SendAsync("CallEnded");
        }


        public async Task SendAnswer(string answer, string toUserId)
        {
            var fromUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await Clients.User(toUserId).SendAsync("ReceiveAnswer", new
            {
                answer,
                fromUserId
            });
        }



        public async Task SendIceCandidate(string candidate, string toUserId)
        {
            var fromUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await Clients.User(toUserId).SendAsync("ReceiveIceCandidate", new
            {
                candidate,
                fromUserId
            });
        }
    }
}