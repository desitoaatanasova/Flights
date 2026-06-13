# AeroTrack — Agent Instructions

## Startup (run at beginning of every session)

This project uses MySQL + .NET API (port 5185) + React/Vite (port 5173).

Run the startup script to ensure everything is running:

```powershell
powershell -ExecutionPolicy Bypass -File ".\start.ps1"
```

This will:
1. Start MySQL service (MySQL80)
2. Ensure the `Flights_app` database exists and is seeded
3. Start the .NET API on port 5185
4. Start Vite dev server on port 5173
5. Open Chrome to `http://localhost:5173`

## If already running

If ports 5185 (API) and 5173 (web) are already listening, startup is not needed. Check with:

```powershell
powershell -ExecutionPolicy Bypass -File ".\start.ps1" -Status
```

## Stopping

```powershell
powershell -ExecutionPolicy Bypass -File ".\start.ps1" -Stop
```

## Development

- `npm run dev` — start frontend only
- `npm run build` — build frontend
- `npm run lint` — lint frontend
- API project is in `FlightsApp/` — `dotnet run --launch-profile http`
- DB connection: user=`flights`, password=`root`, database=`Flights_app`
