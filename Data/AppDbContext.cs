using Microsoft.EntityFrameworkCore;
using FlightsApp.Models;

namespace FlightsApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Flight> Flights => Set<Flight>();
}
