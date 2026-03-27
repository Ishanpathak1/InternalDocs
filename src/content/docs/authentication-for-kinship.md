---
title: "How Authentication Works in Kinship: ASP.NET Core Identity, Claims, and Role Context"

author: Ishan Pathak

pubDate: 2026-03-27

description: A practical breakdown of how authentication and authorization work in Kinship using ASP.NET Core Identity, cookie authentication, custom claims, role context switching, and Blazor route enforcement.

codeLocation: Kinship/Program.cs, Kinship/Services/UserAccessService.cs, Kinship/Services/KinshipClaimsPrincipalFactory.cs, Kinship/Components/Layout/MainLayout.razor

categories: ["Kinship"]

topic: Technical Docs For Kinship
---

# How Authentication Works in Kinship: ASP.NET Core Identity, Claims, and Role Context

When working on a legacy-to-modern migration like **Kinship**, one of the most important things to understand is not just *who* is authenticated, but also *what context* that user is operating in.

In Kinship, authentication is not only about logging in with a username and password. It also includes:

- determining whether the user is approved,
- verifying that they have at least one valid program assignment,
- selecting the correct program/role context,
- refreshing claims after context changes, and
- ensuring the UI and route flow reflect that context correctly.

This post gives a practical overview of how that flow works across:

- `Program.cs`
- `UserAccessService`
- `KinshipClaimsPrincipalFactory`
- `RoleContextService`
- the Blazor shell (`Routes.razor` and `MainLayout.razor`)

---

## The Core Stack: ASP.NET Core Identity + Cookie Authentication

Kinship uses **ASP.NET Core Identity** with the **application cookie** authentication scheme.

At a high level, the application is configured to:

- authenticate using the Identity application cookie,
- store users via Entity Framework,
- use a custom Identity user model (`AuthUser`),
- and generate principals through a custom claims principal factory.

### Key setup in `Program.cs`

```csharp
builder.Services
    .AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();

builder.Services
    .AddIdentityCore<AuthUser>(options =>
    {
        options.Password.RequiredLength = 12;
        // ... password and lockout rules ...
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<KinshipDbContext>()
    .AddClaimsPrincipalFactory<KinshipClaimsPrincipalFactory>()
    .AddSignInManager()
    .AddDefaultTokenProviders();
```

### Important details

- **Authentication scheme:** `IdentityConstants.ApplicationScheme`
- **Persistence:** Identity cookie
- **User type:** `AuthUser` (`IdentityUser<int>`)
- **Database storage:** `KinshipDbContext`
- **Custom principal factory:** `KinshipClaimsPrincipalFactory`

In addition, Identity is configured with:

- password rules,
- lockout rules,
- unique email enforcement.

For example, the app uses a **5-attempt lockout** with a **10-minute lockout window**, which helps protect against brute-force login attempts.

---

## Standard Identity Claims vs Kinship-Specific Claims

One subtle but important design choice in Kinship is that the custom claims are **not all created in the same place**.

### What `KinshipClaimsPrincipalFactory` does

`KinshipClaimsPrincipalFactory` is responsible for building the **base Identity principal**. It only creates the standard Identity-related claims, such as:

- user ID
- username
- email
- security stamp

It does **not** attach Kinship-specific program or role claims.

### Example

```csharp
public async Task<ClaimsPrincipal> CreateAsync(AuthUser user)
{
    // ...
    return new ClaimsPrincipal(identity);
}
```

This means that logging in establishes **identity**, but not necessarily the full **application context**.

---

## Where the Kinship Context Claims Are Added

The application-specific claims are added inside:

- `UserAccessService.BuildClaimsAsync`

This method is used whenever Kinship needs to **refresh the sign-in cookie** and attach the latest context-specific claims.

That happens during flows such as:

- login,
- context selection,
- context switching.

### Example from `UserAccessService`

```csharp
private async Task<IEnumerable<Claim>> BuildClaimsAsync(AuthUser user)
{
    var claims = new List<Claim>();
    // UserLoginPk, ConfidentialityAccepted from DB...
    var active = await GetActiveContextAsync(user);
    if (active != null)
    {
        claims.Add(new Claim(KinshipClaimTypes.ActiveProgramPk, active.ProgramPk.ToString()));
        claims.Add(new Claim(KinshipClaimTypes.ActiveRole, active.RoleName));
        claims.Add(new Claim(ClaimTypes.Role, active.RoleName));
    }
    return claims;
}
```

### Claims added by Kinship

Kinship introduces several custom claims:

- `kinship:user_login_pk`
- `kinship:active_program_pk`
- `kinship:active_role`
- `kinship:confidentiality_accepted`

It also adds the standard:

- `ClaimTypes.Role`

…but only when an active program/role context exists.

### Why this matters

This creates a clear separation:

- **Identity claims** = who the user is
- **Kinship claims** = what program/role context they are currently acting in

