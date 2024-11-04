namespace Math.Users.BLL.Dtos
{
    public class UserInfoDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string Patronymic { get; set; } = string.Empty;
    }
}