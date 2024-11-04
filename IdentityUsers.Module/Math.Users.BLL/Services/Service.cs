using Math.Users.BLL.Map;
using Math.Users.DAL.Interface;
using AutoMapper;

namespace Math.Users.BLL.Services
{
    internal class Service<T, M> : BaseMapper<T, M>
    {
        protected readonly IUnitOfWork _unitOfWork;

        public Service(IMapper mapper, IUnitOfWork unitOfWork) : base(mapper)
        {
            this._unitOfWork = unitOfWork;
        }
    }
}