That distinction is especially useful when a user may have access to **multiple programs or roles**.

---

## Understanding “Active Context” in Kinship

A user being authenticated does **not automatically** mean they have an active program context.

Kinship resolves active context from two sources:

1. **`UserPrograms`**  
   These represent the user’s valid program assignments.

2. **`UserActiveContexts`**  
   This stores the currently selected assignment when the user has multiple options.

### Practical meaning

So in Kinship:

- **Login proves identity**
- **Active context defines authorization and navigation behavior**

This is why users with multiple assignments are routed differently after login.

---

## Login Flow: More Than Just Password Validation

Kinship’s login flow is implemented through a **minimal API endpoint**, not purely inside Blazor.

The login form submits to:

- `POST /auth/login`

### What happens after form submission

The flow is roughly:

1. Validate credentials with `PasswordSignInAsync`
2. Ensure the user is approved
3. Fetch their assignments via `GetAssignmentsAsync`
4. If no assignments exist:
   - sign out immediately
   - redirect with `?error=no-access`
5. If one assignment exists:
   - automatically select it
   - redirect into context selection endpoint
6. If multiple assignments exist:
   - clear current context
   - send user to context selection UI

### Example

```csharp
app.MapPost("/auth/login", async (
    [FromForm] LoginRequest request,
    UserAccessService userAccess) =>
{
    var result = await userAccess.PasswordSignInAsync(request.Login, request.Password, request.RememberMe);
    // ...
    var assignments = await userAccess.GetAssignmentsAsync(user);
    if (assignments.Count == 0)
    {
        await userAccess.SignOutAsync();
        return Results.LocalRedirect("/login?error=no-access");
    }
    // single vs multi, redirect to select-context or auth/select-context/...
});
```

### Why this is a strong pattern

This avoids a common mistake where apps treat **successful password authentication** as enough.  
Kinship adds an extra layer:

> A user is only “usable” after they both authenticate **and** have a valid accessible program context.

---

## Authentication Endpoints in Kinship

Beyond login, Kinship exposes a few important authentication-related endpoints:

### `GET /auth/select-context/{userProgramPk}`

This endpoint:

- sets the selected program/role context in the database,
- refreshes the sign-in cookie,
- adds the correct claims,
- redirects the user home.

### `GET /auth/switch-context`

This endpoint:

- clears the current context,
- refreshes the sign-in cookie,
- redirects the user back to `/select-context`.

### `GET /auth/logout`

This endpoint signs the user out.

---

## Blazor Routing: Authentication vs Application Readiness

Kinship uses Blazor for the UI, but the actual application readiness check goes beyond simple `[Authorize]` usage.

### `Routes.razor`

The router is wrapped with:

- `CascadingAuthenticationState`
- `AuthorizeRouteView`

This allows Razor components/pages to use attributes like:

- `[Authorize]`
- `[AllowAnonymous]`
- `[Authorize(Policy = ...)]`

### Examples in the app

- `SelectRole` / `SelectContext` → `[Authorize]`
- `/login` → `[AllowAnonymous]`
- admin demo page → `[Authorize(Policy = AdminAccess)]`

This gives you **route-level authorization**, but Kinship still adds another layer.

---

## The Real Gatekeeper: `MainLayout` + `RoleContextService`

In Kinship, the most important enforcement point is actually the **main layout**, not just page attributes.

On first render, `MainLayout` calls:

- `RoleContext.InitializeAsync(authState.User)`

That method pulls fresh information and builds the **UI-facing role context**.

### Example from `MainLayout.razor`

```csharp
await RoleContext.InitializeAsync(authState.User);
// ...
if (!RoleContext.IsAuthenticated)
{
    if (!IsLoginRoute)
        Navigation.NavigateTo("/login", forceLoad: true);
}
else if (!RoleContext.HasSelection)
{
    if (!IsContextSelectionRoute)
        Navigation.NavigateTo("/select-context", forceLoad: true);
}
else if (IsLoginRoute)
{
    Navigation.NavigateTo("/", forceLoad: true);
}
```

### What this achieves

The layout ensures:

- unauthenticated users are redirected to `/login`
- authenticated users without an active context are redirected to `/select-context`
- authenticated users with context should not remain on `/login`

This is a very practical safeguard because it enforces not only:

- **authentication state**, but also
- **context completeness**

---

## Why `RoleContextService` Matters So Much

`RoleContextService` acts as the **UI-friendly representation** of the authenticated user’s state.

It includes information such as:

- whether the user is authenticated,
- whether they selected a program,
- active role,
- program name,
- whether they are admin or navigator,
- legacy role mappings (like `LegacyRoleKey`),
- menu-level access flags (for example, `CanAccessAceAssessment`).

### Important architectural insight

Many pages in Kinship appear to rely on:

- `RoleContextService`

for:

- menu visibility,
- navigation decisions,
- feature toggles,

