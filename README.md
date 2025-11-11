# ⚡ NEON SYNDICATE - Complete PFP Collection Generator

A web-based tool for generating **complete cyberpunk/vaporwave PFP collections** using Together.ai's Flux models.

![Cyberpunk Banner](https://img.shields.io/badge/CYBERPUNK-VAPORWAVE-ff10f0?style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-READY-00ff00?style=for-the-badge)

## 🎨 Features

- **Complete PFP Generation**: Generates full character portraits (not trait layers)
- **3 Cyber-Factions** with unique aesthetics:
  - 💜 **Synthwave Collective** - Retro-futuristic vaporwave dreamers
  - 🔷 **Glitch Network** - Digital anarchists and data hackers
  - ⚡ **Neon Cartel** - Street samurai and corpo rebels

- **Tiered Rarity System**:
  - Common (65%) - Standard cyberpunk portraits
  - Uncommon (25%) - Enhanced with neon effects
  - Rare (8%) - Advanced cyber modifications  
  - Legendary (2%) - Unique godmode aesthetics

- **Consistent AI Prompting**: Tier-based prompts ensure style consistency
- **Scalable Generation**: Generate 100 to 5000 PFPs
- **Auto-Numbering**: Sequential numbering (1.png, 2.png, etc.)
- **Metadata Generation**: Creates Manifold-ready JSON for each PFP
- **Real-time Progress**: Visual progress bars and detailed logging
- **Batch Management**: Configurable batch sizes for optimal generation

## 🚀 Quick Start

### Prerequisites

1. **Together.ai API Key**
   - Sign up at [Together.ai](https://api.together.xyz/)
   - Get your API key from [Settings](https://api.together.xyz/settings/api-keys)
   - Free tier includes $25 credits!

2. **Vercel Account** (for deployment)
   - Sign up at [Vercel](https://vercel.com)

### Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/neon-syndicate-generator.git
cd neon-syndicate-generator

# Create .env file
cp .env.example .env

# Add your API key to .env
# TOGETHER_API_KEY=your_actual_key_here

# Install Vercel CLI
npm install -g vercel

# Run local dev server
vercel dev

# Open http://localhost:3000
```

## 📦 Deployment to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/neon-syndicate-generator.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repo
   - Vercel will auto-detect the configuration

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add: `TOGETHER_API_KEY` = `your_api_key_here`
   - Deploy!

### Method 2: Vercel CLI (Fast)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# When prompted, add environment variables:
# TOGETHER_API_KEY: your_api_key_here
```

### Setting Environment Variables in Vercel

**Via Dashboard:**
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `TOGETHER_API_KEY`
   - **Value**: `your_together_ai_api_key`
   - **Environment**: Production, Preview, Development (select all)
4. Click "Save"
5. Redeploy if needed

**Via CLI:**
```bash
vercel env add TOGETHER_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development
```

## 🎮 How to Use

1. **Select a Faction**
   - Click on Synthwave, Glitch, or Neon card
   - This determines the color palette and aesthetic

2. **Configure Collection**
   - Choose collection size (100-5000 PFPs)
   - Set batch size (how many to generate at once)
   - Set start number (default: 1)
   - Name your collection

3. **Start Generation**
   - Click "🚀 START GENERATION"
   - Watch real-time progress
   - PFPs are automatically numbered and tiered

4. **Download Collection**
   - Click "📥 DOWNLOAD COLLECTION"
   - Downloads all images as numbered PNGs (1.png, 2.png, etc.)
   - Downloads metadata JSON for each (1.json, 2.json, etc.)
   - Downloads collection manifest

5. **Upload to IPFS & Manifold**
   - Upload all images to IPFS (Pinata/NFT.Storage)
   - Update metadata with IPFS CID
   - Import to Manifold for minting

## 💰 Cost Breakdown

Using **Flux.1-schnell** model:

| Collection Size | Images | Cost per Image | Total Cost |
|----------------|--------|---------------|------------|
| Test (100 PFPs) | 100 | $0.003 | $0.30 |
| Small (500 PFPs) | 500 | $0.003 | $1.50 |
| Medium (1000 PFPs) | 1000 | $0.003 | $3.00 |
| Large (2500 PFPs) | 2500 | $0.003 | $7.50 |
| Full (5000 PFPs) | 5000 | $0.003 | $15.00 |

**Together.ai Free Tier**: $25 credits = Complete 5000 PFP collection + extras! 🔥

**Time Estimates**:
- 100 PFPs: ~5-10 minutes
- 500 PFPs: ~30-45 minutes
- 1000 PFPs: ~1-1.5 hours
- 5000 PFPs: ~4-6 hours

## 📁 Project Structure

```
neon-syndicate-generator/
├── api/
│   ├── generate.js          # Together.ai image generation endpoint
│   └── health.js            # API health check
├── index.html               # Main UI
├── collection-generator.js  # Generation logic & metadata creation
├── package.json             # Project metadata
├── vercel.json              # Vercel configuration
├── .env.example             # Environment variable template
└── README.md                # This file
```

## 🎨 Customization

### Change AI Model

Edit `collection-generator.js`:
```javascript
const CONFIG = {
    MODEL: "black-forest-labs/FLUX.1-schnell", // Fast & cheap
    // or
    MODEL: "black-forest-labs/FLUX.1-dev",     // Higher quality
    ...
};
```

### Adjust Faction Prompts

Edit `FACTION_PALETTES` in `collection-generator.js`:
```javascript
const FACTION_PALETTES = {
    synthwave: {
        colors: "your custom colors",
        lighting: "your lighting description",
        vibe: "your vibe"
    },
    ...
};
```

### Modify Tier Prompts

Edit `TIER_PROMPTS` in `collection-generator.js`:
```javascript
const TIER_PROMPTS = {
    common: {
        base: "your base prompt",
        details: "detail description",
        effects: "effects description"
    },
    ...
};
```

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI Model**: Together.ai Flux.1-schnell
- **Deployment**: Vercel

## 🐛 Troubleshooting

### "API Not Connected" Error
- Check that `TOGETHER_API_KEY` is set in Vercel environment variables
- Redeploy after adding environment variables
- Check API key is valid at Together.ai dashboard

### Images Not Generating
- Open browser console (F12) for errors
- Check Network tab for API responses
- Verify Together.ai has available credits

### Rate Limiting
- Add delays between generations (already implemented)
- Check Together.ai rate limits
- Consider upgrading Together.ai plan

## 📈 Next Steps After Generating Your Collection

1. **Upload Images to IPFS**
   - Use Pinata.cloud or NFT.Storage
   - Upload all numbered PNGs (1.png - 5000.png)
   - Get base CID for your collection

2. **Update Metadata**
   - Replace `ipfs://PLACEHOLDER/` in JSON files with actual CID
   - Example: `ipfs://QmYourActualCID/1.png`

3. **Deploy to Manifold**
   - Go to studio.manifold.xyz
   - Create new ERC721 contract
   - Import metadata
   - Configure minting parameters

4. **Launch Your Collection** 🚀
   - Set mint price
   - Configure whitelist (optional)  
   - Set reveal date
   - GO LIVE!

## 🎯 Alternative: Use Winions Framework

Want faction-based minting mechanics? Combine this generator with the Winions dice roller framework for gamified distribution!

## 🔗 Useful Links

- [Together.ai Docs](https://docs.together.ai/)
- [Flux Model Info](https://blackforestlabs.ai/)
- [Vercel Docs](https://vercel.com/docs)
- [Manifold Studio](https://studio.manifold.xyz/)

## 📝 License

MIT License - Feel free to use for your own NFT projects!

## 🎯 Built With

This generator uses the proven framework from the Winions dice roller project - adapted for AI-powered generative art creation!

---

**READY TO GENERATE CYBERPUNK PFPS! 🌆💜✨**

Questions? Need help? Open an issue or DM!
