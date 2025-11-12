// Neon Syndicate - Complete PFP Collection Generator
// Generates complete PFPs (not layers) with consistent prompting

// Configuration
const CONFIG = {
    MODEL: "black-forest-labs/FLUX.1-schnell",
    API_ENDPOINT: "/api/generate",
    COST_PER_IMAGE: 0.003, // $0.003 per image
    IMAGE_SIZE: 1024
};

// State Management
let selectedFaction = null;
let isGenerating = false;
let shouldStop = false;
let generatedPFPs = [];
let startTime = null;
let timerInterval = null;

// Rarity Distribution
const RARITY_DISTRIBUTION = {
    common: 0.65,      // 65%
    uncommon: 0.25,    // 25%
    rare: 0.08,        // 8%
    legendary: 0.02    // 2%
};

// Faction-Specific Animal Spirit Themes - CHINESE MYTHOLOGY
const FACTION_THEMES = {
    synthwave: {
        name: "Synthwave Collective",
        colors: "vibrant pink, deep purple, electric cyan, hot magenta",
        lighting: "dramatic neon pink and purple lighting with sharp cyan highlights, ethereal glow",
        vibe: "celestial vaporwave spirits, mystical anime aesthetic",
        animals: {
            common: ["celestial crane", "moon rabbit", "cloud serpent"],
            uncommon: ["phoenix fledgling", "sky fox", "celestial tiger"],
            rare: ["azure phoenix", "nine-tailed fox", "astral qilin"],
            legendary: ["cosmic phoenix god", "celestial dragon emperor", "divine kirin overlord"]
        }
    },
    glitch: {
        name: "Glitch Network",
        colors: "toxic green, electric blue, stark white, deep black",
        lighting: "harsh green and blue holographic lighting with digital aura, matrix glow",
        vibe: "digital spirit hackers, corrupted mythological beasts",
        animals: {
            common: ["data serpent", "cyber wolf", "glitch raven"],
            uncommon: ["corrupted dragon", "digital tiger", "matrix fox"],
            rare: ["glitch qilin", "void dragon", "corrupted phoenix"],
            legendary: ["digital dragon god", "matrix leviathan", "glitch deity beast"]
        }
    },
    neon: {
        name: "Neon Cartel",
        colors: "blood red, burning orange, molten gold, deep crimson",
        lighting: "intense red and orange neon with golden rim lighting, warrior glow",
        vibe: "warrior spirits, battle-hardened mythical beasts",
        animals: {
            common: ["street tiger", "urban wolf", "crimson serpent"],
            uncommon: ["battle dragon", "warrior phoenix", "combat qilin"],
            rare: ["war god tiger", "blood dragon", "infernal phoenix"],
            legendary: ["dragon war deity", "supreme battle beast", "legendary warrior spirit"]
        }
    }
};

