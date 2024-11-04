using Math.Users.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Math.Users.DAL
{
    internal class UsersContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public UsersContext(DbContextOptions<UsersContext> options) : base(options) { }
    }
}