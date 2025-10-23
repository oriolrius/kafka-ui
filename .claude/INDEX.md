# Claude Code Configuration Index

Complete overview of agents, skills, and workflows for Kafbat UI development.

## 📋 Quick Navigation
- [README.md](./README.md) - **Start here!** Comprehensive development guide
- [Agents](#agents) - Specialized AI assistants
- [Skills](#skills) - Reusable workflows

## 🤖 Agents

Specialized AI assistants with deep expertise in specific domains.

| Agent | File | Purpose |
|-------|------|---------|
| **Backend Developer** | [backend-developer.md](./agents/backend-developer.md) | Java/Spring Boot/Kafka development |
| **Frontend Developer** | [frontend-developer.md](./agents/frontend-developer.md) | React/TypeScript UI development |
| **API Contract Developer** | [api-contract-developer.md](./agents/api-contract-developer.md) | TypeSpec/OpenAPI contract management |
| **Testing Specialist** | [testing-specialist.md](./agents/testing-specialist.md) | JUnit/Jest/Playwright testing |
| **Build & DevOps** | [build-devops-specialist.md](./agents/build-devops-specialist.md) | Gradle/Docker/CI-CD |
| **Schema Assistant** | [schema-assistant-specialist.md](./agents/schema-assistant-specialist.md) | AVRO/Protobuf/JSON Schema |
| **Project Manager** | [project-manager-backlog.md](./agents/project-manager-backlog.md) | Task and project management |
| **Documentation Manager** | [backlog-docs-manager.md](./agents/backlog-docs-manager.md) | Technical documentation |

### Agent Specializations

#### Backend Development
- **Spring Boot WebFlux** - Reactive programming patterns
- **Kafka Integration** - Producers, consumers, AdminClient
- **Schema Registry** - AVRO/Protobuf serialization
- **Cloud IAM** - AWS MSK, Azure, GCP integration
- **Testing** - JUnit 5, Mockito, Testcontainers

#### Frontend Development
- **React 18** - Hooks, Context, Error Boundaries
- **State Management** - Zustand stores
- **Data Fetching** - TanStack Query (React Query)
- **Forms** - React Hook Form + Yup validation
- **Styling** - Styled Components with theme
- **Testing** - Jest, React Testing Library

#### API Contract
- **TypeSpec** - Modern API definition language
- **OpenAPI Generation** - Automated spec generation
- **Client Generation** - TypeScript client for frontend
- **Contract-First** - Design before implementation

#### Testing
- **Unit Tests** - JUnit 5 (backend), Jest (frontend)
- **Integration Tests** - Testcontainers, WebTestClient
- **E2E Tests** - Playwright + Cucumber (BDD)
- **Coverage** - JaCoCo (backend), Istanbul (frontend)

#### Build & DevOps
- **Gradle** - Multi-project build configuration
- **Docker** - Containerization and Docker Compose
- **CI/CD** - GitHub Actions workflows
- **Development** - Just command runner, local Kafka

#### Schema Management
- **AVRO** - Schema design and evolution
- **Protobuf** - Proto3 syntax and patterns
- **JSON Schema** - Validation and composition
- **Compatibility** - Forward/backward/full compatibility
- **LLM Assistant** - AI-powered schema generation

## ⚡ Skills

Reusable workflows for common development tasks.

| Skill | File | What It Does |
|-------|------|--------------|
| **Dev Environment** | [dev-environment.md](./skills/dev-environment.md) | Start complete dev environment |
| **Run All Tests** | [run-all-tests.md](./skills/run-all-tests.md) | Execute full test suite |
| **Generate API Client** | [generate-api-client.md](./skills/generate-api-client.md) | Regenerate TypeScript from TypeSpec |
| **Kafka Local Setup** | [kafka-local-setup.md](./skills/kafka-local-setup.md) | Start local Kafka cluster |
| **Code Quality Check** | [code-quality-check.md](./skills/code-quality-check.md) | Run linters and type checks |

### When to Use Skills

| Scenario | Skill to Use |
|----------|--------------|
| Starting work on the project | **Dev Environment** |
| Before creating a PR | **Run All Tests** + **Code Quality Check** |
| After modifying TypeSpec API | **Generate API Client** |
| Testing with local Kafka | **Kafka Local Setup** |
| Before committing code | **Code Quality Check** |

## 🔄 Typical Workflows

### New Feature Development
1. Create task: `backlog task create "Feature Title"`
2. Start work: `backlog task edit <id> -s "In Progress" -a @me`
3. Invoke appropriate agent (backend/frontend/api-contract)
4. Implement feature following agent patterns
5. Use **Code Quality Check** skill
6. Use **Run All Tests** skill
7. Mark acceptance criteria: `backlog task edit <id> --check-ac <index>`
8. Complete task: `backlog task edit <id> -s Done`

### Bug Fix
1. Identify issue in existing code
2. Create task: `backlog task create "Fix: Description"`
3. Invoke **Testing Specialist** to add regression test
4. Invoke appropriate domain agent to fix issue
5. Verify fix with tests
6. Use **Code Quality Check** skill
7. Complete task

### API Contract Update
1. Invoke **API Contract Developer** agent
2. Modify TypeSpec definitions
3. Use **Generate API Client** skill
4. Invoke **Backend Developer** to update implementation
5. Invoke **Frontend Developer** to use new types
6. Test integration
7. Use **Run All Tests** skill

### Schema Evolution
1. Invoke **Schema Assistant** agent
2. Design new schema version
3. Check compatibility with Schema Registry
4. Update producers/consumers
5. Test migration path
6. Document breaking changes (if any)

## 🎯 Agent Selection Guide

### "How do I..."

| Question | Agent to Use |
|----------|--------------|
| "...add a new REST endpoint?" | **Backend Developer** |
| "...create a React component?" | **Frontend Developer** |
| "...modify the API contract?" | **API Contract Developer** |
| "...write unit tests?" | **Testing Specialist** |
| "...fix the Docker build?" | **Build & DevOps** |
| "...evolve an AVRO schema?" | **Schema Assistant** |
| "...manage project tasks?" | **Project Manager** |
| "...write documentation?" | **Documentation Manager** |

### By Technology

| Technology | Agent |
|------------|-------|
| Java, Spring Boot, WebFlux | **Backend Developer** |
| React, TypeScript, Zustand | **Frontend Developer** |
| TypeSpec, OpenAPI | **API Contract Developer** |
| JUnit, Jest, Playwright | **Testing Specialist** |
| Gradle, Docker, CI/CD | **Build & DevOps** |
| AVRO, Protobuf, JSON Schema | **Schema Assistant** |

## 📁 File Structure

```
.claude/
├── INDEX.md                    # This file
├── README.md                   # Main development guide
├── agents/                     # Specialized agents
│   ├── backend-developer.md
│   ├── frontend-developer.md
│   ├── api-contract-developer.md
│   ├── testing-specialist.md
│   ├── build-devops-specialist.md
│   ├── schema-assistant-specialist.md
│   ├── project-manager-backlog.md
│   └── backlog-docs-manager.md
└── skills/                     # Reusable workflows
    ├── dev-environment.md
    ├── run-all-tests.md
    ├── generate-api-client.md
    ├── kafka-local-setup.md
    └── code-quality-check.md
```

## 🚀 Getting Started

### For New Developers
1. Read [README.md](./README.md) - Comprehensive overview
2. Run **Dev Environment** skill to start services
3. Review agent guides for your area of work
4. Use skills for common tasks

### For Existing Developers
1. Use agents for specialized assistance
2. Use skills to automate repetitive tasks
3. Contribute new agents/skills as needed

## 🔧 Customization

### Adding a New Agent
1. Create `.claude/agents/my-agent.md`
2. Follow existing agent structure:
   - Role & Expertise
   - Development Workflow
   - Code Patterns
   - Common Issues
   - Task Workflow
3. Add entry to this index

### Adding a New Skill
1. Create `.claude/skills/my-skill.md`
2. Include:
   - Purpose description
   - Implementation steps
   - Usage examples
3. Add entry to this index

## 📚 Additional Resources

### Project Documentation
- **Backlog Docs**: `backlog/docs/`
- **Architecture Decisions**: `backlog/decisions/`
- **Task Management**: Use `backlog` CLI

### External Documentation
- [Spring WebFlux](https://docs.spring.io/spring-framework/reference/web/webflux.html)
- [React Documentation](https://react.dev/)
- [TypeSpec](https://typespec.io/)
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [AVRO Specification](https://avro.apache.org/docs/current/spec.html)

## 🤝 Contributing

When creating new agents or skills:
- Follow existing patterns and structure
- Include practical examples
- Document common issues and solutions
- Keep task workflow section consistent
- Update this index

## 📞 Getting Help

1. **Read agent documentation** for your domain
2. **Use skills** for automated workflows
3. **Check README.md** for comprehensive guidance
4. **Review backlog docs** for feature-specific help

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
