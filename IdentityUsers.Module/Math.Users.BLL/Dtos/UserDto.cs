#nullable disable

namespace Math.Users.BLL.Dtos
{
    public class UserDto : BaseDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Patronymic { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string RezervPhone { get; set; }
    }
}