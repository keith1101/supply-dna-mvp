# SupplyDNA NFT Contract Deployment Guide

## Prerequisites
- MetaMask wallet with testnet ETH (Sepolia recommended)
- Remix IDE (https://remix.ethereum.org)

## Step 1: Deploy Smart Contract

### 1.1 Open Remix IDE
- Go to https://remix.ethereum.org
- Create a new file called `SupplyDNANFT.sol`
- Copy the contract code from `SupplyDNANFT.sol` in this project

### 1.2 Install OpenZeppelin Contracts
- In Remix, go to the "Package Manager" plugin
- Search for "@openzeppelin/contracts"
- Install version ^4.9.0 or later

### 1.3 Compile Contract
- Go to the "Solidity Compiler" plugin
- Set compiler version to 0.8.19 or later
- Click "Compile SupplyDNANFT.sol"
- Ensure no errors in compilation

### 1.4 Deploy Contract
- Go to the "Deploy & Run Transactions" plugin
- Set environment to "Injected Provider - MetaMask"
- Connect your MetaMask wallet
- Select "SupplyDNANFT" from the contract dropdown
- Click "Deploy"
- Confirm transaction in MetaMask

### 1.5 Get Contract Address
- After deployment, copy the contract address
- This will be your `REACT_APP_CONTRACT_ADDRESS`

## Step 2: Configure Frontend

### 2.1 Update Environment Variables
Create or update your `.env` file:
```
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

### 2.2 Update Contract ABI
The ABI is already updated in the components, but verify it matches your deployed contract.

## Step 3: Test the Integration

### 3.1 Test Registration
1. Open your React app
2. Go to "Register" tab
3. Fill in component details
4. Click "Register with NFT"
5. Confirm MetaMask transaction
6. Verify NFT is created

### 3.2 Test Lookup
1. Go to Dashboard
2. Enter a component ID that was registered
3. Verify NFT display appears
4. Check metadata and blockchain explorer link

## Step 4: Verify on Blockchain Explorer

### 4.1 Check Contract
- Go to https://sepolia.etherscan.io (or your network's explorer)
- Search for your contract address
- Verify contract is deployed and verified

### 4.2 Check NFT
- Look for "Token" tab in contract explorer
- Verify NFTs are minted
- Check metadata URIs

## Troubleshooting

### Common Issues:

1. **"MetaMask is required"**
   - Install MetaMask browser extension
   - Connect to correct network (Sepolia recommended)

2. **"Transaction failed"**
   - Ensure you have enough testnet ETH
   - Check gas limit (should auto-calculate)
   - Verify you're the contract owner

3. **"Component not found"**
   - Verify component was registered successfully
   - Check contract address in .env file
   - Ensure you're on the correct network

4. **NFT metadata not loading**
   - Check browser console for IPFS errors
   - Verify metadata URI format
   - Try different IPFS gateways

### Network Configuration:
- **Sepolia Testnet**: Recommended for testing
- **Mainnet**: For production (requires real ETH)
- **Local Network**: For development

## Advanced Features

### Soulbound NFTs
The contract includes soulbound functionality - NFTs cannot be transferred, only minted. This ensures:
- Components can't be traded
- Authenticity is preserved
- Traceability is maintained

### Metadata Updates
Only the contract owner can update metadata URIs using the `updateMetadata` function.

### IPFS Integration
The frontend simulates IPFS upload. For production:
- Use Pinata or Infura IPFS
- Implement proper IPFS upload
- Add file upload functionality

## Security Considerations

1. **Access Control**: Only owner can register components
2. **Non-transferable**: NFTs are soulbound to prevent trading
3. **Metadata Integrity**: Stored on IPFS for decentralization
4. **Gas Optimization**: Efficient contract design

## Next Steps

1. **Production Deployment**: Deploy to mainnet
2. **IPFS Integration**: Implement real IPFS upload
3. **Role Management**: Add multiple user roles
4. **Event Logging**: Implement comprehensive event tracking
5. **UI Enhancements**: Add more NFT display features 