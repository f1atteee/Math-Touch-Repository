using Math.Users.DAL.Models;
using Math.Users.DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Math.Users.DAL.Repositories
{
    internal class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(UsersContext context) : base(context) { }

        public async Task<User> GetByLogin(string login)
        {
            return await _dbSet.Where(x => x.UserName == login).FirstAsync();
        }

        public async Task<User> GetByEmail(string email)
        {
            return await _dbSet.Where(x => x.Email == email).FirstAsync();
        }
    }
}