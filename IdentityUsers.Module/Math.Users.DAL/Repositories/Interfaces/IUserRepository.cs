using Math.Users.DAL.Models;

namespace Math.Users.DAL.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> GetByLogin(string login);
        Task<User> GetByEmail(string email);
    }
}