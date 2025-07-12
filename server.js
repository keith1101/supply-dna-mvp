const express = require('express');
const cors = require('cors');
const { PinataSDK } = require('pinata');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Pinata
const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
});

// Upload endpoint
app.post('/upload', async (req, res) => {
  try {
    console.log('Uploading to Pinata:', req.body);
    
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
      return res.status(500).json({ 
        error: 'Pinata API keys not configured. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY environment variables.' 
      });
    }

    const result = await pinata.pinJSONToIPFS(req.body);
    console.log('Pinata upload successful:', result);
    
    res.json({ IpfsHash: result.IpfsHash });
  } catch (error) {
    console.error('Pinata upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload to Pinata: ' + error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Local Pinata upload server is running' });
});

app.listen(PORT, () => {
  console.log(`Local Pinata upload server running on http://localhost:${PORT}`);
  console.log('Make sure to set PINATA_API_KEY and PINATA_SECRET_API_KEY environment variables');
}); 