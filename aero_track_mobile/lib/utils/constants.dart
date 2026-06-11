import 'package:flutter/foundation.dart' show kIsWeb, defaultTargetPlatform, TargetPlatform;

class Constants {
  Constants._();

  static String get apiBaseUrl {
    if (kIsWeb) return 'http://localhost:5185/api';
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5185/api';
    }
    return 'http://localhost:5185/api';
  }

  static const String nominatimBaseUrl = 'https://nominatim.openstreetmap.org';

  static const double initialLatitude = 48.0;
  static const double initialLongitude = 10.0;
  static const double initialZoom = 3.0;

  static const double zoomHide = 3.0;
  static const double zoomDot = 5.0;
  static const double zoomIcon = 7.0;
  static const double zoomLabel = 9.0;

  static const Duration markerAnimationDuration = Duration(milliseconds: 300);
}
