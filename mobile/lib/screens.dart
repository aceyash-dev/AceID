import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:url_launcher/url_launcher.dart';
import 'core/ace_theme.dart';
import 'core/api_service.dart';
import 'core/auth_service.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key, required this.onSignIn});
  final Future<void> Function() onSignIn;
  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  bool busy = false;
  String? error;

  Future<void> continueSignIn() async {
    setState(() { busy = true; error = null; });
    try {
      await widget.onSignIn();
    } on AuthConfigurationException catch (e) {
      if (mounted) setState(() => error = e.message);
    } catch (_) {
      if (mounted) setState(() => error = 'Sign-in did not finish. Check your connection and try again.');
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  Future<void> openWeb() async {
    await launchUrl(Uri.parse('https://identity.ace-base.cc/login'), mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(builder: (context, constraints) => SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight - 52),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const _Brand(showStatus: true),
              const SizedBox(height: 64),
              Text('Your identity,\nyour way.', style: theme.textTheme.displayLarge),
              const SizedBox(height: 18),
              Text('One account for the services you use. Sign in to manage your profile, security, and membership.',
                style: theme.textTheme.bodyLarge?.copyWith(color: colors.onSurfaceVariant, height: 1.6)),
              const SizedBox(height: 32),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(color: theme.cardTheme.color, border: Border.all(color: theme.dividerTheme.color ?? AceTheme.line)),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('YOUR ACCOUNT', style: theme.textTheme.labelSmall?.copyWith(letterSpacing: 1.5, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 18),
                  const _Feature(icon: HugeIcon(icon: HugeIcons.strokeRoundedUser, size: 20), label: 'Profile and account details'),
                  const SizedBox(height: 16),
                  const _Feature(icon: HugeIcon(icon: HugeIcons.strokeRoundedShieldCheck, size: 20), label: 'Security and signed-in devices'),
                  const SizedBox(height: 16),
                  const _Feature(icon: HugeIcon(icon: HugeIcons.strokeRoundedAward01, size: 20), label: 'Membership and subscriptions'),
                ]),
              ),
              const SizedBox(height: 22),
              FilledButton(
                onPressed: busy ? null : continueSignIn,
                child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  if (busy) const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                  else const HugeIcon(icon: HugeIcons.strokeRoundedArrowExpandDiagonal01, size: 18),
                  const SizedBox(width: 10),
                  Text(busy ? 'Connecting securely' : 'Continue with Ace ID'),
                ]),
              ),
              if (error != null) ...[
                const SizedBox(height: 14),
                Container(width: double.infinity, padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(border: Border.all(color: AceTheme.danger.withValues(alpha: .4))),
                  child: Text(error!, style: theme.textTheme.bodySmall?.copyWith(color: AceTheme.danger))),
              ],
              const SizedBox(height: 12),
              OutlinedButton.icon(onPressed: busy ? null : openWeb, icon: const HugeIcon(icon: HugeIcons.strokeRoundedBrowser, size: 18), label: const Text('Continue on the web')),
              const SizedBox(height: 36),
              Divider(color: theme.dividerTheme.color),
              const SizedBox(height: 12),
              Text('ACE ID  ·  YOUR ACCOUNT, IN ONE PLACE',
                style: theme.textTheme.labelSmall?.copyWith(color: colors.onSurfaceVariant, letterSpacing: .8, fontWeight: FontWeight.w700)),
            ]),
          ),
        )),
      ),
    );
  }
}

