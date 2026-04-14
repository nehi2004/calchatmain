using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Text;

namespace CalChatAPI.Services
{
    public class HuggingFaceService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public HuggingFaceService(IConfiguration config)
        {
            _httpClient = new HttpClient();

            // 🔥 IMPORTANT: ENV variable se key lena
            _apiKey = Environment.GetEnvironmentVariable("HF_API_KEY");
        }

        public async Task<string> GetChatResponse(string message)
        {
            try
            {
                var request = new HttpRequestMessage(
                    HttpMethod.Post,
                    "https://api-inference.huggingface.co/models/google/flan-t5-large"
                );

                request.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", _apiKey);

                var payload = new
                {
                    inputs = $"You are a helpful AI assistant. Answer briefly:\n{message}"
                };

                request.Content = new StringContent(
                    JsonConvert.SerializeObject(payload),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.SendAsync(request);
                var result = await response.Content.ReadAsStringAsync();

                Console.WriteLine("🔥 HF RAW RESPONSE: " + result);

                if (!response.IsSuccessStatusCode)
                {
                    return "⚠️ AI service failed.";
                }

                dynamic json = JsonConvert.DeserializeObject(result);

                if (json == null || json[0] == null)
                {
                    return "⚠️ No AI response.";
                }

                var text = json[0]["generated_text"]?.ToString();

                if (string.IsNullOrEmpty(text))
                {
                    return "⚠️ Empty response.";
                }

                return text.Trim();
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ HF ERROR: " + ex.Message);
                return "⚠️ AI error occurred.";
            }
        }
    }
}