using GeneralData.DAL.Models;
using GeneralData.DAL.Repositories.Interfaces;

namespace GeneralData.DAL.Interface
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> GetRepository<TEntity>() where TEntity : Model;


        Task SaveAsync();
    }
}