class _Feature extends StatelessWidget {
  const _Feature({required this.icon, required this.label});
  final Widget icon;
  final String label;
  @override
  Widget build(BuildContext context) => Row(children: [
    icon,
    const SizedBox(width: 12),
    Expanded(child: Text(label, style: Theme.of(context).textTheme.bodyMedium)),
  ]);
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.profile, required this.auth, required this.onSignOut});
  final IdentityProfile profile;
  final OidcAuthService auth;
  final Future<void> Function() onSignOut;
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final AceIdApi api = AceIdApi(widget.auth);
  int tab = 0;
  Future<void> openWeb(String path) async {
    await launchUrl(Uri.parse('https://identity.ace-base.cc$path'), mode: LaunchMode.externalApplication);
  }

  Future<void> openSubscriptions() async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.zero)),
      builder: (context) => SubscriptionSheet(api: api),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      OverviewScreen(profile: widget.profile, api: api, onSubscriptions: openSubscriptions, onAccount: () => setState(() => tab = 3), onSecurity: () => setState(() => tab = 1), onConnected: () => setState(() => tab = 2)),
      SecurityScreen(api: api, onOpenWeb: () => openWeb('/account/security')),
      ConnectedAppsScreen(api: api),
      AccountScreen(api: api, profile: widget.profile, onOpenWeb: openWeb, onSubscriptions: openSubscriptions, onSignOut: widget.onSignOut),
    ];
    return Scaffold(
      appBar: AppBar(title: const _Brand(), actions: [
        IconButton(tooltip: 'Sign out', onPressed: widget.onSignOut, icon: const HugeIcon(icon: HugeIcons.strokeRoundedLogout01)),
        const SizedBox(width: 8),
      ]),
      body: SafeArea(
        child: Stack(children: [
          for (var i = 0; i < pages.length; i++)
            Positioned.fill(
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 190),
                curve: Curves.easeOutCubic,
                opacity: tab == i ? 1 : 0,
                child: IgnorePointer(
                  ignoring: tab != i,
                  child: ExcludeSemantics(
                    excluding: tab != i,
                    child: TickerMode(enabled: tab == i, child: pages[i]),
                  ),
                ),
              ),
            ),
        ]),
      ),
      bottomNavigationBar: _FloatingNavigationBar(
        index: tab,
        onSelect: (value) => setState(() => tab = value),
      ),
    );
  }
}

class _FloatingNavigationBar extends StatelessWidget {
  const _FloatingNavigationBar({required this.index, required this.onSelect});
  final int index;
  final ValueChanged<int> onSelect;

  static const _items = <(String, List<List>)>[
    ('Home', HugeIcons.strokeRoundedHome01),
    ('Security', HugeIcons.strokeRoundedShieldCheck),
    ('Connected', HugeIcons.strokeRoundedLink01),
    ('Account', HugeIcons.strokeRoundedUser),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    return SafeArea(
      minimum: const EdgeInsets.fromLTRB(16, 0, 16, 10),
      child: Container(
        height: 68,
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: theme.cardTheme.color ?? colors.surface,
          border: Border.all(color: theme.dividerTheme.color ?? AceTheme.line),
          boxShadow: [BoxShadow(color: colors.onSurface.withValues(alpha: .08), blurRadius: 22, offset: const Offset(0, 7))],
        ),
        child: Row(children: [
          for (var i = 0; i < _items.length; i++)
            Expanded(
              child: _FloatingNavigationItem(
                label: _items[i].$1,
                icon: _items[i].$2,
                selected: index == i,
                onTap: () => onSelect(i),
              ),
            ),
        ]),
      ),
    );
  }
}

class _FloatingNavigationItem extends StatelessWidget {
  const _FloatingNavigationItem({required this.label, required this.icon, required this.selected, required this.onTap});
  final String label;
  final List<List> icon;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Semantics(
      button: true,
      selected: selected,
      label: label,
      child: InkWell(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 220),
          curve: Curves.easeOutCubic,
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
          decoration: BoxDecoration(
            color: selected ? colors.onSurface : Colors.transparent,
            border: Border.all(color: selected ? colors.onSurface : Colors.transparent),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              HugeIcon(icon: icon, size: 21, color: selected ? colors.surface : colors.onSurfaceVariant),
              if (selected) ...[
                const SizedBox(width: 6),
                Flexible(child: AnimatedSize(duration: const Duration(milliseconds: 180), curve: Curves.easeOutCubic, child: Text(label, maxLines: 1, overflow: TextOverflow.clip, style: Theme.of(context).textTheme.labelSmall?.copyWith(color: colors.surface, fontWeight: FontWeight.w800)))),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand({this.showStatus = false});
  final bool showStatus;
  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [
    ClipRRect(
      borderRadius: BorderRadius.zero,
      child: Image.asset('assets/ace_id_logo.png', width: 30, height: 30, fit: BoxFit.cover),
    ),
    const SizedBox(width: 9),
    Text('ace id.', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontFamily: 'InstrumentSerif', fontSize: 28, fontWeight: FontWeight.w400, letterSpacing: -.5)),
    if (showStatus) ...[
      const Spacer(),
      Container(width: 6, height: 6, decoration: BoxDecoration(color: Theme.of(context).colorScheme.onSurface)),
      const SizedBox(width: 7),
      Text('SECURE ACCOUNT', style: Theme.of(context).textTheme.labelSmall?.copyWith(letterSpacing: .8, fontWeight: FontWeight.w800)),
    ],
  ]);
}

class OverviewScreen extends StatefulWidget {
  const OverviewScreen({super.key, required this.profile, required this.api, required this.onSubscriptions, required this.onAccount, required this.onSecurity, required this.onConnected});
  final IdentityProfile profile;
  final AceIdApi api;
  final VoidCallback onSubscriptions;
  final VoidCallback onAccount;
  final VoidCallback onSecurity;
  final VoidCallback onConnected;
  @override
  State<OverviewScreen> createState() => _OverviewScreenState();
}

class _OverviewScreenState extends State<OverviewScreen> {
  Map<String, dynamic>? account;
  Map<String, dynamic>? subscription;
  String? error;
  bool loading = true;

