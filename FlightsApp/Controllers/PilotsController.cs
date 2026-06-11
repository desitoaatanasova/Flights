using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightsApp.Data;
using FlightsApp.Models;

namespace FlightsApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PilotsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PilotsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Pilot>>> GetAll()
    {
        return await _db.Pilots.OrderBy(p => p.LastName).ThenBy(p => p.FirstName).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pilot>> GetById(int id)
    {
        var pilot = await _db.Pilots.FindAsync(id);
        if (pilot is null) return NotFound();
        return pilot;
    }

    [HttpPost]
    public async Task<ActionResult<Pilot>> Create(Pilot pilot)
    {
        _db.Pilots.Add(pilot);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = pilot.PilotId }, pilot);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Pilot pilot)
    {
        if (id != pilot.PilotId) return BadRequest();

        var existing = await _db.Pilots.FindAsync(id);
        if (existing is null) return NotFound();

        _db.Entry(existing).CurrentValues.SetValues(pilot);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var pilot = await _db.Pilots.FindAsync(id);
        if (pilot is null) return NotFound();

        try
        {
            _db.Pilots.Remove(pilot);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict("Cannot delete pilot with existing flights. Remove flights first.");
        }
    }
}
