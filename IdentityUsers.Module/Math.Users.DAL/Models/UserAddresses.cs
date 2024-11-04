using System.ComponentModel.DataAnnotations.Schema;

namespace Math.Users.DAL.Models
{
    public class UserAddresses : Model
    {
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public string Country { get; set; }
        public string Region { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string Street { get; set; }
        public string NumberOfHouse { get; set; }
        public string PostOfficeNumber { get; set; }
    }
}