  @override
  void initState() { super.initState(); refresh(); }

  Future<void> refresh() async {
    setState(() { loading = true; error = null; });
    try {
      final values = await Future.wait([widget.api.account(), widget.api.subscription()]);
      if (!mounted) return;
      setState(() { account = values[0]; subscription = values[1]; loading = false; });
    } catch (e) {
      if (mounted) setState(() { error = e.toString(); loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    final name = (account?['display_name'] ?? widget.profile.name).toString().trim();
    final safeName = name.isEmpty ? 'Ace ID member' : name;
    final plan = (subscription?['name'] ?? 'Base').toString();
    return RefreshIndicator(
      onRefresh: refresh,
      child: ListView(padding: const EdgeInsets.fromLTRB(20, 22, 20, 28), children: [
        Text('YOUR ACCOUNT', style: theme.textTheme.labelSmall?.copyWith(letterSpacing: 1.6, fontWeight: FontWeight.w800)),
        const SizedBox(height: 12),
        Text('Good to have you here.', style: theme.textTheme.displayMedium),
        const SizedBox(height: 10),
        Text('Your identity and membership, all in one place.', style: theme.textTheme.bodyLarge?.copyWith(color: colors.onSurfaceVariant, height: 1.5)),
        if (error != null) ...[
          const SizedBox(height: 14),
          _ErrorPanel(message: error!, onRetry: refresh),
        ],
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(color: theme.cardTheme.color, border: Border.all(color: theme.dividerTheme.color ?? AceTheme.line)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Container(width: 52, height: 52, alignment: Alignment.center, decoration: BoxDecoration(color: colors.onSurface, border: Border.all(color: colors.onSurface)), child: Text(safeName[0].toUpperCase(), style: theme.textTheme.headlineMedium?.copyWith(color: colors.surface))),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(safeName, style: theme.textTheme.titleLarge),
                Text((account?['email'] ?? widget.profile.email).toString(), style: theme.textTheme.bodySmall?.copyWith(color: colors.onSurfaceVariant)),
                if (account?['email_verified'] == false) Text('Email not verified', style: theme.textTheme.labelSmall?.copyWith(color: Theme.of(context).colorScheme.onSurface)),
              ])),
              HugeIcon(icon: HugeIcons.strokeRoundedShieldCheck, color: Theme.of(context).colorScheme.onSurface, size: 22),
            ]),
            const SizedBox(height: 18),
            Divider(color: theme.dividerTheme.color),
            const SizedBox(height: 14),
            _InfoRow(label: 'USERNAME', value: '@${account?['username'] ?? 'loading'}'),
            const SizedBox(height: 12),
            _InfoRow(label: 'MEMBERSHIP', value: loading ? 'Loading…' : plan),
            const SizedBox(height: 18),
            FilledButton.icon(onPressed: widget.onAccount, icon: const HugeIcon(icon: HugeIcons.strokeRoundedUser), label: const Text('Manage account')),
          ]),
        ),
        const SizedBox(height: 18),
        _ActionTile(icon: HugeIcons.strokeRoundedAward01, title: 'Membership & subscriptions', subtitle: 'Plans, benefits, and billing', onTap: widget.onSubscriptions, trailing: Text(plan, style: theme.textTheme.labelLarge?.copyWith(color: Theme.of(context).colorScheme.onSurface))),
        _ActionTile(icon: HugeIcons.strokeRoundedShieldCheck, title: 'Security & devices', subtitle: 'Review sessions and account protection', onTap: widget.onSecurity),
        _ActionTile(icon: HugeIcons.strokeRoundedLink01, title: 'Connected apps', subtitle: 'Review and revoke app access', onTap: widget.onConnected),
        const SizedBox(height: 12),
        Text('Pull down to refresh your account details.', style: theme.textTheme.bodySmall?.copyWith(color: colors.onSurfaceVariant)),
      ]),
    );
  }
}

class SecurityScreen extends StatefulWidget {
  const SecurityScreen({super.key, required this.api, required this.onOpenWeb});
  final AceIdApi api;
  final VoidCallback onOpenWeb;
  @override
  State<SecurityScreen> createState() => _SecurityScreenState();
}

