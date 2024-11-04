using Microsoft.EntityFrameworkCore;
using Math.Users.DAL.Models;
using Math.Users.DAL.Repositories.Interfaces;

namespace Math.Users.DAL.Repositories
{
    internal class GenericRepository<T> : BaseRepository<T>, IGenericRepository<T> where T : Model
    {
        public GenericRepository(UsersContext context) : base(context) { }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetByLimitAsync(int skip, int limit)
        {
            return await _dbSet.OrderBy(x => x.Id).Skip(skip).Take(limit).ToListAsync();
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> Create(T entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }
            var exsistModel = await _dbSet.FindAsync(entity.Id);
            if (exsistModel == null)
            {
                throw new ArgumentNullException(nameof(exsistModel));
            }
            _context.Entry(exsistModel).CurrentValues.SetValues(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task Delete(int id)
        {
            ArgumentNullException.ThrowIfNull(id);
            var eventModel = await _dbSet.FindAsync(id);
            if (eventModel == null)
            {
                throw new ArgumentNullException(nameof(eventModel));
            }
            _dbSet.Remove(eventModel);
            await _context.SaveChangesAsync();
        }

        public async Task<int> Count()
        {
            return await _dbSet.CountAsync();
        }

        public async Task<T?> GetLastItemAsync()
        {
            return await _dbSet.OrderByDescending(x => x.Id).FirstOrDefaultAsync();
        }
    }
}