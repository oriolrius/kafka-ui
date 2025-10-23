# Generate API Client Skill

Regenerate TypeScript API client from TypeSpec definitions.

## What it does:
1. Compiles TypeSpec definitions to OpenAPI
2. Generates TypeScript client code
3. Places generated code in `frontend/src/generated-sources/`

## Usage:
Run this after modifying TypeSpec API contracts.

## When to use:
- After adding/modifying API endpoints in `contract-typespec/`
- When backend API changes and frontend needs updated types
- After pulling changes that include TypeSpec updates

## Implementation:

```bash
# From frontend directory
cd frontend

# This command:
# 1. Installs TypeSpec dependencies
# 2. Compiles TypeSpec to OpenAPI
# 3. Runs OpenAPI Generator
# 4. Creates TypeScript client in src/generated-sources/
pnpm gen:sources
```

## What gets generated:
```
frontend/src/generated-sources/
├── apis/
│   ├── TopicsApi.ts
│   ├── SchemasApi.ts
│   ├── BrokersApi.ts
│   └── ...
└── models/
    ├── Topic.ts
    ├── SchemaInfo.ts
    └── ...
```

## Verification:
```bash
# Type check to ensure generated code is valid
cd frontend && pnpm tsc --noEmit
```

## Troubleshooting:
If generation fails:
```bash
# Clean and retry
cd frontend
rm -rf src/generated-sources
pnpm gen:sources

# If still fails, check TypeSpec compilation
cd ../contract-typespec/api
pnpm install
pnpm build
```

## Important:
⚠️ **NEVER edit generated files manually!**
All changes must be made in TypeSpec definitions.
