# Kafbat UI - Claude Code Development Guide

Comprehensive guide for AI-assisted development of Kafbat UI using Claude Code agents and skills.

## 📚 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Specialized Agents](#specialized-agents)
- [Skills](#skills)
- [Development Workflows](#development-workflows)
- [Quick Reference](#quick-reference)

## Project Overview

**Kafbat UI** is a versatile, fast, and lightweight web UI for managing Apache Kafka® clusters.

### Tech Stack
- **Backend**: Java 17, Spring Boot 3, WebFlux (Reactive), Kafka Clients API
- **Frontend**: React 18, TypeScript, Vite, Zustand, TanStack Query, Styled Components
- **API Contract**: TypeSpec → OpenAPI → TypeScript client generation
- **Testing**: JUnit 5, Jest, Playwright/Cucumber
- **Build**: Gradle (multi-project), pnpm, Just command runner
- **Infrastructure**: Docker, Docker Compose, GitHub Actions

### Key Features
- Multi-cluster Kafka management
- Schema Registry (AVRO, Protobuf, JSON Schema)
- Kafka Connect management
- KSQL DB support
- Consumer group monitoring
- ACL management
- LLM-powered Schema Assistant (OpenRouter integration)
- RBAC with granular permissions
- Cloud IAM support (AWS, Azure, GCP)

## Architecture

```
kafka-ui/
├── api/                      # Spring Boot backend
│   └── src/main/java/io/kafbat/ui/
│       ├── controller/      # WebFlux REST controllers
│       ├── service/         # Business logic
│       ├── config/          # Spring configuration
│       ├── serdes/          # Serialization
│       └── model/           # Domain models
├── frontend/                # React frontend
│   └── src/
│       ├── components/      # Feature components
│       ├── generated-sources/ # Auto-generated API client
│       ├── lib/            # Hooks, services, utilities
│       └── theme/          # Styled Components theme
├── contract-typespec/       # API contract definitions
├── e2e-playwright/          # E2E tests (BDD)
├── serde-api/              # SerDe plugin API
└── backlog/                # Project management
    ├── tasks/              # Task tracking (via backlog CLI)
    ├── docs/               # Project documentation
    └── decisions/          # Architectural decisions
```

## Specialized Agents

Claude Code agents are specialized AI assistants for different aspects of development. Each agent has deep expertise in their domain and follows established patterns for the project.

### Available Agents

| Agent | Purpose | Key Expertise | When to Use |
|-------|---------|---------------|-------------|
| **backend-developer** | Java/Spring Boot development | WebFlux, Kafka clients, reactive patterns | Backend features, API endpoints, Kafka integration |
| **frontend-developer** | React/TypeScript UI | React 18, Zustand, TanStack Query, Styled Components | UI components, forms, state management |
| **api-contract-developer** | API contract management | TypeSpec, OpenAPI, code generation | API design, contract changes, type generation |
| **testing-specialist** | Test automation | JUnit, Jest, Playwright, Testcontainers | Writing tests, test coverage, E2E scenarios |
| **build-devops-specialist** | Build & deployment | Gradle, Docker, CI/CD, Just | Build issues, Docker, workflows, env setup |
| **schema-assistant-specialist** | Schema management | AVRO, Protobuf, JSON Schema, evolution | Schema design, evolution patterns, compatibility |
| **project-manager-backlog** | Task management | Backlog CLI, task tracking, project organization | Managing tasks, planning work |
| **backlog-docs-manager** | Documentation | Technical writing, documentation structure | Creating/updating docs, ADRs |

### How to Use Agents

Agents are invoked automatically by Claude Code based on the task context. You can also explicitly request an agent:

```
@backend-developer Can you help implement a new API endpoint for listing consumer groups?
```

## Skills

Skills are reusable workflows for common development tasks. They provide step-by-step automation for repetitive operations.

### Available Skills

| Skill | Purpose | Usage |
|-------|---------|-------|
| **dev-environment** | Start full dev environment | `Run dev-environment skill` |
| **run-all-tests** | Execute complete test suite | `Run run-all-tests skill` |
| **generate-api-client** | Regenerate TypeScript client | `Run generate-api-client skill` |
| **kafka-local-setup** | Start local Kafka cluster | `Run kafka-local-setup skill` |
| **code-quality-check** | Run linters and type checks | `Run code-quality-check skill` |

### Creating Custom Skills

Skills are markdown files in `.claude/skills/`. Create new skills for project-specific workflows:

```markdown
# My Custom Skill

Brief description of what this skill does.

## Implementation:
```bash
# Commands to execute
```
```

## Development Workflows

### 1. Starting Development

```bash
# First time setup
cd frontend && pnpm install

# Terminal 1: Start backend
just backend

# Terminal 2: Start frontend
just frontend

# Access UI at http://localhost:51081
```

**Or use the skill**: "Run dev-environment skill"

### 2. Implementing a Backend Feature

```bash
# 1. Take task from backlog
backlog task list -s "To Do" --plain
backlog task edit 42 -s "In Progress" -a @backend-dev

# 2. Create plan
backlog task edit 42 --plan "1. Create service\n2. Add controller\n3. Test"

# 3. Implement following patterns in backend-developer agent

# 4. Run tests
./gradlew :api:test

# 5. Check code quality
./gradlew :api:checkstyleMain

# 6. Mark acceptance criteria
backlog task edit 42 --check-ac 1 --check-ac 2

# 7. Complete task
backlog task edit 42 --notes "Implemented XYZ..." -s Done
```

### 3. Implementing a Frontend Feature

```bash
# 1. Ensure API client is up-to-date
cd frontend && pnpm gen:sources

# 2. Implement following patterns in frontend-developer agent

# 3. Run tests
pnpm test:CI

# 4. Check code quality
pnpm lint && pnpm tsc --noEmit

# 5. Test in browser (backend must be running)
# Visit http://localhost:51081
```

### 4. Updating API Contract

```bash
# 1. Modify TypeSpec definitions
# Edit contract-typespec/api/*.tsp

# 2. Generate client
cd frontend && pnpm gen:sources

# 3. Update backend implementation to match contract

# 4. Update frontend to use new types

# 5. Test integration
```

**Or use the skill**: "Run generate-api-client skill"

### 5. Running Tests

```bash
# Backend tests
./gradlew :api:test

# Frontend tests
cd frontend && pnpm test:CI

# E2E tests
cd e2e-playwright && pnpm test

# All tests + quality checks
# Use skill: "Run run-all-tests skill"
```

### 6. Code Quality Before Commit

```bash
# Backend checkstyle
./gradlew :api:checkstyleMain

# Frontend lint + types
cd frontend && pnpm lint && pnpm tsc --noEmit

# Auto-fix frontend issues
cd frontend && pnpm lint:fix
```

**Or use the skill**: "Run code-quality-check skill"

## Quick Reference

### Just Commands
```bash
just --list              # Show all commands
just backend             # Start backend
just frontend            # Start frontend
just test                # Run tests
just kafka-up            # Start local Kafka
just gen-sources         # Regenerate API sources
just format              # Format code
just lint                # Lint code
just build               # Production build
```

### Gradle Commands
```bash
./gradlew :api:bootRun              # Run backend
./gradlew :api:test                 # Run tests
./gradlew :api:checkstyleMain       # Check code style
./gradlew build -x test             # Build without tests
./gradlew clean                     # Clean build
```

### pnpm Commands (Frontend)
```bash
pnpm install            # Install dependencies
pnpm dev                # Start dev server
pnpm build              # Production build
pnpm test               # Run tests (watch)
pnpm test:CI            # Run tests (CI)
pnpm lint               # Run ESLint
pnpm lint:fix           # Auto-fix lint issues
pnpm tsc                # Type check
pnpm gen:sources        # Regenerate API client
```

### Backlog Commands
```bash
backlog task list --plain                    # List tasks
backlog task 42 --plain                      # View task
backlog task create "Title" -d "Desc"        # Create task
backlog task edit 42 -s "In Progress"        # Update status
backlog task edit 42 --check-ac 1            # Check AC
backlog task edit 42 --notes "Done"          # Add notes
backlog search "topic" --plain               # Search
```

### Health Checks
```bash
# Backend health
curl http://localhost:51080/actuator/health | jq '.'

# UI config
curl http://localhost:51080/api/info | jq '.ui'

# Schema Registry (local)
curl http://localhost:8081/subjects
```

### Docker Commands
```bash
# Start local Kafka
just kafka-up

# Stop local Kafka
just kafka-down

# View logs
just kafka-logs

# Test Schema Registry
just test-schema-registry-up
just test-schema-registry-create-sample
just test-schema-registry-down
```

## Common Patterns

### Backend Service (Reactive)
```java
@Service
@Slf4j
public class MyService {
  public Mono<Result> doSomething(String param) {
    return Mono.fromCallable(() -> blockingOperation(param))
      .subscribeOn(Schedulers.boundedElastic())
      .map(this::transform)
      .onErrorMap(e -> new CustomException("Failed", e));
  }
}
```

### Frontend Component with Query
```typescript
const MyComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['myData'],
    queryFn: () => api.getData(),
  });

  if (isLoading) return <PageLoader />;
  return <div>{data.name}</div>;
};
```

### TypeSpec API Definition
```typespec
@route("/api/clusters/{clusterName}/topics")
interface Topics {
  @get
  listTopics(@path clusterName: string): Topic[];

  @post
  createTopic(@path clusterName: string, @body topic: TopicRequest): Topic;
}
```

## Best Practices

### Backend
✅ Use reactive types (`Mono<T>`, `Flux<T>`)
✅ Never use `.block()` in service methods
✅ Run checkstyle before committing
✅ Write tests with StepVerifier for reactive code
✅ Keep imports alphabetically ordered

### Frontend
✅ Use transient props (`$` prefix) for styled-components
✅ Use React Query for API calls
✅ Keep components small and focused
✅ Write tests with Testing Library
✅ Run `pnpm lint:fix` before committing

### API Contract
✅ Design contract first before implementation
✅ Never edit generated sources
✅ Keep models reusable across endpoints
✅ Document breaking vs non-breaking changes

### Testing
✅ Test behavior, not implementation
✅ Use test data builders
✅ Mock external dependencies
✅ Maintain 80%+ coverage
✅ Fix flaky tests immediately

## Troubleshooting

### "Backend not starting"
```bash
# Check if port is in use
lsof -i :51080

# Check logs
just backend  # Look for errors

# Verify Java version
java -version  # Should be 17
```

### "Frontend build failing"
```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf node_modules/.vite

# Regenerate API sources
pnpm gen:sources
```

### "Tests failing"
```bash
# Backend: Clean and rebuild
./gradlew clean :api:test

# Frontend: Update snapshots if needed
cd frontend && pnpm test -- -u
```

### "Checkstyle errors"
```bash
# View specific errors
./gradlew :api:checkstyleMain --info

# Common fix: reorder imports alphabetically
```

## Resources

- **Documentation**: `backlog/docs/`
- **Architecture Decisions**: `backlog/decisions/`
- **API Contract**: `contract-typespec/api/`
- **Just Commands**: `just --list`
- **Health Endpoints**:
  - Health: `http://localhost:51080/actuator/health`
  - Info: `http://localhost:51080/actuator/info`
  - Metrics: `http://localhost:51080/actuator/metrics`

---

**Need Help?**
- Ask Claude Code to invoke a specialized agent for your task
- Use skills for common workflows
- Check agent documentation in `.claude/agents/`
- Review backlog docs for feature-specific guidance
