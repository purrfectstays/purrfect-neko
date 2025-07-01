# MCP (Model Context Protocol) Setup Guide

This guide walks you through setting up all the critical and secondary priority MCPs for the Purrfect Stays landing page project.

## Overview

MCPs (Model Context Protocols) enhance your development workflow by providing standardized integrations between AI tools and external services. This setup includes 7 essential MCPs.

## Prerequisites

- Node.js installed on your machine
- Access tokens for each service
- Claude Code or compatible AI tool

## Critical Priority MCPs

### 1. Supabase MCP
**Purpose**: Database operations, Edge Functions, schema management

**Setup Steps**:
1. Go to your Supabase dashboard → Settings → Access Tokens
2. Create a new personal access token named "MCP Integration"
3. Find your project reference in Project Settings → General → Reference ID
4. Update the configuration with your values

**Configuration**:
```json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase@latest", "--read-only", "--project-ref=YOUR_PROJECT_REF"],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "YOUR_PERSONAL_ACCESS_TOKEN"
  }
}
```

### 2. GitHub MCP
**Purpose**: Development workflow, issue tracking, repository management

**Setup Steps**:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with repo, workflow, admin:org permissions
3. Update configuration with your token

**Configuration**:
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github@latest"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
  }
}
```

### 3. Vercel MCP
**Purpose**: Deployment monitoring, configuration management

**Setup Steps**:
1. Go to Vercel → Settings → Tokens
2. Create new token with appropriate scope
3. Update configuration

**Configuration**:
```json
"vercel": {
  "command": "npx",
  "args": ["-y", "@vercel/mcp-server@latest"],
  "env": {
    "VERCEL_TOKEN": "YOUR_VERCEL_TOKEN"
  }
}
```

### 4. Resend Email MCP
**Purpose**: Email deliverability monitoring, template management

**Setup Steps**:
1. Go to Resend dashboard → API Keys
2. Create new API key
3. Update configuration

**Configuration**:
```json
"resend": {
  "command": "npx",
  "args": ["-y", "@resend/mcp-server@latest"],
  "env": {
    "RESEND_API_KEY": "YOUR_RESEND_API_KEY"
  }
}
```

## Secondary Priority MCPs

### 5. Google Analytics MCP
**Purpose**: Conversion tracking, user behavior analysis

**Setup Steps**:
1. Create Google Cloud service account
2. Download service account JSON file
3. Get your GA4 property ID from Analytics dashboard
4. Update configuration paths

### 6. Linear MCP
**Purpose**: Project management, feature tracking

**Setup Steps**:
1. Go to Linear → Settings → API → Personal API Keys
2. Create new API key
3. Update configuration

### 7. Sentry MCP
**Purpose**: Error tracking, performance monitoring

**Setup Steps**:
1. Go to Sentry → Settings → Account → API → Auth Tokens
2. Create new auth token
3. Get your organization slug and project slug
4. Update configuration

## Installation

1. **Install MCP packages** (they'll be installed automatically when first used):
   ```bash
   # Packages will be installed via npx when MCP servers start
   ```

2. **Update configuration file**:
   - Edit `.mcp/mcp-config.json` with your actual tokens and IDs
   - Replace all placeholder values with real credentials

3. **Configure your AI tool**:
   - **For Claude Desktop**: Copy configuration to Claude's MCP settings
   - **For Cursor**: Import MCP configuration in settings
   - **For other tools**: Follow their specific MCP setup instructions

## Security Notes

- **Never commit tokens to version control**
- Use environment variables for sensitive data
- Keep tokens secure and rotate them regularly
- Use read-only access where possible (especially for Supabase)

## Troubleshooting

### Common Issues:
1. **Permission errors**: Ensure tokens have correct scopes
2. **Network issues**: Check firewall and proxy settings
3. **Version conflicts**: Update to latest MCP packages

### Testing Your Setup:
1. Start your AI tool
2. Test each MCP integration individually
3. Verify connectivity and permissions
4. Check logs for any errors

## Benefits After Setup

Once configured, you'll be able to:
- Query and manage your Supabase database through natural language
- Create GitHub issues, manage PRs, and track repository activity
- Monitor Vercel deployments and manage configurations
- Debug email deliverability and manage templates
- Analyze Google Analytics data for insights
- Track Linear issues and project progress
- Monitor errors and performance through Sentry

## Support

If you encounter issues:
1. Check the specific MCP server documentation
2. Verify your tokens and permissions
3. Review the configuration syntax
4. Test individual MCPs to isolate issues

Remember to keep this configuration file secure and never share your API tokens!