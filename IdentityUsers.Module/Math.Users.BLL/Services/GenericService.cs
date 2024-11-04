using Math.Users.BLL.Dtos;
using Math.Users.BLL.Map;
using Math.Users.BLL.Services.Interface;
using Math.Users.DAL.Interface;
using Math.Users.DAL.Models;
using AutoMapper;

namespace Math.Users.BLL.Services
{
    internal abstract class GenericService<T, M> : BaseMapper<T, M>, IService<T> where T : BaseDto where M : Model
    {
        protected readonly IUnitOfWork _unitOfWork;

        protected GenericService(IMapper mapper, IUnitOfWork unitOfWork) : base(mapper)
        {
            _unitOfWork = unitOfWork;
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return Map(await _unitOfWork.GetRepository<M>().GetByIdAsync(id))!;
        }

        public async Task<IEnumerable<T>> GetAll(int skip, int take)
        {
            return Map(await _unitOfWork.GetRepository<M>().GetByLimitAsync(skip, take))!;
        }

        public async Task<T> Create(T entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return Map(await _unitOfWork.GetRepository<M>().Create(Map(entity)!));
        }

        public async Task Update(T entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            await _unitOfWork.GetRepository<M>().Update(Map(entity)!);
            await _unitOfWork.SaveAsync();
        }

        public async Task Delete(int id)
        {
            await _unitOfWork.GetRepository<M>().Delete(id);
            await _unitOfWork.SaveAsync();
        }

        public async Task<T> GetLastItemAsync()
        {
            return Map(await _unitOfWork.GetRepository<M>().GetLastItemAsync());
        }
    }
}