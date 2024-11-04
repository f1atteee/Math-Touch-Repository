namespace GeneralData.API.Auth
{
    public class TokenAddingMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenAddingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!context.Request.Headers.ContainsKey("Authorization") &&
                context.Request.Cookies.TryGetValue("access_token", out var token))
            {
                context.Request.Headers["Authorization"] = $"Bearer {token}";
            }

            await _next(context);
        }
    }
}