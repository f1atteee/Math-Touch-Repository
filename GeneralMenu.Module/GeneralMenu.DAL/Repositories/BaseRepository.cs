using GeneralData.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace GeneralData.DAL.Repositories
{
    internal class BaseRepository<T> where T : Model
    {
        protected readonly GeneralContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(GeneralContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            _context = context;
            this._dbSet = context.Set<T>();
        }
    }
}