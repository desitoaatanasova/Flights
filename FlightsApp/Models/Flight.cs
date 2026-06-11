namespace FlightsApp.Models;

public class Flight
{
    public int FlightId { get; set; }
    public string FlightNumber { get; set; } = null!;
    public string DepartureLocation { get; set; } = null!;
    public string ArrivalLocation { get; set; } = null!;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public int Occupancy { get; set; }
    public string Status { get; set; } = "scheduled";
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }

    public int AirlineId { get; set; }
    public Airline Airline { get; set; } = null!;

    public int PilotId { get; set; }
    public Pilot Pilot { get; set; } = null!;

    public int AircraftId { get; set; }
    public Aircraft Aircraft { get; set; } = null!;

    public int CrewId { get; set; }
    public Crew Crew { get; set; } = null!;
}
