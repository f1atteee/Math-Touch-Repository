namespace Math.Users.DAL.Repositories.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetByLimitAsync(int skip, int limit);
        Task<T> Create(T entity);
        Task Update(T item);
        Task Delete(int id);
        Task<int> Count();
        Task<T?> GetLastItemAsync();
    }
}