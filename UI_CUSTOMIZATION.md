# UI Customization Guide

This guide explains how to customize the Kafka UI interface using configuration settings.

## Overview

Kafka UI now supports configuration-based customization for:
1. **User Menu** - Account and logout links in the left sidebar
2. **Social Links** - GitHub, Discord, and ProductHunt icons in the top right navbar

## Configuration

Add these settings to your `application.yml` or pass them as environment variables:

### User Menu Configuration

The user menu appears at the bottom of the left sidebar navigation panel.

```yaml
ui:
  userMenu:
    enabled: true  # Show/hide the entire user menu
    accountUrl: "https://your-domain.com/account"  # URL for account management
    logoutUrl: "https://your-domain.com/logout"    # URL for logout
```

**Environment Variables:**
- `UI_USERMENU_ENABLED=true`
- `UI_USERMENU_ACCOUNTURL=https://your-domain.com/account`
- `UI_USERMENU_LOGOUTURL=https://your-domain.com/logout`

**Behavior:**
- If `enabled` is `false`, the entire user menu section is hidden
- If `accountUrl` is not provided, the Account menu item won't be displayed
- If `logoutUrl` is not provided, the Logout menu item won't be displayed

### Social Links Configuration

Social links appear in the top right navigation bar.

```yaml
ui:
  socialLinks:
    enabled: true  # Show/hide all social links
    githubUrl: "https://github.com/your-org/your-repo"
    discordUrl: "https://discord.com/invite/your-server"
    productHuntUrl: "https://producthunt.com/products/your-product"
```

**Environment Variables:**
- `UI_SOCIALLINKS_ENABLED=true`
- `UI_SOCIALLINKS_GITHUBURL=https://github.com/your-org/your-repo`
- `UI_SOCIALLINKS_DISCORDURL=https://discord.com/invite/your-server`
- `UI_SOCIALLINKS_PRODUCTHUNTURL=https://producthunt.com/products/your-product`

**Default Values:**
```yaml
ui:
  socialLinks:
    enabled: true
    githubUrl: "https://github.com/kafbat/kafka-ui"
    discordUrl: "https://discord.com/invite/4DWzD7pGE5"
    productHuntUrl: "https://producthunt.com/products/ui-for-apache-kafka"
```

**Behavior:**
- If `enabled` is `false`, all social links are hidden
- If a specific URL is not provided, that icon won't be displayed
- You can selectively show/hide icons by providing or omitting their URLs

## Examples

### Example 1: Custom User Menu with OAuth Integration

```yaml
ui:
  userMenu:
    enabled: true
    accountUrl: "https://iam.demo.m3.nexiona.io/realms/server/account"
    logoutUrl: "https://console.demo.m3.nexiona.io/oauth2/sign_out"
```

### Example 2: Hide Social Links Completely

```yaml
ui:
  socialLinks:
    enabled: false
```

### Example 3: Show Only GitHub Link

```yaml
ui:
  socialLinks:
    enabled: true
    githubUrl: "https://github.com/your-company/kafka-ui"
    # Omit discordUrl and productHuntUrl to hide those icons
```

### Example 4: Disable User Menu

```yaml
ui:
  userMenu:
    enabled: false
```

### Example 5: Complete Customization

```yaml
ui:
  userMenu:
    enabled: true
    accountUrl: "https://auth.mycompany.com/profile"
    logoutUrl: "https://auth.mycompany.com/logout"
  socialLinks:
    enabled: true
    githubUrl: "https://github.com/mycompany/kafka-tools"
    discordUrl: "https://discord.gg/mycompany"
    # ProductHunt omitted - won't be displayed
```

## Technical Implementation

### Backend

- **Configuration Class**: `io.kafbat.ui.config.UiProperties`
- **Service**: `io.kafbat.ui.service.ApplicationInfoService`
- **API Endpoint**: `GET /api/info` returns UI settings in the response

### Frontend

- **Types**: Generated from OpenAPI spec in `src/generated-sources/models/`
  - `ApplicationInfoUi`
  - `ApplicationInfoUiUserMenu`
  - `ApplicationInfoUiSocialLinks`
- **Components**:
  - `NavBar.tsx` - Consumes social links configuration
  - `Nav.tsx` - Consumes user menu configuration
- **Hook**: `useAppInfo()` from `lib/hooks/api/appConfig`

### API Response Structure

```json
{
  "enabledFeatures": ["DYNAMIC_CONFIG"],
  "build": { ... },
  "latestRelease": { ... },
  "ui": {
    "userMenu": {
      "enabled": true,
      "accountUrl": "https://...",
      "logoutUrl": "https://..."
    },
    "socialLinks": {
      "enabled": true,
      "githubUrl": "https://...",
      "discordUrl": "https://...",
      "productHuntUrl": "https://..."
    }
  }
}
```

## Testing

You can verify your configuration by:

1. Starting the application with your custom configuration
2. Checking the `/api/info` endpoint response
3. Viewing the UI to confirm the changes

```bash
curl http://localhost:8080/api/info | jq '.ui'
```

## Migration Notes

If you're upgrading from a previous version:

- **Default Behavior**: By default, the user menu is **disabled** (`enabled: false`) and social links are **enabled** with Kafbat UI defaults
- **No Breaking Changes**: Existing installations will continue to work without modification
- **Opt-In**: Enable the user menu explicitly in your configuration

## Troubleshooting

### User Menu Not Appearing
- Verify `ui.userMenu.enabled` is set to `true`
- Ensure at least one of `accountUrl` or `logoutUrl` is provided
- Check `/api/info` endpoint to verify configuration is loaded

### Social Links Not Appearing
- Verify `ui.socialLinks.enabled` is set to `true`
- Ensure the specific URLs are provided
- Check browser console for any errors

### Environment Variables Not Working
- Ensure you're using the correct format: `UI_USERMENU_ENABLED=true`
- Environment variables override YAML configuration
- Restart the application after changing environment variables
