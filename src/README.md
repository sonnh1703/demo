# Source structure

The source tree follows a small feature-based structure:

- `app/`: application composition and route wiring.
- `components/layout/`: application shell components such as navigation,
  headers, and workspace switching.
- `components/shared/`: reusable, domain-aware components used by multiple
  features.
- `components/ui/`: low-level visual primitives with no business logic.
- `features/<name>/`: pages and components owned by one business feature.
- `hooks/`: cross-feature hooks.
- `lib/`: framework-independent data and utilities.
- `store/`: global client state.

Keep a component inside its feature until at least two features need it. Move
it to `components/shared/` only when it has a stable cross-feature API. Avoid
barrel `index.ts` files; direct imports make dependencies and bundle boundaries
explicit.
