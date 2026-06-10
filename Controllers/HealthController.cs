using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlightsApp.Data;

namespace FlightsApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromServices] AppDbContext db)
    {
        try
        {
            var canConnect = await db.Database.CanConnectAsync();
            if (canConnect)
            {
                return Ok(new
                {
                    status = "connected",
                    message = "Connected to MySQL successfully"
                });
            }

            return StatusCode(500, new
            {
                status = "error",
                message = "Cannot connect to database"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "error",
                message = ex.InnerException?.Message ?? ex.Message
            });
        }
    }
}
