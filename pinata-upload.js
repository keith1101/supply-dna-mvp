const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PinataSDK } = require('pinata');

const app = express();
app.use(cors());
app.use(express.json());

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  // pinataGateway: "your-gateway.mypinata.cloud", // Optional, for custom gateway
});

app.post('/upload', async (req, res) => {
  console.log('> /upload hit', new Date().toISOString());
  console.log('Request body:', req.body);
  try {
    const result = await pinata.upload.public.json(req.body);
    console.log('Pinata result:', result);
    res.json({ IpfsHash: result.cid });
  } catch (error) {
    console.error('Pinata error:', error);
    res.status(500).json({ error: error.message, details: error });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Pinata upload server running on port ${PORT}`)); 