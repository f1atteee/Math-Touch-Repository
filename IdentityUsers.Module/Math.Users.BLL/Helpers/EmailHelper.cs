using System.Text.RegularExpressions;

namespace Math.Users.BLL.Helpers
{
    public class EmailHelper
    {
        public static bool IsValidEmail(string email)
        {
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern);
        }
    }
}