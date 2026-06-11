namespace FlightsApp.Models;

public class Crew
{
    public int CrewId { get; set; }
    public int CrewCount { get; set; }
    public string ChiefAttendant { get; set; } = null!;
    public string? Certification { get; set; }
    public string CrewMembers { get; set; } = null!;
    public string? LanguageSkills { get; set; }

    public ICollection<Flight> Flights { get; set; } = new List<Flight>();
}
