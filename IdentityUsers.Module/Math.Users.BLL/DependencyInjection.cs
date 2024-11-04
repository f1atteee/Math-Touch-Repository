using Math.Users.BLL.Map;
using Math.Users.BLL.Services;
using Math.Users.BLL.Services.Interfaces;
using Math.Users.DAL;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Math.Users.BLL
{
    public static class DependencyInjection
    {
        private const string _connectionString = "LocalConnection";
        public static void GetDIBusinessLogicLayer(this IServiceCollection services, IMapperConfigurationExpression mapConfigExpression, 
            IConfiguration configuration)

        {
            mapConfigExpression.AddProfile<MapProfile>();

            services.AddScoped<IUserService, UserService>();
            services.AddTransient<HttpClient>();

            services.GetDIDataBaseLayer(configuration.GetConnectionString(_connectionString)!);
        }
    }
}