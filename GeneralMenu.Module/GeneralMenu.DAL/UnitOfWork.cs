using GeneralData.DAL.Interface;
using GeneralData.DAL.Models;
using GeneralData.DAL.Repositories;
using GeneralData.DAL.Repositories.Interfaces;

namespace GeneralData.DAL
{
    internal class UnitOfWork : IUnitOfWork
    {
        protected readonly GeneralContext _context;

        public IThemsRepository ThemsRepository { get; set; }

        private bool _disposed = false;

        public UnitOfWork(GeneralContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            _context = context;
            ThemsRepository = new ThemsRepository(context);
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