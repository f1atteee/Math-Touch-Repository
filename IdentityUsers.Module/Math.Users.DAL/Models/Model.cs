using System.ComponentModel.DataAnnotations;

namespace Math.Users.DAL.Models
{
    public abstract class Model
    {
        [Key]
        public Guid Id { get; set; }
    }
}