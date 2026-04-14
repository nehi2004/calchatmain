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

            dynamic json = JsonConvert.DeserializeObject(result);

            return json[0]["generated_text"].ToString();
        }
    }
}