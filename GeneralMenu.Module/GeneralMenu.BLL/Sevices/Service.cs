using AutoMapper;
using GeneralData.BLL.Map;

namespace GeneralData.BLL.Sevices
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