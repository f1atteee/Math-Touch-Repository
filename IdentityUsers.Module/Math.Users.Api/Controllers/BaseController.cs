using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Authentication;

namespace Math.Users.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseController<T> : Controller
    {
        protected readonly IMapper _mapper;
        protected readonly ILogger<T> _logger;

        public BaseController(IMapper mapper, ILogger<T> logger)
        {
            _mapper = mapper;
            _logger = logger;
        }

        protected int GetUserIdFromClaims()
        {
            var userIdClaim = User.FindFirst("Id");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }

            throw new AuthenticationException();
        }
    }
}