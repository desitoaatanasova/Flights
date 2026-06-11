import 'package:flutter/material.dart';

class FlightMarkerIcon extends StatelessWidget {
  final String status;
  final String? airlineCode;
  final bool showLabel;

  const FlightMarkerIcon({
    super.key,
    required this.status,
    this.airlineCode,
    this.showLabel = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: statusColor.withValues(alpha: 0.9),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: statusColor.withValues(alpha: 0.4),
            blurRadius: 8,
            spreadRadius: 2,
          ),
        ],
      ),
      width: showLabel ? null : 36,
      height: showLabel ? null : 36,
      padding: showLabel
          ? const EdgeInsets.symmetric(horizontal: 10, vertical: 6)
          : const EdgeInsets.all(0),
      child: showLabel
          ? Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(statusIcon, color: Colors.white, size: 16),
                const SizedBox(width: 4),
                Text(
                  airlineCode ?? '??',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            )
          : Center(
              child: Icon(statusIcon, color: Colors.white, size: 18),
            ),
    );
  }

  Color get statusColor {
    switch (status.toLowerCase()) {
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

  IconData get statusIcon {
    switch (status.toLowerCase()) {
      case 'active':
        return Icons.flight;
      case 'scheduled':
        return Icons.schedule;
      case 'landed':
        return Icons.flight_land;
      case 'delayed':
        return Icons.access_time;
      case 'cancelled':
        return Icons.cancel;
      default:
        return Icons.flight;
    }
  }
}

class FlightDotMarker extends StatelessWidget {
  final String status;

  const FlightDotMarker({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(
        color: _dotColor,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: [
          BoxShadow(
            color: _dotColor.withValues(alpha: 0.5),
            blurRadius: 6,
          ),
        ],
      ),
    );
  }

  Color get _dotColor {
    switch (status.toLowerCase()) {
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
