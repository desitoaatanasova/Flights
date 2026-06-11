using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightsApp.Data;
using FlightsApp.Models;

namespace FlightsApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AirlinesController : ControllerBase
{
    private readonly AppDbContext _db;
    public AirlinesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Airline>>> GetAll()
    {
        return await _db.Airlines.OrderBy(a => a.AirlineName).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Airline>> GetById(int id)
    {
        var airline = await _db.Airlines.FindAsync(id);
        if (airline is null) return NotFound();
        return airline;
    }

    [HttpPost]
    public async Task<ActionResult<Airline>> Create(Airline airline)
    {
        _db.Airlines.Add(airline);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = airline.AirlineId }, airline);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Airline airline)
    {
        if (id != airline.AirlineId) return BadRequest();

        var existing = await _db.Airlines.FindAsync(id);
        if (existing is null) return NotFound();

        _db.Entry(existing).CurrentValues.SetValues(airline);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var airline = await _db.Airlines.FindAsync(id);
        if (airline is null) return NotFound();

        try
        {
            _db.Airlines.Remove(airline);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict("Cannot delete airline with existing flights. Remove flights first.");
        }
    }
}