class _SecurityScreenState extends State<SecurityScreen> {
  Map<String, dynamic>? data;
  List<dynamic> logs = [];
  String? error;
  bool loading = true;
  @override
  void initState() { super.initState(); refresh(); }
  Future<void> refresh() async {
    setState(() { loading = true; error = null; });
    try {
      final results = await Future.wait([widget.api.devices(), widget.api.logs()]);
      if (!mounted) return;
      setState(() { data = results[0]; logs = AceIdApi.activityLogs(results[1]); loading = false; });
    } catch (e) {
      if (mounted) setState(() { error = e.toString(); loading = false; });
    }
  }
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final devices = (data?['devices'] as List?) ?? [];
    return RefreshIndicator(onRefresh: refresh, child: ListView(padding: const EdgeInsets.fromLTRB(20, 24, 20, 28), children: [
      Text('Security', style: theme.textTheme.displayMedium),
      const SizedBox(height: 8),
      Text('Your recent sessions and account activity.', style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
      if (error != null) ...[const SizedBox(height: 14), _ErrorPanel(message: error!, onRetry: refresh)],
      const SizedBox(height: 24),
      _SectionHeading(title: 'Signed-in devices', count: devices.length),
      if (loading && data == null) const Padding(padding: EdgeInsets.all(24), child: Center(child: CircularProgressIndicator(strokeWidth: 2))),
      if (!loading && devices.isEmpty && error == null) const _EmptyPanel(message: 'No session details were returned.'),
      for (final item in devices) _DataTile(
        icon: HugeIcons.strokeRoundedComputerUser,
        title: (item['device_name'] ?? item['browser'] ?? item['device_type'] ?? 'Signed-in device').toString(),
        subtitle: '${item['os'] ?? 'Device'} · ${item['location'] ?? 'Location unavailable'}',
        trailing: (item['last_seen_at'] ?? item['created_at'] ?? '').toString(),
      ),
      const SizedBox(height: 24),
      _SectionHeading(title: 'Recent activity', count: logs.length),
      if (logs.isEmpty && !loading && error == null) const _EmptyPanel(message: 'No recent activity was returned.'),
      for (final item in logs.take(12)) _DataTile(
        icon: HugeIcons.strokeRoundedHistory,
        title: (item['name'] ?? item['event_type'] ?? 'Account activity').toString(),
        subtitle: '${item['category'] ?? 'account'} · ${item['browser'] ?? 'Ace ID'}',
        trailing: (item['created_at'] ?? '').toString(),
      ),
      const SizedBox(height: 20),
      OutlinedButton.icon(onPressed: widget.onOpenWeb, icon: const HugeIcon(icon: HugeIcons.strokeRoundedBrowser), label: const Text('More security settings')),
    ]));
  }
}

class ConnectedAppsScreen extends StatefulWidget {
  const ConnectedAppsScreen({super.key, required this.api});
  final AceIdApi api;
  @override
  State<ConnectedAppsScreen> createState() => _ConnectedAppsScreenState();
}

