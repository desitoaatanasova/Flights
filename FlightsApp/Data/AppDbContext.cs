using Microsoft.EntityFrameworkCore;
using FlightsApp.Models;

namespace FlightsApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Flight> Flights => Set<Flight>();
    public DbSet<Airline> Airlines => Set<Airline>();
    public DbSet<Aircraft> Aircraft => Set<Aircraft>();
    public DbSet<Pilot> Pilots => Set<Pilot>();
    public DbSet<Crew> Crew => Set<Crew>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Flight>(entity =>
        {
            entity.ToTable("Flights");
            entity.HasKey(e => e.FlightId);

            entity.Property(e => e.FlightId).HasColumnName("flight_id");
            entity.Property(e => e.FlightNumber).HasColumnName("flight_number").HasMaxLength(20);
            entity.Property(e => e.DepartureLocation).HasColumnName("departure_location").HasMaxLength(100);
            entity.Property(e => e.ArrivalLocation).HasColumnName("arrival_location").HasMaxLength(100);
            entity.Property(e => e.DepartureTime).HasColumnName("departure_time");
            entity.Property(e => e.ArrivalTime).HasColumnName("arrival_time");
            entity.Property(e => e.Occupancy).HasColumnName("occupancy");
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("scheduled");
            entity.Property(e => e.Latitude).HasColumnName("latitude").HasColumnType("decimal(10,7)");
            entity.Property(e => e.Longitude).HasColumnName("longitude").HasColumnType("decimal(10,7)");
            entity.Property(e => e.AirlineId).HasColumnName("airline_id");
            entity.Property(e => e.PilotId).HasColumnName("pilot_id");
            entity.Property(e => e.AircraftId).HasColumnName("aircraft_id");
            entity.Property(e => e.CrewId).HasColumnName("crew_id");

            entity.HasOne(e => e.Airline)
                  .WithMany(a => a.Flights)
                  .HasForeignKey(e => e.AirlineId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Pilot)
                  .WithMany(p => p.Flights)
                  .HasForeignKey(e => e.PilotId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Aircraft)
                  .WithMany(a => a.Flights)
                  .HasForeignKey(e => e.AircraftId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Crew)
                  .WithMany(c => c.Flights)
                  .HasForeignKey(e => e.CrewId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Airline>(entity =>
        {
            entity.ToTable("Airlines");
            entity.HasKey(e => e.AirlineId);

            entity.Property(e => e.AirlineId).HasColumnName("airline_id");
            entity.Property(e => e.AirlineName).HasColumnName("airline_name").HasMaxLength(100);
            entity.Property(e => e.IataCode).HasColumnName("iata_code").HasMaxLength(2);
            entity.Property(e => e.LogoUrl).HasColumnName("logo_url");
            entity.Property(e => e.Country).HasColumnName("country").HasMaxLength(50);
            entity.Property(e => e.FleetSize).HasColumnName("fleet_size");
            entity.Property(e => e.HubAirport).HasColumnName("hub_airport").HasMaxLength(100);
            entity.Property(e => e.FoundedYear).HasColumnName("founded_year");
            entity.Property(e => e.Description).HasColumnName("description");

            entity.HasIndex(e => e.IataCode).IsUnique();
        });

        modelBuilder.Entity<Aircraft>(entity =>
        {
            entity.ToTable("Aircraft");
            entity.HasKey(e => e.AircraftId);

            entity.Property(e => e.AircraftId).HasColumnName("aircraft_id");
            entity.Property(e => e.Type).HasColumnName("type").HasMaxLength(50);
            entity.Property(e => e.Model).HasColumnName("model").HasMaxLength(100);
            entity.Property(e => e.Capacity).HasColumnName("capacity");
            entity.Property(e => e.ManufactureYear).HasColumnName("manufacture_year");
            entity.Property(e => e.Ownership).HasColumnName("ownership").HasMaxLength(20);
            entity.Property(e => e.Registration).HasColumnName("registration").HasMaxLength(20);
            entity.Property(e => e.EngineType).HasColumnName("engine_type").HasMaxLength(50);
            entity.Property(e => e.RangeKm).HasColumnName("range_km");
            entity.Property(e => e.ImageUrl).HasColumnName("image_url");

            entity.HasIndex(e => e.Registration).IsUnique();
        });

        modelBuilder.Entity<Pilot>(entity =>
        {
            entity.ToTable("Pilots");
            entity.HasKey(e => e.PilotId);

            entity.Property(e => e.PilotId).HasColumnName("pilot_id");
            entity.Property(e => e.FirstName).HasColumnName("first_name").HasMaxLength(50);
            entity.Property(e => e.LastName).HasColumnName("last_name").HasMaxLength(50);
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.ExperienceYears).HasColumnName("experience_years");
            entity.Property(e => e.Nationality).HasColumnName("nationality").HasMaxLength(50);
            entity.Property(e => e.CoPilot).HasColumnName("co_pilot").HasMaxLength(100);
            entity.Property(e => e.LicenseNumber).HasColumnName("license_number").HasMaxLength(50);
            entity.Property(e => e.AvatarUrl).HasColumnName("avatar_url");

            entity.HasIndex(e => e.LicenseNumber).IsUnique();
        });

        modelBuilder.Entity<Crew>(entity =>
        {
            entity.ToTable("Crew");
            entity.HasKey(e => e.CrewId);

            entity.Property(e => e.CrewId).HasColumnName("crew_id");
            entity.Property(e => e.CrewCount).HasColumnName("crew_count");
            entity.Property(e => e.ChiefAttendant).HasColumnName("chief_attendant").HasMaxLength(100);
            entity.Property(e => e.Certification).HasColumnName("certification").HasMaxLength(50);
            entity.Property(e => e.CrewMembers).HasColumnName("crew_members");
            entity.Property(e => e.LanguageSkills).HasColumnName("language_skills");
        });
    }
}
