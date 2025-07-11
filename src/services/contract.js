import { Contract, BrowserProvider } from "ethers";
import contractABI from "../SupplyDNANFT_ABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export async function getSupplyDNANFTContract() {
  if (!window.ethereum) throw new Error("MetaMask is required.");
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(contractAddress, contractABI, signer);
} 