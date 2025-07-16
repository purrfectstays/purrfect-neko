---
inclusion: fileMatch
fileMatchPattern: '**/*.{ts,tsx,js,jsx}'
---

# MCP Integration Patterns for Purrfect Stays

## MCP Server Usage Guidelines

### Supabase MCP Integration
When working with database operations, always leverage the Supabase MCP for:
- **Edge Function Deployment**: Use natural language commands
- **Database Schema Management**: Query and modify schemas conversationally
- **Analytics Queries**: Execute our custom analytics functions
- **Environment Variable Management**: Secure configuration updates

```typescript
// Example: Use MCP for database operations
// Instead of manual Supabase client calls, describe what you need:
// "Query user segmentation analytics for the last 30 days"
// "Deploy the updated send-verification-email function"
```

### GitHub MCP Integration
For development workflow automation:
- **Issue Management**: Create and track issues automatically
- **Pull Request Workflow**: Automate PR creation for translations/fixes
- **Repository Management**: Handle branch operations and releases
- **Code Review Assistance**: Automated code quality checks

### Netlify MCP Integration
For deployment and monitoring:
- **Build Status Monitoring**: Real-time deployment tracking
- **Environment Variable Updates**: Secure production configuration
- **Performance Monitoring**: Site performance and uptime tracking
- **Domain Management**: Handle custom domain configurations

### Resend MCP Integration
For email system management:
- **Email Deliverability Debugging**: Diagnose email delivery issues
- **Template Management**: Update email templates across languages
- **Analytics Tracking**: Monitor email open rates and engagement
- **A/B Testing**: Test different email variations

## Security Patterns

### Token Management
- **NEVER** hardcode MCP tokens in source code
- **ALWAYS** use environment variables for MCP authentication
- **ROTATE** MCP tokens monthly as configured
- **VALIDATE** token permissions are minimal required scope

### Error Handling
```typescript
// Proper MCP error handling pattern
try {
  const result = await mcpServer.execute(command);
  return result;
} catch (error) {
  // Log error without exposing sensitive MCP details
  console.error('MCP operation failed:', error.message);
  throw new Error('Service temporarily unavailable');
}
```

## Performance Patterns

### Efficient MCP Usage
- **BATCH** related MCP operations when possible
- **CACHE** MCP responses for repeated queries
- **TIMEOUT** MCP calls to prevent hanging operations
- **FALLBACK** to local operations when MCP unavailable

### Resource Management
```typescript
// Proper MCP resource cleanup
useEffect(() => {
  const mcpConnection = initializeMCPConnection();
  
  return () => {
    mcpConnection.cleanup();
  };
}, []);
```

## Integration Examples

### Analytics Dashboard Integration
```typescript
// Use Supabase MCP for analytics queries
const getAnalyticsData = async () => {
  // Natural language query via MCP
  return await supabaseMCP.query(
    "Get user segmentation analytics with geographic distribution"
  );
};
```

### Automated Issue Creation
```typescript
// Use GitHub MCP for automated issue tracking
const createPerformanceIssue = async (metrics: PerformanceMetrics) => {
  if (metrics.bundleSize > 250000) {
    await githubMCP.createIssue({
      title: "Bundle size exceeds 250KB limit",
      body: `Current size: ${metrics.bundleSize}KB`,
      labels: ["performance", "optimization"]
    });
  }
};
```

### Deployment Automation
```typescript
// Use Netlify MCP for deployment monitoring
const monitorDeployment = async (deployId: string) => {
  const status = await netlifyMCP.getDeploymentStatus(deployId);
  
  if (status === 'failed') {
    await linearMCP.createIssue({
      title: "Deployment failed",
      priority: "urgent"
    });
  }
};
```

## Best Practices

### MCP Command Patterns
- **BE SPECIFIC**: Use detailed, specific commands for better results
- **INCLUDE CONTEXT**: Provide relevant context for complex operations
- **VALIDATE RESULTS**: Always validate MCP operation results
- **HANDLE FAILURES**: Implement proper fallback mechanisms

### Development Workflow
1. **Plan**: Use Linear MCP for project planning and tracking
2. **Develop**: Leverage GitHub MCP for code management
3. **Test**: Use Supabase MCP for database testing
4. **Deploy**: Monitor via Netlify MCP
5. **Monitor**: Track issues via integrated MCP workflow

### Quality Assurance
- **TEST** MCP integrations in development environment first
- **MONITOR** MCP server health and response times
- **DOCUMENT** MCP usage patterns and common commands
- **REVIEW** MCP logs for optimization opportunities

---

*These patterns ensure consistent, secure, and efficient use of our comprehensive MCP infrastructure.*