using AutoMapper;

namespace GeneralData.BLL.Map
{
    internal abstract class BaseMapper<T, M>
    {
        protected IMapper _mapper;

        public BaseMapper(IMapper mapper)
        {
            ArgumentNullException.ThrowIfNull(mapper);

            _mapper = mapper;
        }

        protected T Map(M? entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return _mapper.Map<T>(entity);
        }

        protected M Map(T? entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return _mapper.Map<M>(entity);
        }

        protected IEnumerable<M> Map(IEnumerable<T>? entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return _mapper.Map<IEnumerable<M>>(entity);
        }

        protected IEnumerable<T?> Map(IEnumerable<M>? entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return _mapper.Map<IEnumerable<T>>(entity);
        }
    }
}