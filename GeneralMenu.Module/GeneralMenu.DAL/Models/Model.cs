using System.ComponentModel.DataAnnotations;

namespace GeneralData.DAL.Models
{
    public abstract class Model
    {
        [Key]
        public Guid Id { get; set; }
    }
}