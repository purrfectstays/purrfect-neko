# Purrfect Stays - Development Commands

## Essential Commands (Run These After Any Changes)

### Development
```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Install dependencies
npm install
```

### Quality Assurance (RUN AFTER EVERY TASK)
```bash
# Type checking - MUST pass
npm run typecheck

# Linting - MUST pass
npm run lint

# Build for production - MUST succeed
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Specialized Commands
```bash
# Test service role access
npm run test:service-role

# Test edge functions
npm run test:edge-functions

# Optimize images
npm run optimize:images

# Analyze bundle size
npm run analyze:bundle

# Performance audit
npm run perf:audit
```

## Windows System Commands
```bash
# List files
dir

# Change directory
cd <directory>

# Find files
where <filename>

# Search in files (use PowerShell)
Select-String -Path "*.ts" -Pattern "searchterm"
```