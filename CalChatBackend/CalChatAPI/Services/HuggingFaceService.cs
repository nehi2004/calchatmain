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
     "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
 );

                request.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", _apiKey);
                var payload = new
                {
                    inputs = $"Answer like a helpful assistant: {message}"
                };

                request.Content = new StringContent(
                    JsonConvert.SerializeObject(payload),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.SendAsync(request);
                var result = await response.Content.ReadAsStringAsync();
                Console.WriteLine("🔥 HF RAW RESPONSE: " + result);

                // check error
                if (result.Contains("error"))
                {
                    return "⚠️ AI is busy right now. Try again.";
                }

                dynamic json = JsonConvert.DeserializeObject(result);

                // safe check
                if (json == null || json.Count == 0)
                {
                    return "⚠️ No response from AI.";
                }

                // flan-t5 returns "generated_text"
                var text = json[0]["generated_text"]?.ToString();

                if (string.IsNullOrEmpty(text))
                {
                    return "⚠️ Empty AI response.";
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