using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightsApp.Data;
using FlightsApp.Models;

namespace FlightsApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AircraftController : ControllerBase
{
    private readonly AppDbContext _db;
    public AircraftController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Aircraft>>> GetAll()
    {
        return await _db.Aircraft.OrderBy(a => a.Model).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Aircraft>> GetById(int id)
    {
        var aircraft = await _db.Aircraft.FindAsync(id);
        if (aircraft is null) return NotFound();
        return aircraft;
    }

    [HttpPost]
    public async Task<ActionResult<Aircraft>> Create(Aircraft aircraft)
    {
        _db.Aircraft.Add(aircraft);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = aircraft.AircraftId }, aircraft);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Aircraft aircraft)
    {
        if (id != aircraft.AircraftId) return BadRequest();

        var existing = await _db.Aircraft.FindAsync(id);
        if (existing is null) return NotFound();

        _db.Entry(existing).CurrentValues.SetValues(aircraft);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var aircraft = await _db.Aircraft.FindAsync(id);
        if (aircraft is null) return NotFound();

        try
        {
            _db.Aircraft.Remove(aircraft);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict("Cannot delete aircraft with existing flights. Remove flights first.");
        }
    }
}
