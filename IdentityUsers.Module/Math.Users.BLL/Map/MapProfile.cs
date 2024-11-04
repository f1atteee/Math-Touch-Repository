using Math.Users.BLL.Dtos;
using Math.Users.DAL.Models;
using AutoMapper;

namespace Math.Users.BLL.Map
{
    internal class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserInfoDto, UserDto>().ReverseMap();
        }
    }
}