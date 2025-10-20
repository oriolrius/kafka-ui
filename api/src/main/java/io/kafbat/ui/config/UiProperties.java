package io.kafbat.ui.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("ui")
@Data
public class UiProperties {

  private UserMenu userMenu = new UserMenu();
  private SocialLinks socialLinks = new SocialLinks();

  @Data
  public static class UserMenu {
    private boolean enabled = false;
    private String accountUrl;
    private String logoutUrl;
  }

  @Data
  public static class SocialLinks {
    private boolean enabled = true;
    private String githubUrl = "https://github.com/kafbat/kafka-ui";
    private String discordUrl = "https://discord.com/invite/4DWzD7pGE5";
    private String productHuntUrl = "https://producthunt.com/products/ui-for-apache-kafka";
  }

}
