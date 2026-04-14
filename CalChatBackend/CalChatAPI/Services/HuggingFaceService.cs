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
                    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
                );

                request.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", _apiKey);

                var payload = new
                {
                    inputs = $"You are CalChat AI. You are friendly and helpful.\nUser: {message}\nAssistant:"
                };

                request.Content = new StringContent(
                    JsonConvert.SerializeObject(payload),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.SendAsync(request);
                var result = await response.Content.ReadAsStringAsync();

                Console.WriteLine("🔥 HF RAW RESPONSE: " + result);

                // 🔥 SAFE PARSE
                if (result.Contains("error"))
                {
                    return "⚠️ AI is currently busy, please try again in a moment.";
                }

                dynamic json = JsonConvert.DeserializeObject(result);

                if (json is null || json[0] == null)
                {
                    return "⚠️ AI response failed. Try again.";
                }

                var text = json[0]["generated_text"]?.ToString();

                if (string.IsNullOrEmpty(text))
                {
                    return "⚠️ No response generated.";
                }

                return text;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ HF ERROR: " + ex.Message);
                return "⚠️ AI error occurred.";
            }
        }
    }
}