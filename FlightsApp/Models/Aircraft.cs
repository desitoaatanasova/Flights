namespace FlightsApp.Models;

public class Aircraft
{
    public int AircraftId { get; set; }
    public string Type { get; set; } = null!;
    public string Model { get; set; } = null!;
    public int Capacity { get; set; }
    public int ManufactureYear { get; set; }
    public string Ownership { get; set; } = null!;
    public string? Registration { get; set; }
    public string? EngineType { get; set; }
    public int? RangeKm { get; set; }
    public string? ImageUrl { get; set; }

    public ICollection<Flight> Flights { get; set; } = new List<Flight>();
}
