using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightsApp.Data;
using FlightsApp.Models;

namespace FlightsApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CrewController : ControllerBase
{
    private readonly AppDbContext _db;
    public CrewController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Crew>>> GetAll()
    {
        return await _db.Crew.OrderBy(c => c.ChiefAttendant).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Crew>> GetById(int id)
    {
        var crew = await _db.Crew.FindAsync(id);
        if (crew is null) return NotFound();
        return crew;
    }

    [HttpPost]
    public async Task<ActionResult<Crew>> Create(Crew crew)
    {
        _db.Crew.Add(crew);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = crew.CrewId }, crew);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Crew crew)
    {
        if (id != crew.CrewId) return BadRequest();

        var existing = await _db.Crew.FindAsync(id);
        if (existing is null) return NotFound();

        _db.Entry(existing).CurrentValues.SetValues(crew);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var crew = await _db.Crew.FindAsync(id);
        if (crew is null) return NotFound();

        try
        {
            _db.Crew.Remove(crew);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateException)
        {
            return Conflict("Cannot delete crew with existing flights. Remove flights first.");
        }
    }
}
