using Math.Users.DAL.Interface;
using EntityFrameworkCore.UseRowNumberForPaging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Math.Users.DAL
{
    public static class DependencyInjection
    {
        public static void GetDIDataBaseLayer(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<UsersContext>(options =>
                options.UseSqlServer(connectionString, builder => builder.UseRowNumberForPaging()));

            services.AddTransient<IUnitOfWork, UnitOfWork>();
        }
    }
}