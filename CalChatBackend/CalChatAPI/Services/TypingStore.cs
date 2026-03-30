using System.Collections.Concurrent;

namespace CalChatAPI.Services
{
    public static class TypingStore
    {
        private static ConcurrentDictionary<int, (string userId, DateTime time)> typingUsers = new();

        public static void SetTyping(int chatId, string userId)
        {
            typingUsers[chatId] = (userId, DateTime.UtcNow);
        }

        public static string? GetTyping(int chatId)
        {
            if (!typingUsers.ContainsKey(chatId))
                return null;

            var data = typingUsers[chatId];

            if ((DateTime.UtcNow - data.time).TotalSeconds > 3)
            {
                typingUsers.TryRemove(chatId, out _);
                return null;
            }

            return data.userId;
        }
    }
}