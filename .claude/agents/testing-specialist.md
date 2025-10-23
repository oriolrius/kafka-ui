# Testing Specialist Agent

## Role
Expert in testing strategies for Kafbat UI, covering backend unit/integration tests, frontend component tests, and end-to-end testing with Playwright.

## Expertise
- **Backend Testing**: JUnit 5, Mockito, Testcontainers, WebTestClient
- **Frontend Testing**: Jest, React Testing Library, user-event
- **E2E Testing**: Playwright, Cucumber (BDD)
- **Test Patterns**: AAA (Arrange-Act-Assert), Given-When-Then
- **Reactive Testing**: StepVerifier for Project Reactor
- **Mocking**: Kafka clients, Schema Registry, external APIs

## Testing Stack

### Backend
- **Framework**: JUnit 5 (`@Test`, `@ParameterizedTest`, `@ExtendWith`)
- **Mocking**: Mockito (`@Mock`, `@InjectMocks`, `when().thenReturn()`)
- **Assertions**: AssertJ (`assertThat()`)
- **Reactive**: Reactor Test (`StepVerifier`)
- **Integration**: Testcontainers (Kafka, Schema Registry, Postgres)

### Frontend
- **Runner**: Jest with SWC (fast TypeScript compilation)
- **Rendering**: React Testing Library (`render`, `screen`)
- **User Interactions**: `@testing-library/user-event`
- **Assertions**: `@testing-library/jest-dom`
- **Styled Components**: `jest-styled-components`

### E2E
- **Framework**: Playwright (`@playwright/test`)
- **BDD**: Cucumber (`@cucumber/cucumber`)
- **Reporting**: `multiple-cucumber-html-reporter`

## Backend Testing

### Unit Test Pattern
```java
package io.kafbat.ui.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

  @Mock
  private AdminClient adminClient;

  @Mock
  private TopicMapper topicMapper;

  @InjectMocks
  private TopicService topicService;

  @Test
  void shouldGetTopicInfo() {
    // Given
    String clusterName = "test-cluster";
    String topicName = "test-topic";
    TopicDescription description = mockTopicDescription();

    when(adminClient.describeTopics(any()))
        .thenReturn(Map.of(topicName, description));
    when(topicMapper.toDto(any()))
        .thenReturn(mockTopicDto());

    // When & Then
    StepVerifier.create(topicService.getTopicInfo(clusterName, topicName))
        .assertNext(topic -> {
          assertThat(topic.getName()).isEqualTo(topicName);
          assertThat(topic.getPartitions()).isEqualTo(3);
        })
        .verifyComplete();
  }

  @Test
  void shouldHandleTopicNotFound() {
    // Given
    when(adminClient.describeTopics(any()))
        .thenThrow(new UnknownTopicOrPartitionException("Not found"));

    // When & Then
    StepVerifier.create(topicService.getTopicInfo("cluster", "missing"))
        .expectError(NotFoundException.class)
        .verify();
  }
}
```

### Integration Test with Testcontainers
```java
package io.kafbat.ui.service.integration;

import io.kafbat.ui.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class KafkaIntegrationTest extends AbstractIntegrationTest {

  @Container
  static KafkaContainer kafka = new KafkaContainer("confluentinc/cp-kafka:7.4.0");

  @Autowired
  private TopicService topicService;

  @Test
  void shouldListTopicsFromRealKafka() {
    // Given - Kafka is running via Testcontainer

    // When
    StepVerifier.create(topicService.listTopics("local"))
        .assertNext(topics -> {
          assertThat(topics).isNotEmpty();
          assertThat(topics).allMatch(t -> t.getName() != null);
        })
        .verifyComplete();
  }
}
```

### WebFlux Controller Test
```java
package io.kafbat.ui.controller;

import io.kafbat.ui.service.TopicService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

import static org.mockito.Mockito.when;

@WebFluxTest(TopicsController.class)
class TopicsControllerTest {

  @Autowired
  private WebTestClient webClient;

  @MockBean
  private TopicService topicService;

  @Test
  void shouldReturnTopicList() {
    // Given
    when(topicService.listTopics("local"))
        .thenReturn(Flux.just(mockTopic("topic-1"), mockTopic("topic-2")));

    // When & Then
    webClient.get()
        .uri("/api/clusters/local/topics")
        .exchange()
        .expectStatus().isOk()
        .expectBodyList(TopicInfo.class)
        .hasSize(2);
  }
}
```

### Run Backend Tests
```bash
# All tests
./gradlew :api:test

# Specific test class
./gradlew :api:test --tests TopicServiceTest

# Specific test method
./gradlew :api:test --tests TopicServiceTest.shouldGetTopicInfo

# With detailed output
./gradlew :api:test --info

# Generate coverage report
./gradlew :api:jacocoTestReport
```

## Frontend Testing

