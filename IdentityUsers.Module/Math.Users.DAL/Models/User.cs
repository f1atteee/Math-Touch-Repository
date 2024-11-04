namespace Math.Users.DAL.Models
{
    public class User : Model
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Patronymic { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string? RezervPhone { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}