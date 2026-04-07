//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.SignalR;
//using System.Security.Claims;

//namespace CalChatAPI.Hubs
//{
//    [Authorize]
//    public class ChatHub : Hub
//    {

//        // ===============================
//        // USER CONNECTION
//        // ===============================

//        public async Task JoinChat(string chatId)
//        {
//            if (string.IsNullOrEmpty(chatId))
//                return;

//            await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
//        }

//        public override async Task OnConnectedAsync()
//        {
//            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            if (!string.IsNullOrEmpty(userId))
//            {
//                // map connection to userId group
//                await Groups.AddToGroupAsync(Context.ConnectionId, userId);

//                Console.WriteLine($"User connected: {userId}");
//            }

//            await base.OnConnectedAsync();
//        }

//        public override async Task OnDisconnectedAsync(Exception? exception)
//        {
//            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            if (!string.IsNullOrEmpty(userId))
//            {
//                Console.WriteLine($"User disconnected: {userId}");
//            }

//            await base.OnDisconnectedAsync(exception);
//        }


//        // ===============================
//        // PRIVATE CHAT
//        // ===============================

//        public async Task JoinConversation(string conversationId)
//        {
//            if (string.IsNullOrEmpty(conversationId))
//                return;

//            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
//        }

//        public async Task SendMessage(string conversationId, string senderId, string senderName, string message)
//        {
//            var msg = new
//            {
//                id = Guid.NewGuid().ToString(),
//                conversationId,
//                senderId,
//                senderName,
//                message,
//                time = DateTime.UtcNow,
//                status = "sent"
//            };

//            await Clients.Group(conversationId).SendAsync("ReceiveMessage", msg);
//        }

//        public async Task MessageRead(string conversationId)
//        {
//            await Clients.Group(conversationId).SendAsync("MessageRead");
//        }


//        // ===============================
//        // MESSAGE REACTIONS
//        // ===============================

//        public async Task SendReaction(string conversationId, string messageId, string emoji)
//        {
//            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            await Clients.Group(conversationId).SendAsync("ReceiveReaction", new
//            {
//                messageId,
//                emoji,
//                userId
//            });
//        }


//        // ===============================
//        // GROUP CHAT
//        // ===============================

//        public async Task JoinGroup(string groupId)
//        {
//            if (string.IsNullOrEmpty(groupId))
//                return;

//            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
//        }

//        public async Task SendGroupMessage(string groupId, string senderId, string senderName, string message)
//        {
//            var msg = new
//            {
//                id = Guid.NewGuid().ToString(),
//                groupId,
//                senderId,
//                senderName,
//                message,
//                time = DateTime.UtcNow,
//                status = "sent"
//            };

//            await Clients.Group(groupId).SendAsync("ReceiveGroupMessage", msg);
//        }


//        // ===============================
//        // VOICE / VIDEO CALL SIGNALING
//        // ===============================

//        public async Task CallUser(string toUserId, string fromUserName, string callType)
//        {
//            var fromUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            Console.WriteLine($"Calling {toUserId} from {fromUserName}");

//            await Clients.Group(toUserId).SendAsync(
//                "IncomingCall",
//                fromUserId,
//                fromUserName,
//                callType
//            );
//        }

//        public async Task AcceptCall(string toUserId)
//        {
//            await Clients.Group(toUserId).SendAsync("CallAccepted", toUserId);
//        }

//        public async Task RejectCall(string toUserId)
//        {
//            await Clients.Group(toUserId).SendAsync("CallRejected", toUserId);
//        }

//        public async Task SendIceCandidate(string toUserId, object candidate)
//        {
//            await Clients.Group(toUserId).SendAsync("ReceiveIceCandidate", candidate);
//        }

//        // ===============================
//        // END CALL
//        // ===============================

//        public async Task EndCall(string targetUserId)
//        {
//            var callerId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//            if (string.IsNullOrEmpty(callerId))
//                return;

//            Console.WriteLine($"Call ended between {callerId} and {targetUserId}");

//            // notify other user
//            await Clients.Group(targetUserId)
//                .SendAsync("CallEnded", callerId);

//            // notify caller
//            await Clients.Group(callerId)
//                .SendAsync("CallEnded", targetUserId);
//        }
//    }
//}


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
                message = message.GetType().GetProperty("Message")?.GetValue(message), // ✅ FIX
                fileUrl = message.GetType().GetProperty("FileUrl")?.GetValue(message),
                time = message.GetType().GetProperty("Time")?.GetValue(message)
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

        public async Task CallUser(string toUserId, string callType)
        {
            var fromUserId = Context.UserIdentifier;
            var fromUserName = Context.User?.Identity?.Name ?? "User";

            await Clients.User(toUserId).SendAsync("IncomingCall", new
            {
                fromUserId,
                fromUserName,
                callType
            });
        }

        public async Task AcceptCall(string toUserId)
        {
            await Clients.User(toUserId).SendAsync("CallAccepted");
        }

        public async Task RejectCall(string toUserId)
        {
            await Clients.User(toUserId).SendAsync("CallRejected");
        }

        public async Task EndCall(string targetUserId)
        {
            var callerId = Context.UserIdentifier;

            if (string.IsNullOrEmpty(callerId))
                return;

            await Clients.User(targetUserId).SendAsync("CallEnded", callerId);
            await Clients.User(callerId).SendAsync("CallEnded", targetUserId);
        }
    }
}