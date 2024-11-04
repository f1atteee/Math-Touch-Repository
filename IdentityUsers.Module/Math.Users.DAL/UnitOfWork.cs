using Math.Users.DAL.Interface;
using Math.Users.DAL.Repositories.Interfaces;
using Math.Users.DAL.Repositories;
using Math.Users.DAL.Models;

namespace Math.Users.DAL
{
    internal class UnitOfWork : IUnitOfWork
    {
        protected readonly UsersContext _context;

        public IUserRepository UserRepository { get; set; }

        private bool _disposed = false;

        public UnitOfWork(UsersContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            _context = context;
            UserRepository = new UserRepository(context);
        }

        public IGenericRepository<TEntity> GetRepository<TEntity>() where TEntity : Model
        {
            return new GenericRepository<TEntity>(_context);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this._disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }

            this._disposed = true;
        }
    }
}