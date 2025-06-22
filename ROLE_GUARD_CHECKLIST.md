# Role & Permission Guarding Checklist

- [ ] Add new roles to `UserRole` in `authStore`
- [ ] Add new permissions to user object and assign as needed
- [ ] Protect new routes with `RoleGuard`
- [ ] Protect sensitive UI with `RoleGuard` or `PermissionGuard`
- [ ] Add navigation/menu logic for new roles/permissions
- [ ] Add RLS policies in Supabase for new roles/permissions
- [ ] Log all access denials and sensitive actions via `auditStore`
- [ ] Test with users of each role/permission
- [ ] Update documentation for developers and users 