// Faction-Specific Tier Prompts - ANIMAL SPIRITS
const FACTION_TIER_PROMPTS = {
    synthwave: {
        common: {
            creatures: "celestial crane spirit, moon rabbit yokai, cloud serpent",
            style: "elegant celestial spirit portrait, mystical anime art, flowing ethereal design",
            details: "graceful features, gentle glow, soft spiritual energy, delicate patterns, calm expression",
            effects: "soft neon glow, ethereal mist, floating sparkles, dreamy atmosphere"
        },
        uncommon: {
            creatures: "phoenix fledgling spirit, sky fox yokai, celestial tiger guardian",
            style: "mystical spirit warrior portrait, detailed anime art, dynamic ethereal composition",
            details: "sharp spiritual features, glowing eyes, energy wisps, mystical markings, fierce yet elegant",
            effects: "vibrant neon aura, swirling energy, magical particles, ethereal flames"
        },
        rare: {
            creatures: "azure phoenix deity, nine-tailed celestial fox, astral qilin guardian",
            style: "divine spirit beast portrait, premium anime art, epic mystical composition",
            details: "majestic features, blazing eyes, powerful energy manifestation, intricate divine patterns, commanding presence",
            effects: "intense ethereal glow, reality ripples, cosmic energy, divine aura, floating celestial elements"
        },
        legendary: {
            creatures: "cosmic phoenix god emperor, celestial dragon sovereign, divine kirin overlord",
            style: "godlike spirit deity portrait, masterwork anime art, transcendent mystical composition",
            details: "supreme divine features, universe-reflecting eyes, reality-bending energy, ultimate mystical patterns, overwhelming divine presence",
            effects: "maximum ethereal effects, dimensional tears, cosmic manifestation, godlike aura, celestial apocalypse"
        }
    },
    glitch: {
        common: {
            creatures: "data serpent spirit, cyber wolf yokai, glitch raven",
            style: "corrupted digital spirit portrait, technical anime art, glitchy composition",
            details: "sharp digital features, flickering form, data streams, circuit patterns, intense gaze",
            effects: "digital glitches, data artifacts, scan lines, matrix code drips"
        },
        uncommon: {
            creatures: "corrupted dragon spirit, digital tiger hunter, matrix fox phantom",
            style: "advanced digital beast portrait, detailed glitch anime art, dynamic corrupted composition",
            details: "fractured features, glowing neon eyes, corrupted energy, complex circuit patterns, predatory stance",
            effects: "heavy glitch effects, reality corruption, digital tears, matrix rain, electromagnetic aura"
        },
        rare: {
            creatures: "glitch qilin destroyer, void dragon phantom, corrupted phoenix entity",
            style: "elite digital deity portrait, premium glitch anime art, epic corrupted composition",
            details: "reality-glitched features, void-filled eyes, massive data corruption, intricate digital destruction, overwhelming tech presence",
            effects: "extreme glitch distortion, reality fragmentation, digital apocalypse, void rifts, matrix implosion"
        },
        legendary: {
            creatures: "digital dragon god virus, matrix leviathan supreme, glitch deity overlord",
            style: "godlike digital entity portrait, masterwork glitch anime art, transcendent corrupted composition",
            details: "universe-corrupting features, black hole eyes, total reality breakdown, ultimate digital supremacy, apocalyptic tech god",
            effects: "maximum glitch apocalypse, dimension corruption, digital singularity, reality deletion, matrix godmode"
        }
    },
    neon: {
        common: {
            creatures: "street tiger warrior, urban wolf fighter, crimson serpent hunter",
            style: "fierce spirit warrior portrait, battle anime art, aggressive composition",
            details: "scarred features, burning eyes, battle aura, war markings, warrior stance",
            effects: "flame trails, heat distortion, blood mist, warrior energy"
        },
        uncommon: {
            creatures: "battle dragon champion, warrior phoenix striker, combat qilin soldier",
            style: "elite battle spirit portrait, detailed war anime art, dynamic combat composition",
            details: "battle-hardened features, blazing warrior eyes, intense combat energy, complex war patterns, battle-ready presence",
            effects: "intense flame aura, explosive energy, battle aftermath, warrior spirit manifestation"
        },
        rare: {
            creatures: "war god tiger general, blood dragon warlord, infernal phoenix destroyer",
            style: "legendary battle deity portrait, premium war anime art, epic combat composition",
            details: "godlike warrior features, inferno eyes, overwhelming battle power, intricate war god patterns, apocalyptic combat presence",
            effects: "maximum battle effects, reality-burning flames, war god aura, explosive destruction, battlefield apocalypse"
        },
        legendary: {
            creatures: "dragon war deity emperor, supreme battle beast god, legendary warrior spirit overlord",
            style: "ultimate war god portrait, masterwork battle anime art, transcendent combat composition",
            details: "supreme warrior deity features, universe-destroying eyes, absolute battle supremacy, ultimate war god patterns, omnipotent warrior presence",
            effects: "godlike battle apocalypse, dimension-shattering power, war god singularity, reality combustion, ultimate warrior transcendence"
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeFactionSelection();
    checkAPIConnection();
    updateTargetDisplay();
});

// Faction Selection
function initializeFactionSelection() {
    const factionCards = document.querySelectorAll('.faction-card');
    
    factionCards.forEach(card => {
        card.addEventListener('click', () => {
            factionCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedFaction = card.dataset.faction;
            logStatus(`🎯 Selected faction: ${selectedFaction.toUpperCase()}`, 'success');
        });
    });
}

// Check API Connection
async function checkAPIConnection() {
    const statusEl = document.getElementById('apiStatus');
    
    try {
        const response = await fetch('/api/health');
        
        if (response.ok) {
            statusEl.textContent = '✅ API Connected';
            statusEl.className = 'api-status connected';
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        statusEl.textContent = '❌ API Not Connected';
        statusEl.className = 'api-status disconnected';
        console.error('API connection error:', error);
    }
}

// Update Target Display
function updateTargetDisplay() {
    const size = parseInt(document.getElementById('collectionSize').value);
    document.getElementById('totalTarget').textContent = size;
    
    // Calculate tier counts
    const commons = Math.floor(size * RARITY_DISTRIBUTION.common);
    const uncommons = Math.floor(size * RARITY_DISTRIBUTION.uncommon);
    const rares = Math.floor(size * RARITY_DISTRIBUTION.rare);
    const legendaries = size - commons - uncommons - rares; // Remaining
    
    document.getElementById('commonsCount').textContent = `0/${commons}`;
    document.getElementById('uncommonsCount').textContent = `0/${uncommons}`;
    document.getElementById('raresCount').textContent = `0/${rares}`;
    document.getElementById('legendariesCount').textContent = `0/${legendaries}`;
    
    const cost = (size * CONFIG.COST_PER_IMAGE).toFixed(2);
    document.getElementById('costEstimate').textContent = `$${cost}`;
}

// Listen to collection size changes
document.getElementById('collectionSize').addEventListener('change', updateTargetDisplay);

// Determine Tier Based on Progress
function determineTier(index, total) {
    const progress = index / total;
    
    if (progress < RARITY_DISTRIBUTION.common) {
        return 'common';
    } else if (progress < RARITY_DISTRIBUTION.common + RARITY_DISTRIBUTION.uncommon) {
        return 'uncommon';
    } else if (progress < 1 - RARITY_DISTRIBUTION.legendary) {
        return 'rare';
    } else {
        return 'legendary';
    }
}

// Build Faction-Specific Prompt for Animal Spirits
function buildPrompt(tier, index) {
    if (!selectedFaction) {
        throw new Error('No faction selected');
    }
    
    const faction = FACTION_THEMES[selectedFaction];
    const tierPrompts = FACTION_TIER_PROMPTS[selectedFaction][tier];
    
    // Select random creature from tier
    const creatureList = tierPrompts.creatures.split(', ');
    const creature = creatureList[Math.floor(Math.random() * creatureList.length)];
    
    // Build comprehensive Chinese mythology animal spirit prompt
    let prompt = `${creature} portrait, Chinese mythology spirit beast, ${tierPrompts.style}, `;
    prompt += `${tierPrompts.details}, `;
    prompt += `${faction.colors} color palette, `;
    prompt += `${faction.lighting}, `;
    prompt += `${tierPrompts.effects}, `;
    prompt += `${faction.vibe}, `;
    
    // Core anime style anchors for mythological creatures
    prompt += `dark anime art style, yokai illustration, mythological beast anime, `;
    prompt += `sharp detailed lineart, dramatic anime eyes, epic creature design, `;
    prompt += `Chinese mythology aesthetic, spirit beast portrait, `;
    prompt += `professional anime illustration, legendary creature art, `;
    prompt += `mystical anime style, deity portrait composition, `;
    prompt += `creature facing forward, powerful presence, shoulders/head visible, `;
    prompt += `cinematic anime composition, badass mythological design`;
    
    // Negative prompt - AVOID human features and cartoon style
    const negativePrompt = `human, person, humanoid, human face, human body, ` +
                          `cartoon, western cartoon, pixar, disney, chibi, cute, kawaii, soft, ` +
                          `rounded features, simplified, children's art, cel shaded, flat colors, ` +
                          `blurry, low quality, 3D render, photograph, realistic photo, ` +
                          `ugly, distorted, deformed, watermark, text, signature, ` +
                          `multiple creatures, duplicate, bad anatomy, bad proportions, ` +
                          `oversaturated, overexposed, amateur, sketch, unfinished, ` +
                          `furry, anthro, anime girl, anime boy, wings only, head only`;
    
    return { prompt, negativePrompt };
}

// Generate Single PFP
async function generatePFP(index, tier) {
    try {
        const promptData = buildPrompt(tier, index);
        const seed = 1000 + index; // Sequential seeds for consistency variation
        
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                prompt: promptData.prompt,
                negative_prompt: promptData.negativePrompt,
                width: CONFIG.IMAGE_SIZE,
                height: CONFIG.IMAGE_SIZE,
                steps: 4,
                seed: seed
            })
        });
        
        if (!response.ok) {
            throw new Error(`Generation failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        const imageData = `data:image/png;base64,${data.image}`;
        
        // Create metadata
        const collectionName = document.getElementById('collectionName').value;
        const metadata = {
            name: `${collectionName} #${index}`,
            description: `A ${tier} tier cyberpunk PFP from the ${selectedFaction} faction of the ${collectionName} collection`,
            image: `ipfs://PLACEHOLDER/${index}.png`, // Will be updated after IPFS upload
            attributes: [
                {
                    trait_type: "Faction",
                    value: selectedFaction.charAt(0).toUpperCase() + selectedFaction.slice(1)
                },
                {
                    trait_type: "Rarity",
                    value: tier.charAt(0).toUpperCase() + tier.slice(1)
                },
                {
                    trait_type: "Generation",
                    value: index
                }
            ]
        };
        
        const pfp = {
            id: index,
            tier: tier,
            imageData: imageData,
            metadata: metadata,
            filename: `${index}.png`,
            metadataFilename: `${index}.json`
        };
        
        generatedPFPs.push(pfp);
        return pfp;
        
    } catch (error) {
        logStatus(`❌ Error generating #${index}: ${error.message}`, 'error');
        throw error;
    }
}

