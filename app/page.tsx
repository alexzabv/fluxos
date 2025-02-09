"use client";

import { useState, useMemo } from "react";
import { ChatWindow } from "@/components/ChatWindow";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import dynamic from "next/dynamic";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaAgentKit } from "solana-agent-kit"; // Import the SolanaAgentKit

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Initialize the SolanaAgentKit with the required endpoint or configuration string
const solanaSdk = new SolanaAgentKit("https://api.mainnet-beta.solana.com");

export default function Home() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [rounds, setRounds] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const handleCreateGibworkTask = async (newRound) => {
    try {
      const taskData = await solanaSdk.createGibworkTask(
        newRound.title,
        newRound.content,
        newRound.requirements,
        newRound.tags,
        newRound.tokenMintAddress,
        newRound.amount,
        newRound.payer
      );

      const task = {
        status: "success",
        taskId: taskData.taskId,
        signature: taskData.signature,
      };

      setRounds([...rounds, { ...newRound, task }]);
    } catch (error) {
      console.error("Error creating Gibwork task:", error);
    }
  };

  const handleSubmitRound = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRound = {
      title: formData.get("title"),
      content: formData.get("content"),
      requirements: formData.get("requirements"),
      tags: formData.get("tags").split(","),
      tokenMintAddress: formData.get("tokenMintAddress"),
      amount: parseFloat(formData.get("amount")),
      payer: formData.get("payer") || publicKey.toString(),
    };
    try {
      await handleCreateGibworkTask(newRound);
    } catch (error) {
      console.error("Error creating Gibwork task:", error);
    }
  };

  const handleSubmitTweet = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTweet = {
      tweetLink: formData.get("tweetLink"),
      fundingGoal: formData.get("fundingGoal"),
    };
    setTweets([...tweets, newTweet]);
  };

  const handleSubmitContract = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newContract = {
      contractAddress: formData.get("contractAddress"),
      fundingGoal: formData.get("fundingGoal"),
    };
    setContracts([...contracts, newContract]);
  };

  const handleSubmitProfile = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newProfile = {
      userProfile: formData.get("userProfile"),
      fundingGoal: formData.get("fundingGoal"),
    };
    setProfiles([...profiles, newProfile]);
  };

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        SolanaAgentKit + FluxOS.js 🦜🔗 + Next.js
      </h1>
      <ul>
        <li className="text-l">
          🤝
          <span className="ml-2">
            This template showcases a simple agent chatbot using{" "}
            <a href="https://https://www.solanaagentkit.xyz/">SolanaAgentKit</a>
            {", "}
            <a href="https://js.lfluxos.app/" target="_blank">
              FluxOS.js
            </a>{" "}
            and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            You can find the prompt and model logic for this use-case in{" "}
            <code>app/api/chat/route.ts</code>.
          </span>
        </li>
        <li className="hidden text-l md:block">
          🎨
          <span className="ml-2">
            The main frontend logic is found in <code>app/page.tsx</code>.
          </span>
        </li>
        <li className="text-l">
          🐙
          <span className="ml-2">
            This template is open source - you can see the source code and
            deploy your own version{" "}
            <a
             
              target="_blank"
            >
              from the GitHub repo
            </a>
            !
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            Try asking e.g. <code>What is my wallet address?</code> below!
          </span>
        </li>
      </ul>
      <a href="#dashboard">
        <button className="mt-4 p-2 bg-blue-500 text-white rounded">
          Go to Dashboard
        </button>
      </a>
    </div>
  );

  return (
    <ConnectionProvider endpoint={clusterApiUrl("mainnet-beta")}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-900 text-white">
            <ChatWindow
              endpoint="api/chat"
              emoji="🤖"
              titleText="Solana agent"
              placeholder="I'm your friendly Solana agent! Ask me anything..."
              emptyStateComponent={InfoCard}
            ></ChatWindow>

            <div className="container mx-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div id="submit-tweet" className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-2xl mb-4 text-center">Submit Tweet Link</h2>
                  <form onSubmit={handleSubmitTweet} className="space-y-4">
                    <div>
                      <label className="block mb-2">Tweet Link:</label>
                      <input
                        type="text"
                        name="tweetLink"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Funding Goal:</label>
                      <input
                        type="number"
                        name="fundingGoal"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Submit Tweet
                    </button>
                  </form>

                  <h2 className="text-xl mt-8 mb-4">Submitted Tweets</h2>
                  <ul className="space-y-4">
                    {tweets.map((tweet, index) => (
                      <li key={index} className="p-4 bg-gray-700 rounded">
                        <p><strong>Tweet Link:</strong> {tweet.tweetLink}</p>
                        <p><strong>Funding Goal:</strong> {tweet.fundingGoal}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="dashboard" className="bg-gray-800 p-6 rounded-lg">
                  <h1 className="text-3xl mb-6 text-center">Crowdfunding Dashboard</h1>
                  <WalletMultiButton />
                  <form onSubmit={handleSubmitRound} className="space-y-4 mt-4">
                    <div>
                      <label className="block mb-2">Title:</label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Content:</label>
                      <input
                        type="text"
                        name="content"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Requirements:</label>
                      <input
                        type="text"
                        name="requirements"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Tags:</label>
                      <input
                        type="text"
                        name="tags"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Token Mint Address:</label>
                      <input
                        type="text"
                        name="tokenMintAddress"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Amount:</label>
                      <input
                        type="number"
                        name="amount"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Payer (optional):</label>
                      <input
                        type="text"
                        name="payer"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Start Crowdfunding Round
                    </button>
                  </form>

                  <h2 className="text-2xl mt-8 mb-4">Active Crowdfunding Rounds</h2>
                  <ul className="space-y-4">
                    {rounds.map((round, index) => (
                      <li key={index} className="p-4 bg-gray-700 rounded">
                        <p><strong>Title:</strong> {round.title}</p>
                        <p><strong>Content:</strong> {round.content}</p>
                        <p><strong>Requirements:</strong> {round.requirements}</p>
                        <p><strong>Tags:</strong> {round.tags.join(", ")}</p>
                        <p><strong>Token Mint Address:</strong> {round.tokenMintAddress}</p>
                        <p><strong>Amount:</strong> {round.amount}</p>
                        <p><strong>Payer:</strong> {round.payer}</p>
                        <p><strong>Current Progress:</strong> {round.currentProgress}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="check-contract" className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-2xl mb-4 text-center">Check Contract Address</h2>
                  <form onSubmit={handleSubmitContract} className="space-y-4">
                    <div>
                      <label className="block mb-2">Contract Address:</label>
                      <input
                        type="text"
                        name="contractAddress"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Funding Goal:</label>
                      <input
                        type="number"
                        name="fundingGoal"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Check Contract
                    </button>
                  </form>

                  <h2 className="text-xl mt-8 mb-4">Checked Contracts</h2>
                  <ul className="space-y-4">
                    {contracts.map((contract, index) => (
                      <li key={index} className="p-4 bg-gray-700 rounded">
                        <p><strong>Contract Address:</strong> {contract.contractAddress}</p>
                        <p><strong>Funding Goal:</strong> {contract.fundingGoal}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="check-profile" className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-2xl mb-4 text-center">Check User Profile</h2>
                  <form onSubmit={handleSubmitProfile} className="space-y-4">
                    <div>
                      <label className="block mb-2">User Profile:</label>
                      <input
                        type="text"
                        name="userProfile"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Funding Goal:</label>
                      <input
                        type="number"
                        name="fundingGoal"
                        required
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Check Profile
                    </button>
                  </form>

                  <h2 className="text-xl mt-8 mb-4">Checked Profiles</h2>
                  <ul className="space-y-4">
                    {profiles.map((profile, index) => (
                      <li key={index} className="p-4 bg-gray-700 rounded">
                        <p><strong>User Profile:</strong> {profile.userProfile}</p>
                        <p><strong>Funding Goal:</strong> {profile.fundingGoal}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}