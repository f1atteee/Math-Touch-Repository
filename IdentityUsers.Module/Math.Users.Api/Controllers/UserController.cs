using Math.Users.Api.Models;
using Math.Users.BLL.Dtos;
using Math.Users.BLL.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Math.Users.Api.Controllers
{
    public class UserController : BaseController<UserController>
    {
        private readonly IUserService _userService;

        public UserController(IMapper mapper, ILogger<UserController> logger,
            IUserService userService) : base(mapper, logger)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost(nameof(Create))]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(TokenModel))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] UserForCreateModel user)
        {
            try
            {
                return Ok(_mapper.Map<TokenModel>(await _userService.Create(_mapper.Map<UserDto>(user))));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost(nameof(Login))]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(TokenModel))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] CredentialsModel crt)
        {
            try
            {
                return Ok(_mapper.Map<TokenModel>(await _userService.Login(_mapper.Map<CredentialsDto>(crt))));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet(nameof(Get))]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<UserModel>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Get(int skip, int take)
        {
            try
            {
                return Ok(await _userService.GetAll(skip, take));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet(nameof(GetById))]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserModel))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _userService.GetByIdAsync(id);
                if (user == null)
                    return NotFound();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut(nameof(Update))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(UserModel user)
        {
            try
            {
                await _userService.Update(_mapper.Map<UserDto>(user));

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}