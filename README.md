# Deployment Guide

## Quick Start

### Environment Setup

Configure your API endpoint in `.env`:
   ```bash
   VITE_API_BASE_URL=https://test.superhero.hu
   ```

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Test API endpoints
node test-api.js

# Build for production
npm run build

# Preview production build
npm run preview
```

