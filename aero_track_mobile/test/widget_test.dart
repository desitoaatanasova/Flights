import 'package:flutter_test/flutter_test.dart';
import 'package:aero_track_mobile/main.dart';

void main() {
  testWidgets('App loads radar screen', (WidgetTester tester) async {
    await tester.pumpWidget(const AeroTrackApp());
    expect(find.byType(AeroTrackApp), findsOneWidget);
  });
}