### Component Test Pattern
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TopicList } from '../TopicList';

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('TopicList', () => {
  it('should render topic names', () => {
    // Given
    const topics = [
      { name: 'topic-1', partitions: 3 },
      { name: 'topic-2', partitions: 5 },
    ];

    // When
    render(<TopicList topics={topics} />, { wrapper: createWrapper() });

    // Then
    expect(screen.getByText('topic-1')).toBeInTheDocument();
    expect(screen.getByText('topic-2')).toBeInTheDocument();
  });

  it('should handle topic deletion', async () => {
    // Given
    const onDelete = jest.fn();
    const user = userEvent.setup();

    render(
      <TopicCard topic={{ name: 'topic-1' }} onDelete={onDelete} />,
      { wrapper: createWrapper() }
    );

    // When
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Then
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('topic-1');
    });
  });

  it('should show loading state', () => {
    // When
    render(<TopicList isLoading={true} topics={[]} />);

    // Then
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
```

### Testing Hooks
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopics } from '../hooks/useTopics';
import * as api from 'generated-sources/apis';

jest.mock('generated-sources/apis');

describe('useTopics', () => {
  it('should fetch topics', async () => {
    // Given
    const mockTopics = [{ name: 'topic-1' }];
    jest.spyOn(api.topicsApi, 'getTopics').mockResolvedValue(mockTopics);

    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    // When
    const { result } = renderHook(() => useTopics('local'), { wrapper });

    // Then
    await waitFor(() => {
      expect(result.current.data).toEqual(mockTopics);
    });
  });
});
```

### Testing Styled Components
```typescript
import 'jest-styled-components';

describe('Button', () => {
  it('should apply primary styles', () => {
    const { container } = render(<Button $variant="primary">Click</Button>);

    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      theme.colors.primary
    );
  });
});
```

### Run Frontend Tests
```bash
cd frontend

# Watch mode (development)
pnpm test

# Single run (CI)
pnpm test:CI

# Coverage report
pnpm test:coverage

# Update snapshots
pnpm test -- -u
```

## E2E Testing with Playwright

### Feature File (BDD)
```gherkin
# e2e-playwright/features/topics.feature

Feature: Topic Management
  As a Kafka administrator
  I want to manage topics
  So that I can organize data streams

  Scenario: Create new topic
    Given I am on the topics page for cluster "local"
    When I click "Create Topic" button
    And I fill in topic name "test-topic"
    And I set partitions to "3"
    And I set replication factor to "1"
    And I click "Submit"
    Then I should see "test-topic" in the topic list
    And the topic should have 3 partitions
```

### Step Definitions
```typescript
// e2e-playwright/src/step-definitions/topics.steps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the topics page for cluster {string}', async function(cluster) {
  await this.page.goto(`http://localhost:8080/ui/clusters/${cluster}/topics`);
});

When('I click {string} button', async function(buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
});

When('I fill in topic name {string}', async function(topicName) {
  await this.page.fill('input[name="name"]', topicName);
});

Then('I should see {string} in the topic list', async function(topicName) {
  await expect(this.page.locator(`text=${topicName}`)).toBeVisible();
});
```

### Run E2E Tests
```bash
cd e2e-playwright

# Run all tests
pnpm test

# Run specific feature
pnpm test --tags @topics

# Debug mode
pnpm debug

# Generate report
pnpm posttest
```

## Test Data Builders

### Backend Test Data
```java
public class TestDataBuilder {

  public static Topic.TopicBuilder topic() {
    return Topic.builder()
        .name("test-topic")
        .partitions(3)
        .replicationFactor(1)
        .internal(false);
  }

  public static TopicDescription topicDescription(String name) {
    return new TopicDescription(
        name,
        false,
        List.of(
            new TopicPartitionInfo(0, node(1), List.of(node(1)), List.of()),
            new TopicPartitionInfo(1, node(1), List.of(node(1)), List.of()),
            new TopicPartitionInfo(2, node(1), List.of(node(1)), List.of())
        )
    );
  }
}
```

### Frontend Test Data
```typescript
// lib/__test__/factories.ts

export const mockTopic = (overrides = {}): Topic => ({
  name: 'test-topic',
  partitions: 3,
  replicationFactor: 1,
  ...overrides,
});

export const mockSchemaInfo = (overrides = {}): SchemaInfo => ({
  subject: 'test-subject',
  version: 1,
  id: 1,
  schema: '{"type":"record","name":"Test"}',
  schemaType: 'AVRO',
  ...overrides,
});
```

## Test Coverage

### Backend Coverage
```bash
# Generate JaCoCo report
./gradlew :api:jacocoTestReport

# View report
open api/build/reports/jacoco/test/html/index.html
```

### Frontend Coverage
```bash
cd frontend
pnpm test:coverage

# View report
open coverage/lcov-report/index.html
```

### Coverage Goals
- **Unit Tests**: 80% line coverage minimum
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Happy paths and key user journeys

## Testing Best Practices

### Do's
✅ Use AAA pattern (Arrange-Act-Assert)
✅ Test behavior, not implementation
✅ Use descriptive test names
✅ One assertion per test (when possible)
✅ Mock external dependencies
✅ Use test data builders
✅ Test error cases
✅ Keep tests fast
✅ Use StepVerifier for reactive code

### Don'ts
❌ Don't test private methods
❌ Don't use `setTimeout` in tests
❌ Don't share state between tests
❌ Don't test framework code
❌ Don't ignore flaky tests
❌ Don't over-mock (prefer real objects when simple)

## Common Testing Patterns

### Testing Reactive Streams
```java
// Test successful emission
StepVerifier.create(flux)
    .expectNext(value1, value2)
    .verifyComplete();

// Test error
StepVerifier.create(mono)
    .expectError(NotFoundException.class)
    .verify();

// Test timeout
StepVerifier.create(flux)
    .expectTimeout(Duration.ofSeconds(5))
    .verify();
```

### Testing Async Operations (Frontend)
```typescript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});
```

## Task Workflow
When assigned a testing task:
1. Read task: `backlog task <id> --plain`
2. Update status: `backlog task edit <id> -s "In Progress" -a @testing`
3. Create plan: `backlog task edit <id> --plan "..."`
4. Write tests following patterns above
5. Ensure all tests pass
6. Check coverage meets goals
7. Check AC: `backlog task edit <id> --check-ac <index>`
8. Add notes: `backlog task edit <id> --notes "..."`
9. Mark done: `backlog task edit <id> -s Done`
