using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightsApp.Data;
using FlightsApp.Models;

namespace FlightsApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly AppDbContext _db;
    public FlightsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Flight>>> GetAll(
        [FromQuery] int? airlineId,
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        var query = _db.Flights
            .Include(f => f.Airline)
            .Include(f => f.Pilot)
            .Include(f => f.Aircraft)
            .Include(f => f.Crew)
            .AsQueryable();

        if (airlineId.HasValue)
            query = query.Where(f => f.AirlineId == airlineId.Value);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(f => f.Status == status);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(f => f.FlightNumber.Contains(search));

        return await query.OrderBy(f => f.DepartureTime).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Flight>> GetById(int id)
    {
        var flight = await _db.Flights
            .Include(f => f.Airline)
            .Include(f => f.Pilot)
            .Include(f => f.Aircraft)
            .Include(f => f.Crew)
            .FirstOrDefaultAsync(f => f.FlightId == id);

        if (flight is null) return NotFound();
        return flight;
    }

    [HttpPost]
    public async Task<ActionResult<Flight>> Create(Flight flight)
    {
        _db.Flights.Add(flight);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = flight.FlightId }, flight);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Flight flight)
    {
        if (id != flight.FlightId) return BadRequest();

        var existing = await _db.Flights.FindAsync(id);
        if (existing is null) return NotFound();

        _db.Entry(existing).CurrentValues.SetValues(flight);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var flight = await _db.Flights.FindAsync(id);
        if (flight is null) return NotFound();

        _db.Flights.Remove(flight);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
