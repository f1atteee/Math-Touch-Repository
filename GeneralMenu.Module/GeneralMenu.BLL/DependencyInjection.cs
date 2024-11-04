using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GeneralData.BLL
{
    public static class DependencyInjection
    {
        public static void GetDIBusinessLogicLayer(this IServiceCollection services, IMapperConfigurationExpression mapConfigExpression,
            IConfiguration configuration)
        {
            mapConfigExpression.AddProfile<MapProfile>();

            services.AddScoped<IUserService, UserService>();
            services.AddTransient<HttpClient>();

            services.GetDIDataBaseLayer(configuration);
        }
    }
}
