using Math.Users.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Math.Users.DAL.Repositories
{
    internal class BaseRepository<T> where T : Model
    {
        protected readonly UsersContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(UsersContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            _context = context;
            this._dbSet = context.Set<T>();
        }
    }
}