class _ConnectedAppsScreenState extends State<ConnectedAppsScreen> {
  List<dynamic> apps = [];
  String? error;
  bool loading = true;
  @override
  void initState() { super.initState(); refresh(); }
  Future<void> refresh() async {
    setState(() { loading = true; error = null; });
    try {
      final result = await widget.api.connectedApps();
      if (mounted) setState(() { apps = (result['connectedApps'] as List?) ?? []; loading = false; });
    } catch (e) {
      if (mounted) setState(() { error = e.toString(); loading = false; });
    }
  }
  Future<void> revoke(Map item) async {
    final accepted = await showDialog<bool>(context: context, builder: (context) => AlertDialog(
      title: const Text('Disconnect this app?'),
      content: Text('${item['clientName'] ?? 'This app'} will no longer be able to use this authorization.'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Keep connected')),
        FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Disconnect')),
      ],
    ));
    if (accepted != true) return;
    try {
      await widget.api.revokeApp(item['grantId'].toString());
      if (mounted) { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('App disconnected.'))); await refresh(); }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return RefreshIndicator(onRefresh: refresh, child: ListView(padding: const EdgeInsets.fromLTRB(20, 24, 20, 28), children: [
      Text('Connected apps', style: theme.textTheme.displayMedium),
      const SizedBox(height: 8),
      Text('Control which services can access your Ace ID.', style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
      if (error != null) ...[const SizedBox(height: 14), _ErrorPanel(message: error!, onRetry: refresh)],
      const SizedBox(height: 22),
      if (loading && apps.isEmpty) const Padding(padding: EdgeInsets.all(24), child: Center(child: CircularProgressIndicator(strokeWidth: 2))),
      if (!loading && apps.isEmpty && error == null) const _EmptyPanel(message: 'No connected apps yet. When a service uses Ace ID, it will appear here.'),
      for (final raw in apps) ...[
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: theme.cardTheme.color, border: Border.all(color: theme.dividerTheme.color ?? AceTheme.line)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Container(width: 42, height: 42, decoration: BoxDecoration(color: theme.scaffoldBackgroundColor, border: Border.all(color: theme.dividerTheme.color ?? AceTheme.line)),
                child: HugeIcon(icon: HugeIcons.strokeRoundedGridView, color: Theme.of(context).colorScheme.onSurface, size: 22)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text((raw['clientName'] ?? 'Connected app').toString(), style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                Text((raw['clientUri'] ?? raw['clientId'] ?? '').toString(), maxLines: 1, overflow: TextOverflow.ellipsis, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
              ])),
            ]),
            const SizedBox(height: 12),
            Text('Access: ${((raw['scopes'] as List?) ?? []).join(', ')}', style: theme.textTheme.bodySmall),
            const SizedBox(height: 12),
            Align(alignment: Alignment.centerRight, child: TextButton.icon(onPressed: () => revoke(Map<String, dynamic>.from(raw as Map)), icon: const HugeIcon(icon: HugeIcons.strokeRoundedLinkOff, size: 18), label: const Text('Disconnect'))),
          ]),
        ),
        const SizedBox(height: 10),
      ],
    ]));
  }
}

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key, required this.api, required this.profile, required this.onOpenWeb, required this.onSubscriptions, required this.onSignOut});
  final AceIdApi api;
  final IdentityProfile profile;
  final Future<void> Function(String path) onOpenWeb;
  final VoidCallback onSubscriptions;
  final Future<void> Function() onSignOut;
  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  Map<String, dynamic>? account;
  bool loading = true;
  String? error;
  @override
  void initState() { super.initState(); refresh(); }
  Future<void> refresh() async {
    setState(() { loading = true; error = null; });
    try {
      final result = await widget.api.account();
      if (mounted) setState(() { account = result; loading = false; });
    } catch (e) {
      if (mounted) setState(() { error = e.toString(); loading = false; });
    }
  }
  Future<void> editProfile() async {
    final current = account ?? {};
    final name = TextEditingController(text: (current['display_name'] ?? widget.profile.name).toString());
    final username = TextEditingController(text: (current['username'] ?? '').toString());
    final email = TextEditingController(text: (current['email'] ?? widget.profile.email).toString());
    final avatar = TextEditingController(text: (current['avatar_url'] ?? '').toString());
    final saved = await showModalBottomSheet<bool>(
      context: context, isScrollControlled: true, useSafeArea: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      builder: (context) => Padding(
        padding: EdgeInsets.fromLTRB(20, 14, 20, MediaQuery.of(context).viewInsets.bottom + 20),
        child: SingleChildScrollView(child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Center(child: Container(width: 42, height: 4, color: Theme.of(context).dividerTheme.color)),
          const SizedBox(height: 22),
          Text('Edit your profile', style: Theme.of(context).textTheme.headlineLarge),
          const SizedBox(height: 20),
          _FormField(label: 'DISPLAY NAME', controller: name),
          const SizedBox(height: 14),
          _FormField(label: 'USERNAME', controller: username, prefix: '@'),
          const SizedBox(height: 14),
          _FormField(label: 'EMAIL', controller: email, keyboardType: TextInputType.emailAddress),
          const SizedBox(height: 14),
          _FormField(label: 'AVATAR URL', controller: avatar, keyboardType: TextInputType.url),
          const SizedBox(height: 20),
          FilledButton(onPressed: () async {
            try {
              await widget.api.updateAccount({'displayName': name.text.trim(), 'username': username.text.trim(), 'email': email.text.trim(), 'avatarUrl': avatar.text.trim()});
              if (context.mounted) Navigator.pop(context, true);
            } catch (e) {
              if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
            }
          }, child: const Text('Save changes')),
        ])),
      ),
    );
    name.dispose(); username.dispose(); email.dispose(); avatar.dispose();
    if (saved == true && mounted) await refresh();
  }
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final displayName = (account?['display_name'] ?? widget.profile.name).toString();
    final email = (account?['email'] ?? widget.profile.email).toString();
    return RefreshIndicator(onRefresh: refresh, child: ListView(padding: const EdgeInsets.fromLTRB(20, 24, 20, 28), children: [
      Text('Account', style: theme.textTheme.displayMedium),
      const SizedBox(height: 8),
      Text('Personal details, preferences, and membership.', style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
      if (error != null) ...[const SizedBox(height: 14), _ErrorPanel(message: error!, onRetry: refresh)],
      const SizedBox(height: 22),
      Container(padding: const EdgeInsets.all(18), decoration: BoxDecoration(color: theme.cardTheme.color, border: Border.all(color: theme.dividerTheme.color ?? AceTheme.line)), child: Column(children: [
        Row(children: [
          Container(width: 60, height: 60, alignment: Alignment.center, decoration: BoxDecoration(color: theme.colorScheme.onSurface, border: Border.all(color: theme.colorScheme.onSurface)), child: Text(displayName.isEmpty ? 'A' : displayName[0].toUpperCase(), style: theme.textTheme.headlineLarge?.copyWith(color: theme.colorScheme.surface))),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(displayName, style: theme.textTheme.titleLarge),
            Text(email, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
            Text('@${account?['username'] ?? '…'}', style: theme.textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurface)),
          ])),
        ]),
        const SizedBox(height: 18),
        OutlinedButton.icon(onPressed: loading ? null : editProfile, icon: const HugeIcon(icon: HugeIcons.strokeRoundedFileEdit), label: const Text('Edit profile')),
      ])),
      const SizedBox(height: 18),
      _ActionTile(icon: HugeIcons.strokeRoundedAward01, title: 'Membership & subscriptions', subtitle: 'Manage your plan and billing', onTap: widget.onSubscriptions),
      _ActionTile(icon: HugeIcons.strokeRoundedLock, title: 'Password & sign-in', subtitle: 'Change password and recovery options', onTap: () => widget.onOpenWeb('/account/security')),
      _ActionTile(icon: HugeIcons.strokeRoundedLockComputer, title: 'Sessions & trusted devices', subtitle: 'Review and sign out devices', onTap: () => widget.onOpenWeb('/account/devices')),
      _ActionTile(icon: HugeIcons.strokeRoundedShieldCheck, title: 'Passkeys & two-factor authentication', subtitle: 'Manage stronger sign-in methods', onTap: () => widget.onOpenWeb('/account/security')),
      _ActionTile(icon: HugeIcons.strokeRoundedDelete01, title: 'Account deletion', subtitle: 'Permanently remove your Ace ID', onTap: () => widget.onOpenWeb('/account/danger'), danger: true),
      const SizedBox(height: 20),
      OutlinedButton.icon(onPressed: widget.onSignOut, icon: const HugeIcon(icon: HugeIcons.strokeRoundedLogout01), label: const Text('Sign out')),
      const SizedBox(height: 12),
      Text('Sensitive security changes open in the secure Ace ID account site and may require you to sign in again.', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant, height: 1.5)),
    ]));
  }
}

