<p align="center">
<img width="auto" height="auto" src="https://github.com/user-attachments/assets/b3905ff2-db2f-44d5-ae57-669544f88ff4">
</p>

## Solana Rug Checker  

`FluxOS` is a TypeScript-based tool designed to monitor new token creation events within the **Raydium** decentralized exchange ecosystem on the **Solana blockchain**. It also evaluates the rug pull risk of these tokens.  

The tool listens to blockchain logs to detect new token signatures associated with Raydium's liquidity pools, stores relevant data (e.g., creator information and token balances), and performs automated risk analysis to help identify potentially fraudulent tokens.  

---

## Potential Use Case: Sniper Bot Development  

`FluxOS` is a powerful tool for developing a **Sniper Bot**. By monitoring **newly created tokens** and assessing their rug pull risk, users can confidently act on early token listings. This combination of real-time detection and risk evaluation is essential for safer and more effective Sniper Bot strategies.  

---

## Features  

- **Monitors New Tokens**  
  Tracks new token creation events on Solana by analyzing transaction logs associated with Raydium liquidity pools.  

- **Rug Pull Risk Analysis**  
  Uses custom api endpoint to evaluate the safety and legitimacy of newly detected tokens.  

- **Data Storage**  
  Collects and stores key details, including:  
  - **Creator Wallet Address**  
  - **Safety Score**  
  - **Transaction Signatures**  

- **Blockchain Integration**  
  Built using `@solana/web3.js` for efficient interaction with the Solana network.  

- **Error Handling and Logging**  
  Ensures reliable operation with robust error management and detailed logging.  

---

## Prerequisites

Before using this tool, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended version: `v14.x` or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for package management)

---

## Installation

Follow these steps to set up the Solana Token Tracker project on your local machine:

### 1. Clone the Repository
   ```bash
   git clone https://github.com/remarziano/fluxos/tree/main
   cd fluxos
   ```

### 2. Install Dependencies
```bash
npm install
npm install dotenv
```

### 3. Configure RPC Endpoint
Create a `.env` file in the project root:
```env
# Mainnet RPC Endpoint (recommended)
RPC_ENDPOINT=https://mainnet.helius-rpc.com/?api-key=your-api-key
RPC_WEBSOCKET_ENDPOINT=wss://mainnet.helius-rpc.com/?api-key=your-api-key
```

> **💡 Pro Tip:** 
> - Obtain an API key from Helius or another Solana RPC provider for optimal performance
> - Default RPC endpoints are available as fallback options

### 4. Run the Project
```bash
npx tsx src/index.ts
```

## Troubleshooting

### Common Issues
- **Installing tsx Globally (Optional)**:
  ```bash
  npm install -g tsx
  ```
- **Dependency Conflicts**: 
  ```bash
  npm cache clean --force
  npm install
  ```
- Ensure you're running the latest version of Node.js
- Check your Solana RPC endpoint configuration
- Verify that `tsx` is correctly installed and configured

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source. Please check the LICENSE file for details.
