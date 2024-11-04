using GeneralData.DAL.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GeneralData.DAL
{
    public static class DependencyInjection
    {
        public static void GetDIDataBaseLayer(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextFactory<GeneralContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddTransient<IUnitOfWork, UnitOfWork>();
        }
    }
}
