# 🔮 Farcaster Pulse

A Next.js MiniApp that provides trending Farcaster content with x402 micropayments for premium features.

## ✨ Features

### Free Tier
- 🔥 Trending Farcaster casts from popular creators
- 🎨 Viral Zora drops and NFT collections
- 📊 Basic engagement metrics
- 🔄 Real-time content updates

### Premium Tier (x402 Payments)
- 💎 Advanced trending analytics with quality scores
- 📈 Comprehensive engagement metrics and virality scores
- 🎯 Content categorization and sentiment analysis
- 👥 Creator performance analytics
- 📊 Network insights and viral pattern analysis
- ⏰ Optimal posting time recommendations

## 🚀 Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Base (Ethereum L2)
- **Wallet Integration**: Wagmi v2, Viem v2
- **MiniApp Framework**: Coinbase OnchainKit MiniKit
- **Payments**: x402 protocol with USDC
- **Farcaster API**: Neynar SDK
- **Data Fetching**: TanStack React Query

## 💳 x402 Payment Integration

This app implements the x402 payment protocol for seamless micropayments:

- **Payment Method**: USDC on Base
- **Premium Content**: $0.10 USDC for advanced trending analytics
- **Premium Insights**: $0.25 USDC for comprehensive ecosystem insights
- **Automatic Handling**: x402-axios automatically manages 402 Payment Required responses
- **Wallet Integration**: Uses wagmi's useWalletClient for secure payment authorization

### How x402 Works

1. User requests premium content
2. API returns 402 Payment Required with payment details
3. x402-axios detects the 402 response
4. User authorizes USDC payment through their wallet
5. Payment is processed on Base blockchain
6. API serves premium content with payment proof

## 🛠 Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- A Neynar API key ([get one here](https://neynar.com))
- A Coinbase OnchainKit API key
- USDC on Base for testing payments

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farcaster-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   ```env
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key
   NEYNAR_API_KEY=your_neynar_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Neynar API Setup

1. Sign up at [neynar.com](https://neynar.com)
2. Get your API key from the developer dashboard
3. Add it to your environment variables

### x402 Payment Configuration

The app is pre-configured for Base mainnet with USDC payments. To customize:

```typescript
// In app/hooks/useX402Payment.ts
const x402Axios = createX402Axios({
  account,
  maxPaymentAmount: '1.00', // Maximum payment per request
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})
```

### Payment Endpoints

- `GET /api/premium/casts` - Premium trending analytics ($0.10 USDC)
- `GET /api/premium/insights` - Comprehensive ecosystem insights ($0.25 USDC)

## 📱 MiniApp Integration

This app is built as a Farcaster MiniApp using Coinbase's MiniKit:

- **Frame Integration**: Can be embedded in Farcaster frames
- **Wallet Connection**: Seamless wallet integration within Farcaster
- **Native Feel**: Optimized for mobile Farcaster clients

## 🧪 Testing

### Testing x402 Payments

1. **Connect Wallet**: Ensure you have a wallet connected with USDC on Base
2. **Try Premium Features**: Click "Upgrade to Premium" to test the payment flow
3. **Verify Transactions**: Check Base block explorer for payment confirmations
4. **Error Handling**: Test with insufficient funds to verify error handling

### API Testing

Test the payment-protected endpoints directly:

```bash
# This will return 402 Payment Required
curl -X GET http://localhost:3000/api/premium/casts

# With x402-axios, payments are handled automatically
```

## 🏗 Architecture

### Data Flow

```
User Request → x402-axios → API Endpoint
                    ↓
              402 Payment Required?
                    ↓
              Wallet Authorization
                    ↓
              USDC Payment on Base
                    ↓
              Premium Content Served
```

### Key Components

- **`useX402Payment`**: Hook for x402 payment integration
- **`useFarcasterData`**: Free Farcaster content via Neynar
- **`usePremiumFarcasterData`**: Premium content with payments
- **`PaymentStatus`**: UI for payment status and error handling
- **Premium API Routes**: Payment-protected endpoints

## 🔒 Security

- **Payment Verification**: All payments verified on-chain
- **Error Handling**: Comprehensive error handling for payment failures
- **Rate Limiting**: Built-in protection against abuse
- **Wallet Security**: Uses wagmi's secure wallet integration

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Add all required env vars in Vercel dashboard
3. **Deploy**: Vercel will automatically deploy on push to main

### Environment Variables for Production

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=prod_key
NEXT_PUBLIC_NEYNAR_API_KEY=prod_key
NEYNAR_API_KEY=prod_key
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app
```

## 📊 Analytics & Monitoring

The premium tier provides detailed analytics:

- **Network Metrics**: Total engagement, user activity
- **Content Insights**: Category distribution, sentiment analysis
- **Creator Analytics**: Performance scores, engagement rates
- **Viral Patterns**: Trending thresholds, viral content analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially payment flows)
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: Open a GitHub issue
- **Farcaster**: Find us on Farcaster
- **Documentation**: Check the [x402 docs](https://docs.cdp.coinbase.com/x402/welcome)

## 🔮 Future Roadmap

- [ ] More payment tiers and features
- [ ] Advanced analytics dashboard
- [ ] Channel-specific trending feeds
- [ ] Creator monetization tools
- [ ] Multi-token payment support
- [ ] Real-time notifications

---

Built with ❤️ using x402, Base, and Farcaster
