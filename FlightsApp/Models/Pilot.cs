namespace FlightsApp.Models;

public class Pilot
{
    public int PilotId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public int Age { get; set; }
    public int ExperienceYears { get; set; }
    public string Nationality { get; set; } = null!;
    public string? CoPilot { get; set; }
    public string? LicenseNumber { get; set; }
    public string? AvatarUrl { get; set; }

    public ICollection<Flight> Flights { get; set; } = new List<Flight>();
}
