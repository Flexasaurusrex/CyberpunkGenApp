# 🚀 QUICK DEPLOYMENT GUIDE

## 📋 WHAT YOU HAVE:
✅ `index.html` - Main UI
✅ `collection-generator.js` - Generation logic & metadata
✅ `api/generate.js` - Image generation endpoint
✅ `api/health.js` - Health check endpoint
✅ `.env.example` - Environment variable template
✅ `package.json` - Project config
✅ `vercel.json` - Vercel config
✅ `.gitignore` - Git ignore rules
✅ `README.md` - Full documentation

---

## ⚡ 5-MINUTE DEPLOYMENT:

### Step 1: Create GitHub Repo
```bash
# In your project folder:
git init
git add .
git commit -m "Neon Syndicate Collection Generator"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/neon-syndicate.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. **Import** your GitHub repo
4. Vercel auto-detects configuration ✅
5. Click **"Deploy"**

### Step 3: Add Together.ai API Key
**CRITICAL: Add your API key to Vercel!**

1. In Vercel Dashboard → Your Project → **Settings**
2. Click **"Environment Variables"**
3. Add new variable:
   - **Name**: `TOGETHER_API_KEY`
   - **Value**: `your_actual_together_ai_key_here`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **"Save"**
5. **Redeploy**: Go to Deployments → Latest → **"Redeploy"**

---

## 🔑 GET YOUR TOGETHER.AI API KEY:

1. Go to https://api.together.xyz/
2. Sign up (free $25 credits - enough for 5000+ PFPs!)
3. Go to https://api.together.xyz/settings/api-keys
4. Click **"Create API Key"**
5. Copy the key → Paste in Vercel environment variables

---

## ✅ VERIFY IT'S WORKING:

After deployment, visit your Vercel URL:

1. You should see: **"✅ API Connected"** in green at top
2. Select a faction (card should glow)
3. Set collection size to 100 (for testing)
4. Click **"🚀 START GENERATION"**
5. Watch the magic happen! ✨

If "❌ API Not Connected":
- Double-check API key in Vercel settings
- Make sure you redeployed after adding key
- Check Together.ai dashboard for valid key

---

## 💰 COST ESTIMATE:

Using **Flux.1-schnell**:
- Test (100 PFPs): **$0.30**
- Full collection (5000 PFPs): **$15.00**
- Free tier gets you the FULL COLLECTION plus extras! 🔥

---

## 🎯 WORKFLOW:

### Phase 1: Test Generation (10 minutes)
1. ✅ Deploy to Vercel
2. ✅ Add API key
3. ✅ Generate 100 test PFPs
4. ✅ Check quality and consistency

### Phase 2: Full Generation (4-6 hours)
1. 🔥 Generate 5000 complete collection
2. 📥 Download all PNGs + metadata
3. 🎨 Review and curate

### Phase 3: Deploy NFTs (1-2 days)
1. 📦 Upload to IPFS (Pinata/NFT.Storage)
2. 🔧 Update metadata with IPFS CIDs
3. 🚀 Deploy to Manifold
4. 💰 LAUNCH & MINT!

---

## 🧪 TESTING CHECKLIST:

Before generating 5000:
- [ ] Test with 10 PFPs first
- [ ] Check each faction's aesthetic
- [ ] Verify tier consistency (common vs legendary)
- [ ] Ensure numbering is correct
- [ ] Test metadata format
- [ ] Confirm style consistency

If happy with tests:
- [ ] Scale to full 5000 collection
- [ ] Let it run (takes 4-6 hours)
- [ ] Download everything
- [ ] Upload to IPFS
- [ ] Deploy to Manifold

---

## 🆘 TROUBLESHOOTING:

**"API Not Connected"**
→ Add `TOGETHER_API_KEY` to Vercel env vars, redeploy

**"Generation Failed"**
→ Check Together.ai credits at https://api.together.xyz/settings/billing

**Inconsistent Style**
→ Adjust prompts in `collection-generator.js` TIER_PROMPTS

**Wrong Numbering**
→ Check "Start Number" setting in UI

**Download Not Working**
→ Check browser's download settings (allow multiple downloads)

---

## 📞 SUPPORT:

- Together.ai Docs: https://docs.together.ai/
- Vercel Docs: https://vercel.com/docs
- Manifold Docs: https://docs.manifold.xyz/
- Check README.md for full documentation

---

**YOU'RE READY TO GENERATE A COMPLETE CYBERPUNK PFP COLLECTION! 🌆💜✨**

Just follow the 3 steps above and you'll be generating in 5 minutes! 🚀

Then sit back, relax, and let the AI create your entire 5000 PFP collection while you grab a coffee! ☕
