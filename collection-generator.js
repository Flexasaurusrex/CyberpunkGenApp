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
            style: "raw hand-drawn spirit portrait, rough sketch aesthetic, emotional manga art, aggressive brushwork, expressive linework",
            details: "intense spiritual energy, wild flowing forms, emotional eyes, raw sketch lines, hand-drawn texture, visceral presence, expressive features",
            effects: "aggressive neon splashes, raw energy bursts, sketchy glow, emotional particle effects, hand-drawn atmosphere, gritty luminescence",
            variations: [
                "crane: elegant long neck, spread wings, flowing tail feathers, graceful bird form, long legs, ethereal floating, celestial grace with edge",
                "rabbit: upright ears, gentle face with intensity, fluffy form, mystical moon connection, crescent markings, soft but powerful presence",
                "serpent: coiling dragon-snake hybrid, flowing body, whiskers, cloud-riding form, scales and mist, ethereal serpentine movement"
            ]
        },
        uncommon: {
            creatures: "phoenix fledgling spirit, sky fox yokai, celestial tiger guardian",
            style: "intense hand-sketched warrior portrait, raw emotional manga art, aggressive expressive linework, gritty brushstrokes, visceral composition",
            details: "fierce emotional energy, wild aggressive features, burning intense eyes, rough sketch texturing, hand-drawn power, raw spiritual fury, expressive battle scars",
            effects: "explosive sketchy aura, raw energy manifestation, aggressive neon bursts, emotional flame sketches, visceral glow, gritty spiritual chaos",
            variations: [
                "phoenix: bird of fire, spread flaming wings, long tail plumage, fierce eyes, rebirth energy, majestic yet aggressive, celestial flames",
                "fox: pointed ears, narrow snout, multiple tails visible, cunning fierce eyes, mystical markings, spiritual trickster energy, flowing fur",
                "tiger: striped celestial pattern, powerful feline form, sharp teeth showing, whiskers, guardian stance, divine protector energy, muscular grace"
            ]
        },
        rare: {
            creatures: "azure phoenix deity, nine-tailed celestial fox, astral qilin guardian",
            style: "epic raw sketch portrait, emotionally charged manga masterwork, aggressive detailed linework, gritty hand-drawn intensity, visceral epic composition",
            details: "overwhelming emotional power, wild divine features, soul-piercing eyes, intense sketch details, raw energy coursing, aggressive spiritual presence, hand-drawn fury",
            effects: "catastrophic sketchy effects, raw reality tears, aggressive cosmic energy, emotional storm manifestation, visceral divine power, gritty spiritual apocalypse",
            variations: [
                "azure phoenix: supreme phoenix form, cosmic blue flames, multiple wing layers, reality-bending presence, celestial deity power, majestic apocalyptic bird",
                "nine-tailed fox: all nine tails visible and flowing, supreme kitsune deity, reality-warping presence, each tail with unique energy, mystical godlike form",
                "qilin: dragon-scaled deer form, antlers with cosmic power, ox tail, horse hooves, divine beast magnificence, celestial protector deity, sacred presence"
            ]
        },
        legendary: {
            creatures: "cosmic phoenix god emperor, celestial dragon sovereign, divine kirin overlord",
            style: "ultimate raw sketch deity portrait, soul-crushing emotional manga art, aggressive masterwork linework, hand-drawn godlike intensity, visceral transcendent composition",
            details: "absolute emotional dominance, wild reality-bending features, universe-destroying eyes, raw sketch perfection, aggressive divine energy, hand-drawn supremacy, visceral god presence",
            effects: "apocalyptic sketchy chaos, raw dimensional collapse, aggressive cosmic manifestation, emotional singularity, visceral divine wrath, hand-drawn reality destruction",
            variations: [
                "phoenix god: ultimate phoenix transcendent form, universe-creating flames, omnipotent bird deity, reality itself burning, god-emperor presence, cosmic rebirth incarnate",
                "dragon sovereign: supreme eastern dragon, flowing serpentine body, cosmic horns, reality-controlling presence, weather-commanding deity, universal dragon god",
                "kirin overlord: perfected divine qilin form, ultimate sacred beast, reality-blessing presence, cosmic antlers, god-tier divine protector, universal harmony incarnate"
            ]
        }
    },
    glitch: {
        common: {
            creatures: "data serpent spirit, cyber wolf yokai, glitch raven",
            style: "raw glitch sketch portrait, aggressive digital corruption art, hand-drawn tech chaos, visceral broken linework, emotional data decay",
            details: "intense corrupted features, wild fragmented form, aggressive data tears, raw sketch glitches, hand-drawn digital chaos, visceral tech scars, emotional breakdown",
            effects: "aggressive glitch explosions, raw data corruption, sketchy matrix breaks, emotional digital tears, visceral code bleeding, gritty reality fractures",
            variations: [
                "serpent: elongated scaled form, coiling body, forked tongue, reptilian eyes, flowing serpentine movement, data streams along scales",
                "wolf: fierce canine features, bared fangs, pointed ears, wild fur texture, aggressive stance, digital corruption in fur",
                "raven: bird features, sharp beak, intense eyes, feathered form, spread wings, glitch particles floating, ethereal bird presence"
            ]
        },
        uncommon: {
            creatures: "corrupted dragon spirit, digital tiger hunter, matrix fox phantom",
            style: "intense corrupted sketch portrait, raw glitch manga art, aggressive fragmented linework, hand-drawn digital apocalypse, visceral tech chaos, emotional data war",
            details: "fierce digital destruction, wild corrupted features, burning void eyes, aggressive glitch patterns, raw tech fury, hand-drawn corruption, visceral matrix rage, emotional chaos",
            effects: "explosive glitch storms, raw reality corruption, aggressive digital apocalypse, emotional data cascades, visceral tech implosion, sketchy matrix chaos, gritty breakdown",
            variations: [
                "dragon: massive horned head, scaled armor, sharp teeth, serpentine neck, powerful presence, wings or no wings, eastern dragon features, glitch fire breath",
                "tiger: striped pattern, feline face, powerful jaw, fierce eyes, whiskers, predator stance, muscular form, digital stripes glitching",
                "fox: pointed ears, narrow snout, multiple tails emerging, cunning eyes, sleek form, mystical aura, nine tails fragmenting into data"
            ]
        },
        rare: {
            creatures: "glitch qilin destroyer, void dragon phantom, corrupted phoenix entity",
            style: "epic corrupted sketch deity, emotionally devastating glitch art, aggressive reality-breaking linework, raw hand-drawn digital god, visceral tech supremacy",
            details: "overwhelming digital fury, wild void-consumed features, reality-tearing eyes, intense corruption sketches, raw apocalyptic power, aggressive tech dominance, hand-drawn devastation",
            effects: "catastrophic glitch apocalypse, raw dimensional corruption, aggressive void manifestation, emotional reality deletion, visceral digital singularity, sketchy tech annihilation",
            variations: [
                "qilin: deer-like antlers, dragon scales, ox tail, horse hooves, sacred beast form, flames or corruption emanating, majestic corrupted deity",
                "void dragon: cosmic horror form, reality-breaking body, stars visible through form, black hole eyes, dimensional tears, multiple heads or singular, eldritch presence",
                "phoenix: bird of rebirth, flaming feathers corrupted, spread wings, long tail plumage, resurrection energy glitching, majestic corrupted bird deity"
            ]
        },
        legendary: {
            creatures: "digital dragon god virus, matrix leviathan supreme, glitch deity overlord",
            style: "ultimate corrupted sketch god, soul-destroying glitch masterwork, aggressive reality-deleting linework, raw hand-drawn tech deity, visceral digital transcendence",
            details: "absolute digital supremacy, wild universe-corrupting form, black hole consuming eyes, raw sketch godmode, aggressive tech omnipotence, hand-drawn annihilation, emotional devastation",
            effects: "apocalyptic glitch singularity, raw reality annihilation, aggressive dimensional collapse, emotional tech apocalypse, visceral digital godmode, hand-drawn universe deletion",
            variations: [
                "dragon god: supreme dragon form, multiple heads option, cosmic scale, reality itself glitching, god-tier presence, universe-ending power, transcendent dragon deity",
                "leviathan: massive sea serpent, colossal scale, ancient horror, tentacles or fins, ocean deity corrupted, world-ending presence, primordial beast",
                "deity overlord: abstract god form, multiple features merged, reality itself breaking, omnipotent presence, pure corrupted divinity, unknowable entity"
            ]
        }
    },
    neon: {
        common: {
            creatures: "street tiger warrior, urban wolf fighter, crimson serpent hunter",
            style: "raw battle sketch portrait, aggressive warrior manga art, hand-drawn combat fury, visceral fight linework, emotional war sketch",
            details: "intense battle scars, wild aggressive features, burning rage eyes, raw sketch wounds, hand-drawn warrior fury, visceral combat presence, emotional battle damage",
            effects: "aggressive flame explosions, raw blood mist, sketchy heat waves, emotional combat aura, visceral battle energy, gritty war atmosphere",
            variations: [
                "tiger: fierce feline warrior, battle scars across stripes, fangs bared, powerful muscular form, combat-ready stance, war-hardened presence, predator intensity",
                "wolf: pack leader warrior, scarred battle-worn, fierce canine features, war paint markings, aggressive stance, street fighter energy, alpha presence",
                "serpent: coiling strike pose, scales like armor, venomous fangs, combat-ready hunter, battle-scarred reptilian form, deadly serpentine warrior"
            ]
        },
        uncommon: {
            creatures: "battle dragon champion, warrior phoenix striker, combat qilin soldier",
            style: "intense war sketch portrait, raw battle manga masterwork, aggressive combat linework, hand-drawn warrior chaos, visceral fight composition, emotional carnage art",
            details: "fierce battle fury, wild warrior features, blazing combat eyes, aggressive war sketches, raw battle power, hand-drawn destruction, visceral warrior rage, emotional slaughter",
            effects: "explosive combat chaos, raw flame apocalypse, aggressive battle manifestation, emotional war energy, visceral destruction waves, sketchy warrior aura, gritty bloodshed",
            variations: [
                "dragon: horned battle beast, armored scales, war-scarred hide, fire-breathing warrior, massive claws, combat wings or wingless, battle champion presence",
                "phoenix: warrior bird of flame, battle-damaged plumage, aggressive spread wings, combat reborn energy, scarred but unbroken, fighting spirit incarnate",
                "qilin: battle guardian beast, sacred warrior form, horns as weapons, armored divine scales, combat protector stance, war deity presence"
            ]
        },
        rare: {
            creatures: "war god tiger general, blood dragon warlord, infernal phoenix destroyer",
            style: "epic war god sketch portrait, emotionally devastating battle art, aggressive reality-burning linework, raw hand-drawn war deity, visceral combat supremacy",
            details: "overwhelming battle dominance, wild war god features, inferno-consuming eyes, intense war sketches, raw apocalyptic fury, aggressive warrior transcendence, hand-drawn carnage",
            effects: "catastrophic battle apocalypse, raw reality combustion, aggressive war god manifestation, emotional battlefield collapse, visceral combat singularity, sketchy warrior devastation",
            variations: [
                "war god tiger: supreme feline deity, battle scars as trophies, god-tier predator, reality-crushing presence, war incarnate, unstoppable tiger god, apocalyptic warrior",
                "blood dragon: crimson scales of war, battlefield carnage incarnate, blood-soaked presence, war deity dragon, apocalyptic power, supreme warlord beast",
                "infernal phoenix: hell-fire bird deity, destruction and rebirth, apocalyptic flames, war phoenix god, battle-hardened immortal, supreme destroyer presence"
            ]
        },
        legendary: {
            creatures: "dragon war deity emperor, supreme battle beast god, legendary warrior spirit overlord",
            style: "ultimate war god sketch, soul-annihilating battle masterwork, aggressive universe-destroying linework, raw hand-drawn combat deity, visceral warrior transcendence",
            details: "absolute warrior supremacy, wild battle-god form, universe-burning eyes, raw sketch godmode, aggressive combat omnipotence, hand-drawn apocalypse, emotional devastation incarnate",
            effects: "apocalyptic war singularity, raw dimension combustion, aggressive reality annihilation, emotional battle godmode, visceral warrior transcendence, hand-drawn universe destruction",
            variations: [
                "dragon war deity: ultimate dragon war god, multiversal battle presence, reality-ending power, supreme war incarnate, god-emperor of combat, universal dragon warrior",
                "supreme battle beast: abstract war god form, all combat merged, reality itself battling, omnipotent warrior entity, war transcendent, unknowable battle deity",
                "warrior spirit overlord: pure war essence deity, battle given form, universe-conquering presence, supreme martial god, absolute warrior transcendence, combat singularity"
            ]
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

// Build Faction-Specific Prompt for Animal Spirits - RAW ENERGY WITH VARIATION
function buildPrompt(tier, index) {
    if (!selectedFaction) {
        throw new Error('No faction selected');
    }
    
    const faction = FACTION_THEMES[selectedFaction];
    const tierPrompts = FACTION_TIER_PROMPTS[selectedFaction][tier];
    
    // Select random creature from tier
    const creatureList = tierPrompts.creatures.split(', ');
    const creature = creatureList[Math.floor(Math.random() * creatureList.length)];
    
    // Get specific creature variation if available
    let creatureDetails = '';
    if (tierPrompts.variations) {
        const creatureType = creature.split(' ')[0]; // Get first word (serpent, wolf, dragon, etc.)
        const variation = tierPrompts.variations.find(v => v.toLowerCase().includes(creatureType));
        if (variation) {
            creatureDetails = variation.split(': ')[1] + ', '; // Get details after colon
        }
    }
    
    // Composition variations
    const compositions = [
        'centered composition, facing forward',
        'dynamic angled view, three-quarter pose',
        'profile view, side angle',
        'looking over shoulder, turning pose',
        'upward angle, powerful perspective',
        'downward angle, imposing view',
        'close-up dramatic framing',
        'medium shot with environmental context'
    ];
    const composition = compositions[index % compositions.length];
    
    // Background intensity variations
    const backgrounds = [
        'minimal clean background, focus on creature',
        'chaotic energy-filled background, atmospheric depth',
        'abstract pattern background, stylized environment',
        'explosive effects background, maximum chaos',
        'negative space usage, dramatic contrast',
        'textured rough background, gritty atmosphere'
    ];
    const background = backgrounds[index % backgrounds.length];
    
    // Color intensity variations
    const colorIntensities = [
        'bold saturated colors, maximum vibrancy',
        'muted gritty tones, subdued palette',
        'high contrast black and white with color accents',
        'vibrant color explosions, intense saturation'
    ];
    const colorIntensity = colorIntensities[index % colorIntensities.length];
    
    // Build VARIED GRITTY EMOTIONAL prompt
    let prompt = `${creature} portrait, Chinese mythology spirit beast, ${creatureDetails}${tierPrompts.style}, `;
    prompt += `${composition}, ${background}, `;
    prompt += `${tierPrompts.details}, `;
    prompt += `${faction.colors} color palette, ${colorIntensity}, `;
    prompt += `${faction.lighting}, `;
    prompt += `${tierPrompts.effects}, `;
    prompt += `${faction.vibe}, `;
    
    // RAW SKETCHY EMOTIONAL STYLE ANCHORS
    prompt += `raw hand-drawn manga art, aggressive sketch linework, emotional intensity, `;
    prompt += `gritty rough textures, visceral brushstrokes, expressive wild lines, `;
    prompt += `intense emotional energy, rough sketch aesthetic, hand-drawn chaos, `;
    prompt += `aggressive artistic style, raw manga sketch, visceral line quality, `;
    prompt += `emotional power, gritty hand-drawn details, sketchy intensity, `;
    prompt += `rough artistic energy, wild expressive marks, aggressive emotional art, `;
    prompt += `yokai illustration, mythological beast manga, raw creature energy, `;
    prompt += `spirit beast portrait, hand-sketched intensity, emotional creature design, `;
    prompt += `powerful aggressive presence, shoulders/head visible, `;
    prompt += `intense manga composition, raw emotional mythological art, gritty beast energy, `;
    prompt += `varied creative interpretation, unique artistic expression`;
    
    // Negative prompt - AVOID clean polished smooth style AND repetitive similarity
    const negativePrompt = `human, person, humanoid, human face, human body, ` +
                          `cartoon, western cartoon, pixar, disney, chibi, cute, kawaii, soft, ` +
                          `smooth, clean, polished, refined, perfect lines, digital clean, ` +
                          `vector art, flat design, minimalist, corporate art, ` +
                          `rounded features, simplified, children's art, cel shaded, flat colors, ` +
                          `blurry, low quality, 3D render, photograph, realistic photo, ` +
                          `ugly, distorted, deformed, watermark, text, signature, ` +
                          `multiple creatures, duplicate, bad anatomy, bad proportions, ` +
                          `oversaturated, overexposed, amateur, unfinished, ` +
                          `furry, anthro, anime girl, anime boy, wings only, head only, ` +
                          `calm, peaceful, serene, gentle, soft energy, weak, passive, ` +
                          `identical, same, repetitive, cookie-cutter, generic, boring`;
    
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