class SubscriptionSheet extends StatefulWidget {
  const SubscriptionSheet({super.key, required this.api});
  final AceIdApi api;
  @override
  State<SubscriptionSheet> createState() => _SubscriptionSheetState();
}

class _SubscriptionSheetState extends State<SubscriptionSheet> {
  List<dynamic> plans = [];
  Map<String, dynamic>? current;
  bool paymentsConfigured = false;
  bool loading = true;
  String? error;
  String? busyPlan;
  @override
  void initState() { super.initState(); refresh(); }
  Future<void> refresh() async {
    setState(() { loading = true; error = null; });
    try {
      final results = await Future.wait([widget.api.plans(), widget.api.subscription()]);
      if (!mounted) return;
      setState(() {
        plans = (results[0]['plans'] as List?) ?? [];
        paymentsConfigured = results[0]['payments']?['razorpayConfigured'] == true;
        current = results[1];
        loading = false;
      });
    } catch (e) {
      if (mounted) setState(() { error = e.toString(); loading = false; });
    }
  }
  Future<void> choosePlan(String planId) async {
    if (planId == 'base') {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Base is the free plan.')));
      return;
    }
    if ((current?['plan'] ?? 'base').toString() != 'base') {
      setState(() {
        error = 'You already have a paid plan. Manage an existing subscription on the Ace ID billing site.';
      });
      return;
    }
    setState(() { busyPlan = planId; error = null; });
    try {
      final result = await widget.api.checkout(planId);
      final raw = result['shortUrl']?.toString() ?? '';
      if (raw.isEmpty) throw const ApiException('Checkout link was not returned.');
      final launched = await launchUrl(Uri.parse(raw), mode: LaunchMode.externalApplication);
      if (!launched) throw const ApiException('Could not open the secure payment page.');
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Complete payment in your browser. Your plan updates after payment confirmation.')));
    } catch (e) {
      if (mounted) setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => busyPlan = null);
    }
  }
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final activePlan = (current?['plan'] ?? 'base').toString();
    final subscription = current?['subscription'] as Map?;
    final bottom = MediaQuery.of(context).viewInsets.bottom;
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 12, 20, bottom + 20),
      child: SizedBox(
        height: MediaQuery.of(context).size.height * .84,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Center(child: Container(width: 42, height: 4, color: theme.dividerTheme.color)),
          const SizedBox(height: 20),
          Row(children: [
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Membership', style: theme.textTheme.headlineLarge),
              const SizedBox(height: 4),
              Text('Plans and benefits for your Ace ID.', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
            ])),
            IconButton(onPressed: loading ? null : refresh, icon: const HugeIcon(icon: HugeIcons.strokeRoundedRefresh), tooltip: 'Refresh membership'),
          ]),
          const SizedBox(height: 16),
          if (loading) const Expanded(child: Center(child: CircularProgressIndicator(strokeWidth: 2)))
          else Expanded(child: ListView(children: [
            if (error != null) _ErrorPanel(message: error!, onRetry: refresh),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: theme.cardTheme.color, border: Border.all(color: theme.dividerTheme.color ?? AceTheme.line)),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('CURRENT PLAN', style: theme.textTheme.labelSmall?.copyWith(letterSpacing: 1.3, fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                Row(children: [
                  Expanded(child: Text((current?['name'] ?? 'Base').toString(), style: theme.textTheme.headlineMedium)),
                  _StatusPill(text: (current?['status'] ?? 'active').toString()),
                ]),
                const SizedBox(height: 12),
                _InfoRow(label: 'APPLICATIONS', value: '${current?['usage']?['applications'] ?? 0} / ${current?['applications'] ?? 8}'),
                const SizedBox(height: 8),
                _InfoRow(label: 'MONTHLY ACTIVE USERS', value: '${current?['mau'] ?? 5000}'),
                if (subscription?['billingPeriodEnd'] != null) ...[
                  const SizedBox(height: 8),
                  _InfoRow(label: 'BILLING PERIOD ENDS', value: _date(subscription?['billingPeriodEnd'])),
                ],
              ]),
            ),
            const SizedBox(height: 18),
            Text('AVAILABLE PLANS', style: theme.textTheme.labelSmall?.copyWith(letterSpacing: 1.3, fontWeight: FontWeight.w800)),
            const SizedBox(height: 10),
            for (final raw in plans) ...[
              _PlanCard(
                plan: Map<String, dynamic>.from(raw as Map),
                active: (raw['id'] ?? '').toString() == activePlan,
                enabled: (raw['id'] ?? '').toString() == 'base' ||
                    (paymentsConfigured && activePlan == 'base'),
                hasPaidPlan: activePlan != 'base',
                busy: busyPlan == (raw['id'] ?? '').toString(),
                onChoose: () => choosePlan((raw['id'] ?? '').toString()),
              ),
              const SizedBox(height: 10),
            ],
            if (!paymentsConfigured) const _EmptyPanel(message: 'Paid checkout is not configured right now. Your current plan and benefits are still available.'),
            const SizedBox(height: 12),
            Text('Paid plans open a secure Razorpay checkout. Your membership changes only after Ace ID receives payment confirmation.', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant, height: 1.5)),
          ])),
        ]),
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  const _PlanCard({
    required this.plan,
    required this.active,
    required this.enabled,
    required this.hasPaidPlan,
    required this.busy,
    required this.onChoose,
  });

  final Map<String, dynamic> plan;
  final bool active;
  final bool enabled;
  final bool hasPaidPlan;
  final bool busy;
  final VoidCallback onChoose;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final id = (plan['id'] ?? '').toString();
    final price = (plan['priceInrMonthly'] as num?)?.toInt() ?? 0;
    final planName = (plan['name'] ?? id).toString();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        border: Border.all(
          color: active ? Theme.of(context).colorScheme.onSurface : (theme.dividerTheme.color ?? AceTheme.line),
          width: active ? 1.5 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(planName, style: theme.textTheme.headlineMedium)),
              Text(
                price == 0 ? 'Free' : '₹$price / mo',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '${plan['applications'] ?? '—'} applications · ${plan['mau'] ?? '—'} monthly active users',
            style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
          ),
          const SizedBox(height: 12),
          if (active)
            const _StatusPill(text: 'CURRENT PLAN')
          else
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: enabled && !busy && id != 'base' ? onChoose : null,
                child: busy
                    ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                    : Text(
                        id == 'base'
                            ? 'Included'
                            : hasPaidPlan
                                ? 'Manage current plan on web'
                                : enabled
                                    ? 'Choose $planName'
                                    : 'Checkout unavailable',
                      ),
              ),
            ),
        ],
      ),
    );
  }
}

