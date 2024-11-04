using Math.Users.BLL.Dtos;
using Math.Users.BLL.Services.Interface;

namespace Math.Users.BLL.Services.Interfaces
{
    public interface IUserService : IService<UserDto>
    {
        new Task<TokenDto> Create(UserDto user);
        Task<TokenDto> Login(CredentialsDto crt);
    }
}