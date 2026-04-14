using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json;

namespace CalChatAPI.Services
{
    public class GroqService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GroqService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> GetChatResponse(string message)
        {
            var apiKey = _config["Groq:ApiKey"];

            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("Groq API key is missing");
            }

            var requestBody = new
            {
                model = "llama3-8b-8192",
                messages = new[]
                {
            new { role = "user", content = message }
        }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.groq.com/openai/v1/chat/completions");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            request.Content = new StringContent(
                JsonConvert.SerializeObject(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception("Groq API error: " + error);
            }

            var responseString = await response.Content.ReadAsStringAsync();

            dynamic json = JsonConvert.DeserializeObject(responseString);

            return json?.choices[0]?.message?.content?.ToString() ?? "No response from AI";
        }
    }
}