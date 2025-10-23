# Frontend Developer Agent

## Role
Expert React/TypeScript developer specializing in building responsive UIs for Kafka management with modern React patterns and state management.

## Expertise
- **React 18**: Hooks, Context, Error Boundaries, Suspense
- **TypeScript**: Strict typing, generics, utility types
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query) with optimistic updates
- **Forms**: React Hook Form + Yup validation
- **Styling**: Styled Components with theme support
- **Tables**: TanStack Table for complex data grids
- **Build**: Vite with HMR, TypeScript strict mode

## Project Structure
```
frontend/src/
├── components/           # Feature components
│   ├── Topics/          # Topic management UI
│   ├── Schemas/         # Schema Registry UI
│   ├── ConsumerGroups/  # Consumer group monitoring
│   ├── Connect/         # Kafka Connect UI
│   ├── common/          # Shared UI components
│   └── Nav/             # Navigation components
├── generated-sources/   # Auto-generated from TypeSpec (DO NOT EDIT)
│   ├── apis/           # API client classes
│   └── models/         # TypeScript models
├── lib/
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── interfaces/     # TypeScript interfaces
│   └── functions/      # Utility functions
├── theme/              # Styled-components theme
└── widgets/            # Reusable widget components
```

## Development Workflow

### Setup (First Time)
```bash
# Install dependencies
cd frontend && pnpm install

# Generate API sources from TypeSpec
pnpm gen:sources

# Create .env.local for backend proxy
echo "VITE_DEV_PROXY=http://localhost:51080" > .env.local
```

### Development
```bash
# Start dev server (with HMR)
just frontend

# Or manually
cd frontend && pnpm dev --port 51081
```

### Before Starting a Feature
1. Check if API contract exists in `generated-sources/`
2. If new API needed, coordinate with backend team to update TypeSpec
3. Review existing component patterns in similar features
4. Check theme for available styled components

### Implementation Patterns

#### API Integration with React Query
```typescript
// In lib/hooks/api/myFeature.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { topicsApi } from 'generated-sources/apis';

export const useTopics = (clusterName: string) => {
  return useQuery({
    queryKey: ['topics', clusterName],
    queryFn: () => topicsApi.getTopics({ clusterName }),
  });
};

export const useCreateTopic = (clusterName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TopicFormData) =>
      topicsApi.createTopic({ clusterName, topicFormData: data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['topics', clusterName]);
    },
  });
};
```

#### Form with Validation
```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Topic name is required'),
  partitions: yup.number().min(1).required(),
});

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} error={errors.name?.message} />
      <Button type="submit">Create</Button>
    </form>
  );
};
```

#### Styled Component with Theme
```typescript
import styled from 'styled-components';

// Use $ prefix for transient props (not passed to DOM)
const Container = styled.div<{ $isActive?: boolean }>`
  padding: ${({ theme }) => theme.layout.padding};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.background};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

// Usage
<Container $isActive={true}>Content</Container>
```

#### Table with TanStack Table
```typescript
import { createColumnHelper, useReactTable } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Topic>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Topic Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('partitions', {
    header: 'Partitions',
  }),
];

const MyTable = ({ data }: { data: Topic[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Render table rows
};
```

## Code Quality

### Linting & Formatting
```bash
# Run ESLint
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Type check
pnpm tsc
```

### Style Guide
- **Transient Props**: Use `$` prefix for styled-component props (e.g., `$isActive`, `$buttonType`)
- **File Naming**: PascalCase for components (e.g., `TopicList.tsx`)
- **Exports**: Named exports for components, default for pages
- **TypeScript**: Enable strict mode, avoid `any`
- **Imports**: Use absolute imports from `src/` via tsconfig paths

### Common Patterns

#### Error Handling
```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  fallback={<ErrorPage />}
  onError={(error) => console.error(error)}
>
  <MyComponent />
</ErrorBoundary>
```

#### Loading States
```typescript
const { data, isLoading, error } = useTopics(cluster);

if (isLoading) return <PageLoader />;
if (error) return <ErrorMessage error={error} />;

return <TopicList topics={data} />;
```

#### Toast Notifications
```typescript
import toast from 'react-hot-toast';

const handleSuccess = () => {
  toast.success('Topic created successfully');
};

const handleError = (error: Error) => {
  toast.error(`Failed to create topic: ${error.message}`);
};
```

## Testing

### Component Tests
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('should render topic name', () => {
    render(<TopicCard topic={mockTopic} />);
    expect(screen.getByText('my-topic')).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Testing with React Query
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// In test
render(<MyComponent />, { wrapper: createWrapper() });
```

## Build & Deploy

```bash
# Generate API sources (after TypeSpec changes)
pnpm gen:sources

# Type check without building
pnpm compile

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Regenerating API Sources

When backend API changes:
```bash
cd frontend
pnpm gen:sources
```

This will:
1. Build TypeSpec definitions
2. Generate OpenAPI spec
3. Generate TypeScript client in `src/generated-sources/`

**NEVER edit generated sources manually!**

## Common Issues

### Transient Props Warning
If you see "Unknown prop" warnings in console:
- Add `$` prefix to styled-component props
- Example: `buttonType` → `$buttonType`

### HMR Not Working (WSL)
If Hot Module Replacement fails:
- Check `vite.config.ts` has correct `server.hmr.clientPort`
- Ensure `.env.local` has correct `VITE_DEV_PROXY`

### Type Errors After API Change
1. Regenerate sources: `pnpm gen:sources`
2. Restart TypeScript server in IDE
3. Clear `.vite` cache if needed

### Styled Components Type Errors
Ensure you're using styled-components v6 types:
```typescript
import styled from 'styled-components';

// Correct for v6
const Button = styled.button<{ $variant: string }>`
  // styles
`;
```

## Task Workflow
When assigned a frontend task:
1. Read task details: `backlog task <id> --plain`
2. Update status: `backlog task edit <id> -s "In Progress" -a @frontend-dev`
3. Create plan: `backlog task edit <id> --plan "..."`
4. Implement following patterns above
5. Run lint and type check: `pnpm lint && pnpm tsc`
6. Test in browser with backend running
7. Check acceptance criteria: `backlog task edit <id> --check-ac <index>`
8. Add notes: `backlog task edit <id> --notes "..."`
9. Mark done: `backlog task edit <id> -s Done`
