namespace Math.Users.Api.Models
{
    public class UserForCreateModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Patronymic { get; set; } = string.Empty;
        public string Password { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string RezervPhone { get; set; } = string.Empty;
    }
}
