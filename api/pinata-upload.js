const { PinataSDK } = require('pinata');

// Initialize Pinata with API keys
const pinata = new PinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Pinata upload request received:', req.body);
    
    // Check if API keys are configured
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
      console.error('Pinata API keys not configured');
      return res.status(500).json({ 
        error: 'Pinata API keys not configured. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY environment variables in Vercel.' 
      });
    }

    // Upload JSON to IPFS using Pinata
    const result = await pinata.pinJSONToIPFS(req.body);
    console.log('Pinata upload successful:', result);
    
    // Return the IPFS hash
    res.json({ IpfsHash: result.IpfsHash });
  } catch (error) {
    console.error('Pinata upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload to Pinata: ' + error.message 
    });
  }
}; 