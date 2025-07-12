# Supply DNA Tracker

Supply DNA Tracker is a modern React-based web application for tracking, verifying, and analyzing supply chain components using blockchain technology and NFTs. It leverages a custom smart contract on Polygon (Amoy) and Chainlink for decentralized, tamper-proof traceability.

## Features

- **Component Registration with NFT:**
  - Register new supply chain components and mint a non-transferable (soulbound) NFT certificate for each, storing metadata on IPFS.
- **Component Lookup & QR Scanning:**
  - Instantly look up components by UUID or scan QR codes to retrieve their blockchain-verified details and lifecycle.
- **NFT Certificate Display:**
  - View NFT metadata, attributes, and blockchain explorer links for each registered component.
- **Traceability View:**
  - (Planned) Visualize the full trace history, chain of custody, or map of component movements.
- **Analytics Dashboard:**
  - (Planned) Visualize trends, KPIs, and advanced supply chain analytics.
- **Reports:**
  - (Planned) Generate, download, and review supply chain reports.
- **Settings:**
  - Manage account, preferences, and system settings.

## Smart Contract: `SupplyDNANFT_Custom.sol`

- Implements a custom ERC-721 NFT contract for supply chain components.
- Each component is registered with unique metadata (ID, name, supplier, batch, date, IPFS URI).
- Minted NFTs are **non-transferable** (soulbound) to ensure authenticity and traceability.
- Functions:
  - `registerComponent`: Register a new component and mint its NFT (owner only).
  - `getComponent`: Retrieve component details by ID.
  - `getTokenId`: Get the NFT token ID for a component.
  - `tokenURI`: Get the IPFS metadata URI for a token.
  - `updateMetadata`: (Owner only) Update a component's metadata URI.
  - Ownership can be transferred by the contract owner.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MetaMask](https://metamask.io/) browser extension
- Access to Polygon Amoy testnet
- Pinata API keys (for IPFS uploads)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd supplydna-frontend-2
   ```

2. **Configure environment:**
   Create a `.env` file in the root directory with your configuration:
   ```bash
   # Pinata API Keys (required for local development)
   # Get these from https://app.pinata.cloud/developers/api-keys
   PINATA_API_KEY=your_pinata_api_key_here
   PINATA_SECRET_API_KEY=your_pinata_secret_api_key_here
   
   # Optional: Override upload endpoint
   # REACT_APP_PINATA_UPLOAD_ENDPOINT=http://localhost:5001/upload
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development servers:**
   ```bash
   # Option 1: Run both frontend and local upload server
   npm run dev
   
   # Option 2: Run only the frontend (for production deployment)
   npm start
   ```
   
   The app will be available at [http://localhost:3000](http://localhost:3000).
   The local upload server will run at [http://localhost:5001](http://localhost:5001).

## Usage

- **Register a Component:**
  - Go to the "Register" tab, fill in component details, and register. This will mint an NFT and store metadata on IPFS.
- **Lookup a Component:**
  - Use the dashboard to enter a UUID or scan a QR code. View lifecycle, NFT certificate, and details.
- **View Analytics, Reports, and Traceability:**
  - Explore planned features for advanced supply chain insights.

## Architecture

- **Frontend:** React, ethers.js, recharts, react-icons, QR scanning, modern responsive UI.
- **Smart Contract:** Custom ERC-721 (soulbound) NFT for supply chain, written in Solidity.
- **IPFS Integration:** Stores NFT metadata and images.
- **Blockchain:** Polygon Amoy testnet, Chainlink for oracle/data integration.

## Project Structure

- `src/components/` – UI components (dashboard, registration, analytics, etc.)
- `src/services/` – Blockchain and IPFS integration logic
- `SupplyDNANFT_Custom.sol` – Solidity smart contract
- `public/` – Static assets and HTML

## Powered by

- Polygon Amoy
- Chainlink
- IPFS

---

*This project is an MVP and under active development. Planned features (traceability, analytics, reports) are being implemented.*
