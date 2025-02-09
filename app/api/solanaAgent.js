import { SolanaAgentKit, createSolanaTools } from "solana-agent-kit";
import { Connection, PublicKey, clusterApiUrl, Keypair } from "@solana/web3.js";
import bs58 from 'bs58';
import { Buffer } from 'buffer';

/**
 * Converts a comma-separated string to a Uint8Array.
 * @param {string} key - The private key as a comma-separated string.
 * @returns {Uint8Array} - The private key as a Uint8Array.
 */
const parsePrivateKey = (key) => {
  const keyArray = key.split(',').map(num => parseInt(num, 10));
  if (keyArray.length !== 64) {
    throw new Error("Invalid secret key length. Expected 64 bytes.");
  }
  return Uint8Array.from(keyArray);
};

const privateKeyBase58 = "44caej1QeFLNtwvnFFBnaGFTbnK5VB92nCUuz4YtvBqqfUaoBwiewBLqALbfYZqaKWvop7xs4ELTWB2kiRgZHNCV";
const privateKeyUint8 = bs58.decode(privateKeyBase58);
console.log(privateKeyUint8.length); // Should be 64



const privateKey = parsePrivateKey([176,50,7,233,56,56,152,24,74,138,228,190,32,42,153,167,75,126,116,72,100,177,126,245,177,7,202,185,83,86,120,128,170,51,241,109,115,173,75,164,43,113,217,201,33,129,98,25,121,231,36,190,50,189,73,213,86,170,245,255,11,44,236,165]);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Initialize Solana Agent Kit with the Keypair and connection
const solanaAgent = new SolanaAgentKit(Keypair.fromSecretKey(privateKey), connection);

// Create tools using Solana Agent Kit
const tools = createSolanaTools(solanaAgent);

/**
 * Starts a new crowdfunding round.
 * @param {string} tweetLink - Link to the tweet.
 * @param {string} contractAddress - Contract address.
 * @param {string} userProfile - User profile.
 * @param {number} fundingGoal - Funding goal in SOL.
 * @returns {Promise<string>} - The public key of the new round.
 */
export const startRound = async (tweetLink, contractAddress, userProfile, fundingGoal) => {
  try {
    const round = Keypair.generate();
    await tools.createRound({
      round,
      tweetLink,
      contractAddress,
      userProfile,
      fundingGoal: fundingGoal * 1e9, // Convert SOL to lamports
    });
    return round.publicKey.toString();
  } catch (error) {
    console.error("Error starting round:", error);
    throw error;
  }
};

/**
 * Contributes to an existing crowdfunding round.
 * @param {string} roundId - Public key of the round.
 * @param {number} amount - Amount to contribute in SOL.
 */
export const contribute = async (roundId, amount) => {
  try {
    await tools.contribute({
      roundId: new PublicKey(roundId),
      amount: amount * 1e9, // Convert SOL to lamports
    });
  } catch (error) {
    console.error("Error contributing:", error);
    throw error;
  }
};

/**
 * Invests funds from a crowdfunding round into yield-bearing protocols.
 * @param {string} roundId - Public key of the round.
 */
export const investFunds = async (roundId) => {
  try {
    await tools.investFunds({
      roundId: new PublicKey(roundId),
    });
  } catch (error) {
    console.error("Error investing funds:", error);
    throw error;
  }
};

/**
 * Returns funds to contributors if the round is unsuccessful.
 * @param {string} roundId - Public key of the round.
 */
export const returnFunds = async (roundId) => {
  try {
    await tools.returnFunds({
      roundId: new PublicKey(roundId),
    });
  } catch (error) {
    console.error("Error returning funds:", error);
    throw error;
  }
};