class _FormField extends StatelessWidget {
  const _FormField({required this.label, required this.controller, this.prefix, this.keyboardType});
  final String label;
  final TextEditingController controller;
  final String? prefix;
  final TextInputType? keyboardType;
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(label, style: Theme.of(context).textTheme.labelSmall?.copyWith(letterSpacing: .8, fontWeight: FontWeight.w800)),
    const SizedBox(height: 7),
    TextField(controller: controller, keyboardType: keyboardType, decoration: InputDecoration(prefixText: prefix, border: const OutlineInputBorder(), isDense: true)),
  ]);
}

class _SectionHeading extends StatelessWidget {
  const _SectionHeading({required this.title, required this.count});
  final String title;
  final int count;
  @override
  Widget build(BuildContext context) => Row(children: [
    Expanded(child: Text(title, style: Theme.of(context).textTheme.titleLarge)),
    Text('$count', style: Theme.of(context).textTheme.labelLarge?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
  ]);
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});
  final String label;
  final String value;
  @override
  Widget build(BuildContext context) => Row(children: [
    Expanded(child: Text(label, style: Theme.of(context).textTheme.labelSmall?.copyWith(letterSpacing: .7, color: Theme.of(context).colorScheme.onSurfaceVariant))),
    Flexible(child: Text(value, textAlign: TextAlign.end, style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w800))),
  ]);
}

