using Math.Users.Api.Models;
using Math.Users.BLL.Dtos;
using AutoMapper;

namespace Math.Users.Api.Mapper
{
    public class MapProfile : Profile
    {
        public MapProfile() 
        {
            CreateMap<UserModel, UserDto>().ReverseMap();
            CreateMap<UserForCreateModel, UserDto>().ReverseMap();
            CreateMap<CredentialsModel, CredentialsDto>().ReverseMap();
            CreateMap<TokenModel, TokenDto>().ReverseMap();
            CreateMap<UserInfo, UserInfoDto>().ReverseMap();
        }
    }
}