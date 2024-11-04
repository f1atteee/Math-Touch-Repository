using Math.Users.DAL.Models;
using Math.Users.DAL.Repositories.Interfaces;

namespace Math.Users.DAL.Interface
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> GetRepository<TEntity>() where TEntity : Model;

        IUserRepository UserRepository { get; }

        Task SaveAsync();
    }
}