class _ActionTile extends StatelessWidget {
  const _ActionTile({required this.icon, required this.title, required this.subtitle, required this.onTap, this.trailing, this.danger = false});
  final List<List> icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final Widget? trailing;
  final bool danger;
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(vertical: 4),
      leading: HugeIcon(icon: icon, size: 22, color: danger ? AceTheme.danger : theme.colorScheme.onSurface),
      title: Text(title, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800, color: danger ? AceTheme.danger : null)),
      subtitle: Text(subtitle, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
      trailing: trailing ?? const HugeIcon(icon: HugeIcons.strokeRoundedArrowExpandDiagonal01, size: 18),
      onTap: onTap,
    );
  }
}

class _DataTile extends StatelessWidget {
  const _DataTile({required this.icon, required this.title, required this.subtitle, required this.trailing});
  final List<List> icon;
  final String title;
  final String subtitle;
  final String trailing;
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(vertical: 4),
      leading: HugeIcon(icon: icon, size: 22, color: theme.colorScheme.onSurfaceVariant),
      title: Text(title, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
      subtitle: Text(subtitle, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
      trailing: SizedBox(width: 84, child: Text(trailing, textAlign: TextAlign.end, maxLines: 2, overflow: TextOverflow.ellipsis, style: theme.textTheme.labelSmall?.copyWith(color: theme.colorScheme.onSurfaceVariant))),
    );
  }
}

class _ErrorPanel extends StatelessWidget {
  const _ErrorPanel({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(border: Border.all(color: AceTheme.danger.withValues(alpha: .45))),
    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const HugeIcon(icon: HugeIcons.strokeRoundedShieldAlert, color: AceTheme.danger),
      const SizedBox(width: 10),
      Expanded(child: Text(message, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AceTheme.danger))),
      IconButton(onPressed: onRetry, icon: const HugeIcon(icon: HugeIcons.strokeRoundedRefresh, size: 18), tooltip: 'Retry'),
    ]),
  );
}

class _EmptyPanel extends StatelessWidget {
  const _EmptyPanel({required this.message});
  final String message;
  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(border: Border.all(color: Theme.of(context).dividerTheme.color ?? AceTheme.line)),
    child: Text(message, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant, height: 1.5)),
  );
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.text});
  final String text;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
    decoration: BoxDecoration(color: Theme.of(context).colorScheme.surfaceContainerHighest),
    child: Text(text, style: Theme.of(context).textTheme.labelSmall?.copyWith(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.w800, letterSpacing: .4)),
  );
}

String _date(dynamic value) {
  final date = DateTime.tryParse(value?.toString() ?? '');
  if (date == null) return 'Not available';
  final local = date.toLocal();
  return '${local.day.toString().padLeft(2, '0')}/${local.month.toString().padLeft(2, '0')}/${local.year}';
}
