import 'package:flutter/material.dart';
import 'screens/radar_screen.dart';

void main() {
  runApp(const AeroTrackApp());
}

class AeroTrackApp extends StatelessWidget {
  const AeroTrackApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AeroTrack Radar',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF3B82F6),
        useMaterial3: true,
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        colorSchemeSeed: const Color(0xFF3B82F6),
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      themeMode: ThemeMode.system,
      home: const RadarScreen(),
    );
  }
}
