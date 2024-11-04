using AutoMapper;

namespace GeneralData.BLL.Map
{
    internal class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<Thems, ThemsDto>().ReverseMap();
        }
    }
}