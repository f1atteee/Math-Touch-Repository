using Math.Users.Api.Auth;
using Math.Users.Api.Mapper;
using Math.Users.Api.Swagger;
using Math.Users.BLL;
using AutoMapper;
using NLog.Extensions.Logging;

namespace Math.Users.Api
{
    public class Startup
    {
        private const string _tokenSecurityKey = "TokenSecurityKey";

        private readonly IConfiguration _configRoot;

        public Startup(IConfiguration configuration)
        {
            _configRoot = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var mapperConfig = new MapperConfigurationExpression();
            mapperConfig.AddProfile<MapProfile>();

            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(_configRoot.GetSection("Logging"));
                loggingBuilder.ClearProviders();
                loggingBuilder.SetMinimumLevel(LogLevel.Information);
                loggingBuilder.AddDebug();
                loggingBuilder.AddNLog();
            });

            services.GetDIBusinessLogicLayer(mapperConfig, _configRoot);
            services.AddTokenAuthentication(_configRoot.GetSection(_tokenSecurityKey).Value!);
            services.AddSwaggerOptions();
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddSingleton(new MapperConfiguration(mapperConfig).CreateMapper());
            services.AddCors();

        }

        public void Configure(WebApplication app)
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors(options => options.WithOrigins("*").WithHeaders("*").WithMethods("*"));

            app.UseMiddleware<TokenAddingMiddleware>();

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
        }
    }
}