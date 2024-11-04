using GeneralData.DAL.Models;
using GeneralData.DAL.Repositories.Interfaces;

namespace GeneralData.DAL.Repositories
{
    internal class ThemsRepository : GenericRepository<Thems>, IThemsRepository
    {
        public ThemsRepository(GeneralContext context) : base(context) { }

    }
}