// Start Generation
async function startGeneration() {
    if (!selectedFaction) {
        alert('⚠️ Please select a faction first!');
        return;
    }
    
    if (isGenerating) {
        alert('⚠️ Generation already in progress!');
        return;
    }
    
    const collectionSize = parseInt(document.getElementById('collectionSize').value);
    const batchSize = parseInt(document.getElementById('batchSize').value);
    const startNumber = parseInt(document.getElementById('startNumber').value);
    
    const confirmed = confirm(
        `🚀 START GENERATION?\n\n` +
        `Collection: ${collectionSize} PFPs\n` +
        `Faction: ${selectedFaction.toUpperCase()}\n` +
        `Cost: ~$${(collectionSize * CONFIG.COST_PER_IMAGE).toFixed(2)}\n\n` +
        `This will take approximately ${Math.ceil(collectionSize / batchSize * 2)} minutes.\n\n` +
        `Continue?`
    );
    
    if (!confirmed) return;
    
    // Setup
    isGenerating = true;
    shouldStop = false;
    generatedPFPs = [];
    startTime = Date.now();
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('progressSection').style.display = 'block';
    
    logStatus(`🚀 Starting generation of ${collectionSize} PFPs...`, 'success');
    logStatus(`🎨 Faction: ${selectedFaction.toUpperCase()}`, 'success');
    
    startTimer();
    
    // Generation loop
    try {
        for (let i = 0; i < collectionSize; i++) {
            if (shouldStop) {
                logStatus('⚠️ Generation stopped by user', 'error');
                break;
            }
            
            const currentNumber = startNumber + i;
            const tier = determineTier(i, collectionSize);
            
            try {
                await generatePFP(currentNumber, tier);
                
                // Update stats
                updateStats(currentNumber, collectionSize, tier);
                updateProgress(i + 1, collectionSize);
                
                // Add to preview (last 20)
                if (generatedPFPs.length <= 20 || i >= collectionSize - 20) {
                    addToPreview(generatedPFPs[generatedPFPs.length - 1]);
                }
                
                logStatus(`✅ Generated #${currentNumber} (${tier})`, 'success');
                
                // Delay between generations to avoid rate limiting
                if (i < collectionSize - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
            } catch (error) {
                logStatus(`❌ Failed to generate #${currentNumber}: ${error.message}`, 'error');
                // Continue with next one instead of stopping
            }
        }
        
        if (!shouldStop) {
            logStatus(`🎉 GENERATION COMPLETE! Created ${generatedPFPs.length} PFPs!`, 'success');
            document.getElementById('downloadBtn').disabled = false;
        }
        
    } catch (error) {
        logStatus(`❌ Critical error: ${error.message}`, 'error');
    }
    
    // Cleanup
    isGenerating = false;
    shouldStop = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    stopTimer();
}

// Stop Generation
function stopGeneration() {
    if (confirm('⚠️ Stop generation? Progress will be saved.')) {
        shouldStop = true;
        logStatus('⚠️ Stopping generation...', 'error');
    }
}

// Update Stats
function updateStats(current, total, tier) {
    document.getElementById('generatedCount').textContent = current;
    
    // Count by tier
    const tierCounts = {
        common: 0,
        uncommon: 0,
        rare: 0,
        legendary: 0
    };
    
    generatedPFPs.forEach(pfp => {
        tierCounts[pfp.tier]++;
    });
    
    const totalTarget = parseInt(document.getElementById('collectionSize').value);
    const commonTarget = Math.floor(totalTarget * RARITY_DISTRIBUTION.common);
    const uncommonTarget = Math.floor(totalTarget * RARITY_DISTRIBUTION.uncommon);
    const rareTarget = Math.floor(totalTarget * RARITY_DISTRIBUTION.rare);
    const legendaryTarget = totalTarget - commonTarget - uncommonTarget - rareTarget;
    
    document.getElementById('commonsCount').textContent = `${tierCounts.common}/${commonTarget}`;
    document.getElementById('uncommonsCount').textContent = `${tierCounts.uncommon}/${uncommonTarget}`;
    document.getElementById('raresCount').textContent = `${tierCounts.rare}/${rareTarget}`;
    document.getElementById('legendariesCount').textContent = `${tierCounts.legendary}/${legendaryTarget}`;
}

// Update Progress Bar
function updateProgress(current, total) {
    const percent = (current / total) * 100;
    document.getElementById('progressFill').style.width = `${percent}%`;
    document.getElementById('progressText').textContent = `${Math.round(percent)}% - ${current}/${total}`;
}

// Add to Preview Gallery
function addToPreview(pfp) {
    const gallery = document.getElementById('previewGrid');
    
    // Limit to last 20
    if (gallery.children.length >= 20) {
        gallery.removeChild(gallery.lastChild);
    }
    
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
        <img src="${pfp.imageData}" alt="${pfp.filename}">
        <div class="preview-label">#${pfp.id} - ${pfp.tier}</div>
    `;
    
    gallery.insertBefore(item, gallery.firstChild);
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('timeElapsed').textContent = `${minutes}m ${seconds}s`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Download Collection
async function downloadCollection() {
    if (generatedPFPs.length === 0) {
        alert('⚠️ No PFPs generated yet!');
        return;
    }
    
    logStatus(`📥 Preparing download of ${generatedPFPs.length} PFPs + metadata...`, 'success');
    
    // Download images
    logStatus('📥 Downloading images...', 'success');
    for (const pfp of generatedPFPs) {
        downloadFile(pfp.imageData, pfp.filename);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
    
    // Download metadata
    logStatus('📥 Downloading metadata...', 'success');
    for (const pfp of generatedPFPs) {
        const metadataBlob = new Blob([JSON.stringify(pfp.metadata, null, 2)], { type: 'application/json' });
        const metadataUrl = URL.createObjectURL(metadataBlob);
        downloadFile(metadataUrl, pfp.metadataFilename);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Download collection manifest
    const manifest = {
        collection_name: document.getElementById('collectionName').value,
        total_supply: generatedPFPs.length,
        faction: selectedFaction,
        generated_at: new Date().toISOString(),
        rarity_distribution: RARITY_DISTRIBUTION,
        pfps: generatedPFPs.map(pfp => ({
            id: pfp.id,
            tier: pfp.tier,
            filename: pfp.filename
        }))
    };
    
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    downloadFile(manifestUrl, 'collection-manifest.json');
    
    logStatus(`✅ Download complete! ${generatedPFPs.length} images + metadata`, 'success');
}

// Download Helper
function downloadFile(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Clear Collection
function clearCollection() {
    if (isGenerating) {
        alert('⚠️ Cannot clear while generating!');
        return;
    }
    
    if (generatedPFPs.length > 0) {
        const confirmed = confirm(`🗑️ Clear ${generatedPFPs.length} generated PFPs?`);
        if (!confirmed) return;
    }
    
    generatedPFPs = [];
    document.getElementById('generatedCount').textContent = '0';
    document.getElementById('previewGrid').innerHTML = '';
    document.getElementById('statusLog').innerHTML = '';
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('downloadBtn').disabled = true;
    updateTargetDisplay();
    
    logStatus('🗑️ Collection cleared', 'success');
}

// Status Logger
function logStatus(message, type = 'info') {
    const log = document.getElementById('statusLog');
    const entry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    
    entry.className = type;
    entry.innerHTML = `<span style="color: #ffd700;">[${timestamp}]</span> ${message}`;
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 50 messages
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
    
    // Auto-scroll if near bottom
    if (log.scrollHeight - log.scrollTop < log.clientHeight + 100) {
        log.scrollTop = 0;
    }
}

// Export functions
window.startGeneration = startGeneration;
window.stopGeneration = stopGeneration;
window.downloadCollection = downloadCollection;
window.clearCollection = clearCollection;
