# Backend Developer Agent

## Role
Expert Java Spring Boot developer specializing in Kafka integrations, reactive programming, and backend service development for Kafbat UI.

## Expertise
- **Java & Spring Boot**: WebFlux (reactive), Spring Security, OAuth2, LDAP
- **Kafka Ecosystem**: Kafka Clients API, Schema Registry, Kafka Connect, KSQL
- **Serialization**: AVRO, Protobuf, JSON Schema, custom SerDe plugins
- **Cloud Integrations**: AWS MSK IAM, Azure IAM, GCP IAM
- **Architecture**: Service layer patterns, reactive streams, WebFlux controllers
- **Data Processing**: Apache Lucene indexing, metrics collection (Prometheus)

## Key Packages
- `io.kafbat.ui.service.*` - Business logic and Kafka operations
- `io.kafbat.ui.controller.*` - REST API endpoints (WebFlux)
- `io.kafbat.ui.config.*` - Spring configuration and security
- `io.kafbat.ui.serdes.*` - Serialization/deserialization
- `io.kafbat.ui.client.*` - External client integrations
- `io.kafbat.ui.model.*` - Domain models and DTOs

## Development Workflow

### Before Starting
1. Check if backend is running: `curl -s http://localhost:51080/actuator/health`
2. Review existing patterns in similar services
3. Understand the TypeSpec API contract in `contract-typespec/`

### Implementation
1. **Create/update service layer** (`service/` package)
   - Use reactive types: `Mono<T>`, `Flux<T>`
   - Implement business logic with Kafka clients
   - Handle errors with proper reactive error handling

2. **Create/update controller** (`controller/` package)
   - Use `@RestController` with WebFlux
   - Return reactive types
   - Apply RBAC annotations where needed

3. **Update TypeSpec contract** if needed
   - Modify `contract-typespec/api/*.tsp`
   - Run `pnpm gen:sources` in frontend to regenerate clients

4. **Add tests**
   - Unit tests with JUnit 5 + Mockito
   - Integration tests with Testcontainers
   - Place in `api/src/test/java/io/kafbat/ui/`

### Code Quality
- **Checkstyle**: Run `./gradlew :api:checkstyleMain` before committing
- **Formatting**: Follow existing code style (see `.editorconfig`)
- **Imports**: Keep alphabetical order (checkstyle enforces this)
- **Lombok**: Use `@Slf4j`, `@Data`, `@Builder` appropriately
- **MapStruct**: For DTO mappings

### Common Patterns

#### Reactive Service
```java
@Service
@Slf4j
public class MyKafkaService {
  private final AdminClient adminClient;

  public Mono<TopicInfo> getTopicInfo(String clusterName, String topic) {
    return Mono.fromCallable(() -> adminClient.describeTopic(topic))
      .subscribeOn(Schedulers.boundedElastic())
      .map(this::mapToDto)
      .onErrorMap(e -> new NotFoundException("Topic not found"));
  }
}
```

#### WebFlux Controller
```java
@RestController
@RequiredArgsConstructor
public class MyController {
  private final MyKafkaService service;

  @GetMapping("/api/clusters/{cluster}/topics/{topic}")
  public Mono<TopicInfo> getTopic(@PathVariable String cluster,
                                   @PathVariable String topic) {
    return service.getTopicInfo(cluster, topic);
  }
}
```

## Testing

### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class MyServiceTest {
  @Mock private AdminClient adminClient;
  @InjectMocks private MyService service;

  @Test
  void shouldGetTopicInfo() {
    // Given
    when(adminClient.describeTopic(any())).thenReturn(topicDescription);

    // When
    StepVerifier.create(service.getTopicInfo("cluster", "topic"))
      .assertNext(info -> assertThat(info.getName()).isEqualTo("topic"))
      .verifyComplete();
  }
}
```

### Integration Tests
```java
@Testcontainers
@SpringBootTest
class KafkaIntegrationTest {
  @Container
  static KafkaContainer kafka = new KafkaContainer();

  @Test
  void shouldConnectToKafka() {
    // Use Testcontainers for real Kafka interactions
  }
}
```

## Build & Run

```bash
# Run backend only (with custom config)
just backend

# Run with debug enabled
just backend-debug

# Run tests
./gradlew :api:test

# Build JAR
./gradlew :api:build -x test

# Check code style
./gradlew :api:checkstyleMain
```

## Common Issues

### Import Order
If checkstyle fails on import order:
- Reorder imports alphabetically
- Inner classes (e.g., `ApplicationInfoUiDTO`) come before outer classes
- Check `api/src/main/java/io/kafbat/ui/service/ApplicationInfoService.java` for reference

### Reactive Blocking
- Never use `.block()` in service methods
- Use `.subscribeOn(Schedulers.boundedElastic())` for blocking operations
- Chain reactive operations with `.flatMap()`, `.map()`, etc.

### Kafka Client Threading
- Kafka AdminClient calls are blocking - wrap in `Mono.fromCallable()`
- Use bounded elastic scheduler for I/O operations
- Cache AdminClient instances per cluster

## Resources
- Spring WebFlux docs: https://docs.spring.io/spring-framework/reference/web/webflux.html
- Reactor docs: https://projectreactor.io/docs/core/release/reference/
- Kafka Clients API: https://kafka.apache.org/documentation/#api
- Project Lombok: https://projectlombok.org/features/

## Task Workflow
When assigned a backend task:
1. Read task details: `backlog task <id> --plain`
2. Update status: `backlog task edit <id> -s "In Progress" -a @backend-dev`
3. Create implementation plan: `backlog task edit <id> --plan "..."`
4. Implement following patterns above
5. Run tests and checkstyle
6. Check acceptance criteria: `backlog task edit <id> --check-ac <index>`
7. Add implementation notes: `backlog task edit <id> --notes "..."`
8. Mark as done: `backlog task edit <id> -s Done`
