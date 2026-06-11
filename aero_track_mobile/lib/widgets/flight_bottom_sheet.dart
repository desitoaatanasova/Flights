import 'package:flutter/material.dart';
import '../models/flight.dart';

class FlightBottomSheet extends StatelessWidget {
  final Flight flight;

  const FlightBottomSheet({super.key, required this.flight});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return DraggableScrollableSheet(
      initialChildSize: 0.45,
      minChildSize: 0.3,
      maxChildSize: 0.7,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: ListView(
            controller: scrollController,
            padding: const EdgeInsets.all(20),
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: _statusColor.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      flight.status.toUpperCase(),
                      style: TextStyle(
                        color: _statusColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    flight.flightNumber,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: _LocationCard(
                      label: 'DEPARTURE',
                      location: flight.departureLocation,
                      time: flight.departureTime,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Icon(Icons.flight, color: Colors.grey[400], size: 28),
                  ),
                  Expanded(
                    child: _LocationCard(
                      label: 'ARRIVAL',
                      location: flight.arrivalLocation,
                      time: flight.arrivalTime,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Divider(),
              const SizedBox(height: 12),
              if (flight.airline != null) ...[
                _InfoRow(
                  icon: Icons.business,
                  label: 'Airline',
                  value: '${flight.airline!.airlineName} (${flight.airline!.iataCode})',
                ),
                const SizedBox(height: 8),
              ],
              if (flight.pilot != null) ...[
                _InfoRow(
                  icon: Icons.person,
                  label: 'Pilot',
                  value: '${flight.pilot!.firstName} ${flight.pilot!.lastName}',
                ),
                const SizedBox(height: 8),
              ],
              if (flight.aircraft != null) ...[
                _InfoRow(
                  icon: Icons.airplanemode_active,
                  label: 'Aircraft',
                  value: '${flight.aircraft!.type} ${flight.aircraft!.model}',
                ),
                const SizedBox(height: 8),
              ],
              _InfoRow(
                icon: Icons.people,
                label: 'Occupancy',
                value: '${flight.occupancy} passengers',
              ),
              if (flight.hasCoordinates) ...[
                const SizedBox(height: 8),
                _InfoRow(
                  icon: Icons.location_on,
                  label: 'Position',
                  value: '${flight.latitude!.toStringAsFixed(4)}, ${flight.longitude!.toStringAsFixed(4)}',
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  Color get _statusColor {
    switch (flight.status.toLowerCase()) {
      case 'active':
        return const Color(0xFF22C55E);
      case 'scheduled':
        return const Color(0xFF3B82F6);
      case 'landed':
        return const Color(0xFF6B7280);
      case 'delayed':
        return const Color(0xFFF59E0B);
      case 'cancelled':
        return const Color(0xFFEF4444);
      default:
        return const Color(0xFF6366F1);
    }
  }
}

class _LocationCard extends StatelessWidget {
  final String label;
  final String location;
  final DateTime time;

  const _LocationCard({
    required this.label,
    required this.location,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: Colors.grey[500], fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(location, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(height: 4),
          Text(
            '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}',
            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey[500]),
        const SizedBox(width: 8),
        Text('$label: ', style: TextStyle(color: Colors.grey[600], fontSize: 13)),
        Expanded(child: Text(value, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13))),
      ],
    );
  }
}
