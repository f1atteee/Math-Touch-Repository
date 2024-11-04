using Math.Users.DAL.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace Math.Users.DAL
{
    public static class DependencyInjection
    {
        public static void GetDIDataBaseLayer(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextFactory<UsersContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            services.AddTransient<IUnitOfWork, UnitOfWork>();
        }
    }
}