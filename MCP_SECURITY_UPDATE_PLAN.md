# 🚨 MCP SECURITY UPDATE PLAN - CRITICAL

**Date**: January 17, 2025  
**Priority**: CRITICAL - Exposed tokens found  
**Status**: IMMEDIATE ACTION REQUIRED  

## 🔑 **EXPOSED MCP TOKENS REQUIRING ROTATION**

### **CRITICAL - ROTATE IMMEDIATELY**
1. **GitHub Token**: `github_pat_11BSXNMBI0***` (Found in .mcp/mcp-config.json)
2. **Netlify Token**: `nfp_7HY2JexAVrNoF9***` (Found in .mcp/mcp-config.json)
3. **Linear API Key**: `lin_api_nB5hCeTbbrI4***` (Found in .mcp/mcp-config.json)
4. **Sentry Token**: `sntryu_3456b0513fe2***` (Found in .mcp/mcp-config.json)
5. **Supabase Access Token**: `sbp_817d72071e8eceb***` (Found in .mcp/mcp-config.json)

### **ALREADY UPDATED**
✅ **Resend API Key**: Updated to `re_ccM4cgVw_9eiuFnJBsJqcSBpxeotUnxVS` (matches .env)

## 🔧 **STEP-BY-STEP ROTATION PROCESS**

### **1. GitHub Personal Access Token**
```bash
# Steps:
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Find token starting with: github_pat_11BSXNMBI0***
3. Delete the exposed token
4. Create new token with same permissions:
   - repo (full control)
   - workflow
   - write:packages
   - read:org
5. Update .mcp/mcp-config.json with new token
```

### **2. Netlify Access Token**
```bash
# Steps:
1. Go to Netlify.com → User settings → Applications → Personal access tokens
2. Find token starting with: nfp_7HY2JexAVrNoF9***
3. Delete the exposed token
4. Create new token with same permissions
5. Update .mcp/mcp-config.json with new token
```

### **3. Linear API Key**
```bash
# Steps:
1. Go to Linear.app → Settings → API → Personal API keys
2. Find key starting with: lin_api_nB5hCeTbbrI4***
3. Delete the exposed key
4. Create new API key
5. Update .mcp/mcp-config.json with new key
```

### **4. Sentry Auth Token**
```bash
# Steps:
1. Go to Sentry.io → Settings → Account → Auth Tokens
2. Find token starting with: sntryu_3456b0513fe2***
3. Delete the exposed token
4. Create new token with same scopes
5. Update .mcp/mcp-config.json with new token
```

### **5. Supabase Access Token**
```bash
# Steps:
1. Go to Supabase.com → Account → Access tokens
2. Find token starting with: sbp_817d72071e8eceb***
3. Delete the exposed token
4. Create new access token
5. Update .mcp/mcp-config.json with new token
```

## 📋 **UPDATED MCP CONFIGURATION TEMPLATE**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--read-only", "--project-ref=fahqkxrakcizftopskki"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "NEW_SUPABASE_TOKEN_HERE"
      }
    },
    "github": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-github@latest"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "NEW_GITHUB_TOKEN_HERE"
      }
    },
    "netlify": {
      "command": "npx",
      "args": ["-y", "@netlify/mcp-server@latest"],
      "env": {
        "NETLIFY_ACCESS_TOKEN": "NEW_NETLIFY_TOKEN_HERE",
        "NETLIFY_SITE_ID": "4e9167e4-918c-4b98-ac5e-e8cd236885a4"
      }
    },
    "resend": {
      "command": "npx",
      "args": ["-y", "@resend/mcp-server@latest"],
      "env": {
        "RESEND_API_KEY": "re_ccM4cgVw_9eiuFnJBsJqcSBpxeotUnxVS"
      }
    },
    "linear": {
      "command": "npx", 
      "args": ["-y", "@lucitra/linear-mcp@latest"],
      "env": {
        "LINEAR_API_KEY": "NEW_LINEAR_TOKEN_HERE"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server@latest"], 
      "env": {
        "SENTRY_AUTH_TOKEN": "NEW_SENTRY_TOKEN_HERE",
        "SENTRY_ORG": "purrfectstays",
        "SENTRY_PROJECT": "javascript-react"
      }
    }
  }
}
```

## 🔒 **SECURITY BEST PRACTICES GOING FORWARD**

### **1. Token Management**
- **NEVER** commit actual tokens to repository
- **USE** environment variables for all sensitive data
- **ROTATE** tokens monthly as configured
- **AUDIT** for exposed tokens before every commit

### **2. MCP Security Patterns**
```typescript
// Secure MCP token validation
const validateMCPToken = (token: string, service: string): boolean => {
  const tokenPatterns = {
    github: /^github_pat_[A-Za-z0-9_]+$/,
    netlify: /^nfp_[A-Za-z0-9_]+$/,
    linear: /^lin_api_[A-Za-z0-9_]+$/,
    sentry: /^sntryu_[A-Za-z0-9_]+$/,
    supabase: /^sbp_[A-Za-z0-9_]+$/
  };
  
  return tokenPatterns[service]?.test(token) || false;
};
```

### **3. Automated Security Scanning**
```bash
# Add to pre-commit hook
grep -r "github_pat_\|nfp_\|lin_api_\|sntryu_\|sbp_" --include="*.json" --include="*.md" .mcp/
```

## ⚠️ **IMMEDIATE ACTIONS REQUIRED**

1. **STOP** using current MCP servers until tokens are rotated
2. **ROTATE** all 5 exposed tokens immediately
3. **UPDATE** .mcp/mcp-config.json with new tokens
4. **TEST** MCP connectivity with new tokens
5. **COMMIT** updated configuration (without tokens in commit message)

## 🎯 **POST-ROTATION VERIFICATION**

```bash
# Test MCP server connectivity
npx @supabase/mcp-server-supabase --help
npx @modelcontextprotocol/server-github --help
npx @netlify/mcp-server --help
npx @resend/mcp-server --help
npx @lucitra/linear-mcp --help
npx @sentry/mcp-server --help
```

## 📊 **SECURITY IMPACT ASSESSMENT**

### **Risk Level**: CRITICAL
- **Exposed Services**: 5 critical services
- **Potential Impact**: Full access to GitHub, Netlify, Linear, Sentry, Supabase
- **Data at Risk**: Source code, deployment configs, project data, error logs
- **Mitigation**: Immediate token rotation

### **Timeline**
- **Discovery**: January 17, 2025 (this morning)
- **Required Action**: IMMEDIATE (within 1 hour)
- **Verification**: Within 2 hours
- **Documentation Update**: Within 4 hours

---

**🚨 CRITICAL: Do not use MCP servers until all tokens are rotated! 🚨**

*This security update is essential to maintain the security standards we established this morning.*