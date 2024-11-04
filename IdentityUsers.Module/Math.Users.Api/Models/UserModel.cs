#nullable disable

namespace Math.Users.Api.Models
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string Patronymic { get; set; } = string.Empty;
        public string Password { get; set; }
        public string Phone { get; set; }
        public string RezervPhone { get; set; }
    }
}