namespace Math.Users.BLL.Services.Interface
{
    public interface IService<T>
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAll(int skip, int take);
        Task<T> Create(T entity);
        Task Update(T entity);
        Task Delete(int id);
        Task<T> GetLastItemAsync();
    }
}