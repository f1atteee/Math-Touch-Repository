using Math.Users.BLL.Dtos;
using Math.Users.BLL.Helpers;
using Math.Users.BLL.Services.Interfaces;
using Math.Users.DAL.Interface;
using Math.Users.DAL.Models;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Win32;

namespace Math.Users.BLL.Services
{
    internal class UserService : GenericService<UserDto, User>, IUserService
    {
        private readonly IConfiguration _configuration;
        public UserService(IMapper mapper, IUnitOfWork unitOfWork, IConfiguration config) : base(mapper, unitOfWork) 
        {
            _configuration = config;
        }

        public new async Task<TokenDto> Create (UserDto user)
        {
            user.Id = Guid.NewGuid();

            var registred = _mapper.Map<UserDto>(await _unitOfWork.UserRepository.Create(_mapper.Map<User>(user)));

            return new TokenDto() { AccesToken = GenerateJWT(registred), User = _mapper.Map<UserInfoDto>(registred) };
        }

        public async Task<TokenDto> Login(CredentialsDto crt)
        {
            if (crt == null) throw new Exception("no data");

            var user = _mapper.Map<UserDto>(EmailHelper.IsValidEmail(crt.Login)
                ? await _unitOfWork.UserRepository.GetByEmail(crt.Login)
                : await _unitOfWork.UserRepository.GetByLogin(crt.Login));

            return user?.Password == crt.Password ? new TokenDto() { AccesToken = GenerateJWT(user), User = _mapper.Map<UserInfoDto>(user) } : throw new Exception("invalid login");
        }

        private string GenerateJWT(UserDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["TokenSecurityKey"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.FirstName), 
                new Claim("username", user.UserName)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddYears(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}