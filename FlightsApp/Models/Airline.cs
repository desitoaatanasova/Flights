namespace FlightsApp.Models;

public class Airline
{
    public int AirlineId { get; set; }
    public string AirlineName { get; set; } = null!;
    public string IataCode { get; set; } = null!;
    public string? LogoUrl { get; set; }
    public string Country { get; set; } = null!;
    public int FleetSize { get; set; }
    public string HubAirport { get; set; } = null!;
    public int FoundedYear { get; set; }
    public string? Description { get; set; }

    public ICollection<Flight> Flights { get; set; } = new List<Flight>();
}