rather than relying exclusively on authorization attributes.

That means:

- **policies protect entry points**
- **RoleContext protects UX flow and feature exposure**

This is common in large enterprise migrations where older role-based behavior still needs to be mirrored in the UI.

---

## Authorization Policies Defined in `Program.cs`

Kinship defines several reusable authorization policies.

### Example

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicyNames.AuthenticatedUser, policy => policy.RequireAuthenticatedUser());
    options.AddPolicy(AuthPolicyNames.ProgramAccess, policy =>
        policy.RequireAuthenticatedUser()
            .RequireClaim(KinshipClaimTypes.ActiveProgramPk)
            .RequireClaim(KinshipClaimTypes.ActiveRole));
    // NavigatorAccess, AdminAccess, ConfidentialityAccepted ...
});
```

### Notable policies

#### `AuthenticatedUser`

Requires only that the user is signed in.

#### `ProgramAccess`

Requires:

- authenticated user
- `ActiveProgramPk`
- `ActiveRole`

This ensures the user has a selected program context.

#### `NavigatorAccess`

Checks whether the active role is a navigator-style role.

#### `AdminAccess`

Checks whether the active role qualifies for admin behavior.

#### `ConfidentialityAccepted`

Requires:

- `kinship:confidentiality_accepted == True`

This is a great example of a business-rule-driven authorization claim.

---

## Current Usage of Policies

In the code you reviewed, the most obvious direct usage is:

- `AdminAccess` on `AdminStaff.razor`

Other policies are available and likely intended for:

- future pages,
- API endpoints,
- stronger page-level enforcement as the app evolves.

There is also a helper:

- `CurrentUserContextAccessor`

which reads values like:

- `UserLoginPk`
- active program
- active role
- confidentiality status

directly from the `ClaimsPrincipal`.

That makes it easier for services or components to avoid repeating claim-parsing logic.

---

## End-to-End Authentication Flow in Kinship

Putting it all together, the full flow looks like this:

1. User submits credentials to `/auth/login`
2. Identity validates the user and creates the base authenticated principal
3. Kinship checks whether the user is:
   - approved
   - assigned to at least one active `UserProgram`
4. If multiple assignments exist:
   - user is sent to select context
5. If a context is selected:
   - `UserActiveContexts` is updated
   - sign-in cookie is refreshed
   - Kinship claims are rebuilt
6. Blazor initializes `RoleContextService`
7. `MainLayout` redirects based on:
   - authenticated vs unauthenticated
   - selected context vs no context
8. Policies and role context together determine:
   - route access
   - UI visibility
   - feature access

### In one sentence

> Kinship authentication is not just “log in and go” — it is a layered model where Identity handles authentication, custom claims represent active program context, and `RoleContextService` ensures the UI behaves according to that context.

---

## Why This Architecture Works Well for Kinship

This approach is especially effective for an enterprise-style application because it cleanly separates concerns:

### 1. Identity remains standard and maintainable

Using ASP.NET Core Identity means the app benefits from:

- secure cookie handling,
- lockout support,
- token providers,
- consistent authentication patterns.

### 2. Business context is modeled explicitly

Instead of assuming one user = one role, the system supports:

- multiple assignments,
- role switching,
- context-aware claims.

### 3. UI behavior stays aligned with backend state

Because `RoleContextService` is initialized from the authenticated user and current DB-backed context, the UI can reflect:

- correct menus,
- correct navigation,
- correct access states.

### 4. It supports legacy migration realities

For a system like Kinship, where older role semantics still matter, this pattern helps bridge:

- modern Identity-based auth
- legacy program/role behavior
- Blazor-based UI flow

That is exactly the kind of design that makes migration safer and more incremental.

---

## Final Thoughts

If you are debugging or extending Kinship authentication, the most important mental model is this:

- **Authentication** answers: *Who is this user?*
- **Claims** answer: *What context are they currently in?*
- **RoleContextService** answers: *How should the UI behave for them right now?*

That separation is the key to understanding why:

- a user can be logged in but still be redirected,
- a role can exist but not yet be active,
- and UI access may depend on more than just `[Authorize]`.

For Kinship, that layered design is not accidental — it is what allows the application to handle real-world enterprise access patterns safely.

---

## Files Referenced

- `Kinship/Program.cs`
- `Kinship/Services/UserAccessService.cs`
- `Kinship/Services/KinshipClaimsPrincipalFactory.cs`
- `Kinship/Components/Layout/MainLayout.razor`

---

## Suggested Next Follow-Up Blog Posts

If you want to continue documenting Kinship, the best next technical posts would be:

1. **First Login with Multiple Program Assignments in Kinship**
2. **How Role Switching Works in Kinship**
3. **Using `RoleContextService` for UI Authorization in Blazor**
4. **How Kinship Refreshes Claims After Context Changes**
5. **Admin vs Navigator Access in Kinship**

---