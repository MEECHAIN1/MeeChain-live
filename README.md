# ⚡ MeeChain.Network

<img width="2048" height="1152" alt="1000185130" src="https://github.com/user-attachments/assets/d1db280c-b730-468d-9f93-7094b096d9df" />

``MeeChain Network is a high-performance, mystical dashboard designed for the MeeChain ecosystem. It enables verified collective members to monitor telemetry, participate in staking rituals, and visualize their mechanical asset galleries.``

## 🚀 The Ritual of Initiation (Setup)

### 1. Clone & Prepare
```bash
git clone https://github.com/meechain1/meechain-live.git
cd meechain-live
npm install
```

### 2. Configure Energy Vectors (.env)
Create a `.env` file with the following coordinates:
```env
VITE_RPC_URL=http://127.0.0.1:8545
VITE_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_STAKING_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
VITE_MARKETPLACE_ADDRESS=0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
VITE_EXPLORER_URL=https://scan.meechain.io
VITE_WALLETCONNECT_ID=b0d81328f8ab0541fdede7db9ff25cb1
VITE_CHAIN_ID=1337
```

### 3. Channel the Local Stream
```bash
npm run dev
```

---

## 📂 Project Structure

```text
src/
  abi/                # Minimalized Ritual ABIs
  lib/
    contracts.ts      # Mystical Address & ABI Mapping
    viemClient.ts     # Resilient RPC Connectivity
    services/         # Interaction Logic (NFT/Token/Staking)
  context/
    AppState.tsx      # Global Telemetry State
  pages/
    DashboardPage.tsx # Fleet Monitoring
    StakingPage.tsx   # Asset Commitment (The Vault)
    GalleryPage.tsx   # Mechanical Visualization
    EventLogPage.tsx  # The Eternal Ledger
```

## 🌐 Ascension (Deployment)

Deploying to Vercel or Netlify ensures the ritual is accessible globally:
1. Set the **Environment Variables** in your deployment dashboard.
2. The CI/CD pipeline will automatically build and smoke-test the protocol.
3. Verify the **BigInt** handling is consistent across the production build.

---

## 🤝 Contribution Rituals

1. **Naming:** Use lowercase keys (nft, token, staking) for consistency.
2. **Icons:** Use emoji-powered feedback (⚡ 💎 📥 🎉).
3. **Safety:** Always wrap contract reads in `try/catch` with mock fallbacks to prevent telemetry blackout.

---

## 🎯 Mystical Roadmap
- [x] Resilient RPC Fallbacks
- [x] Elite Compact UI (Vault V3.1)
- [x] BigInt-safe Serialization
- [x] Event Streaming & Ritual Logs
- [x] AI-Powered Oracle (Gemini Integration)
- [x] Multi-Chain Telemetry

---
&copy; 2025 **MEEBOT_PROTOCOL_V3.1.4** ⚡
