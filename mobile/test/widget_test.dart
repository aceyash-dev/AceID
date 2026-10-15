import 'package:ace_id_mobile/core/ace_theme.dart';
import 'package:ace_id_mobile/core/auth_service.dart';
import 'package:ace_id_mobile/core/api_service.dart';
import 'package:ace_id_mobile/screens.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('account activity parser matches the server response contract', () {
    final records = <dynamic>[
      {'name': 'Password changed'},
    ];
    expect(AceIdApi.activityLogs({'log': records}), same(records));
  });

  test(
    'account activity parser accepts legacy plural key and malformed payloads',
    () {
      final records = <dynamic>[
        {'name': 'Signed in'},
      ];
      expect(AceIdApi.activityLogs({'logs': records}), same(records));
      expect(
        AceIdApi.activityLogs({'log': null, 'logs': 'unexpected'}),
        isEmpty,
      );
    },
  );

  testWidgets('Ace ID sign-in surface renders the current account copy', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AceTheme.light,
        home: SignInScreen(onSignIn: () async {}),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('ace id.'), findsOneWidget);
    expect(find.text('Your identity,\nyour way.'), findsOneWidget);
    expect(
      find.text(
        'One account for the services you use. Sign in to manage your profile, security, and membership.',
      ),
      findsOneWidget,
    );
    expect(find.text('Continue with Ace ID'), findsOneWidget);
    expect(find.text('Continue on the web'), findsOneWidget);
    expect(find.text('Membership and subscriptions'), findsOneWidget);
  });

  testWidgets('native sign-in configuration failures remain recoverable', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AceTheme.light,
        home: SignInScreen(
          onSignIn: () => throw const AuthConfigurationException(
            'Native sign-in needs the Ace ID mobile client ID.',
          ),
        ),
      ),
    );

    await tester.tap(find.text('Continue with Ace ID'));
    await tester.pumpAndSettle();

    expect(
      find.text('Native sign-in needs the Ace ID mobile client ID.'),
      findsOneWidget,
    );
    expect(find.text('Continue with Ace ID'), findsOneWidget);
  });
}
