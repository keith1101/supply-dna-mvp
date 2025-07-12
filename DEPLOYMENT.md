# Vercel Deployment Guide

## Prerequisites

1. **Pinata API Keys**
   - Go to [https://app.pinata.cloud/developers/api-keys](https://app.pinata.cloud/developers/api-keys)
   - Create a new API key
   - Copy both the **API Key** and **Secret API Key**

2. **Vercel Account**
   - Sign up at [https://vercel.com](https://vercel.com)
   - Connect your GitHub repository

## Deployment Steps

### 1. Deploy to Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard:
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Deploy

### 2. Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add these variables:

```
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_API_KEY=your_pinata_secret_api_key_here
```

### 3. Redeploy

After setting environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment

## Configuration Files

### vercel.json
- Sets Node.js 18.x runtime for serverless functions
- Configures build settings for React app
- Routes API calls to serverless functions
- Routes all other requests to index.html (SPA routing)

### api/pinata-upload.js
- Vercel serverless function for IPFS uploads
- Uses Pinata SDK to upload JSON metadata
- Returns IPFS hash for blockchain registration

## Testing Deployment

1. **Test the API endpoint:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/pinata-upload \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

2. **Test the frontend:**
   - Visit your deployed URL
   - Try registering a component
   - Check browser console for any errors

## Troubleshooting

### Common Issues

1. **"Pinata API keys not configured"**
   - Ensure environment variables are set in Vercel
   - Redeploy after setting variables

2. **"Failed to upload to IPFS"**
   - Check Vercel function logs
   - Verify Pinata API keys are correct
   - Ensure you have sufficient Pinata credits

3. **CORS errors**
   - The serverless function includes CORS headers
   - Check browser console for specific errors

### Checking Logs

1. In Vercel dashboard, go to **Functions** tab
2. Click on your function
3. View **Function Logs** for debugging

## Local Development vs Production

- **Local:** Uses `http://localhost:5001/upload` (requires local server)
- **Production:** Uses `/api/pinata-upload` (Vercel serverless function)

The frontend automatically detects the environment and uses the appropriate endpoint.

## Security Notes

- Pinata API keys are stored as environment variables
- Never commit API keys to your repository
- Use Vercel's environment variable system for secure storage 