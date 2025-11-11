// Vercel Serverless Function - Together.ai Image Generation
// api/generate.js

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Check for API key
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }
    
    try {
        const {
            model = 'black-forest-labs/FLUX.1-schnell',
            prompt,
            negative_prompt,
            width = 1024,
            height = 1024,
            steps = 4,
            seed
        } = req.body;
        
        // Validate required fields
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        // Call Together.ai API
        const response = await fetch('https://api.together.xyz/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                prompt,
                negative_prompt,
                width,
                height,
                steps,
                n: 1,
                response_format: 'b64_json',
                ...(seed && { seed })
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Together.ai API error:', error);
            return res.status(response.status).json({ 
                error: 'Image generation failed',
                details: error
            });
        }
        
        const data = await response.json();
        
        // Together.ai returns data in this format:
        // { data: [{ b64_json: "base64string..." }] }
        if (!data.data || !data.data[0] || !data.data[0].b64_json) {
            return res.status(500).json({ error: 'Invalid response from image API' });
        }
        
        // Return the base64 image
        return res.status(200).json({
            image: data.data[0].b64_json,
            model: data.model,
            seed: data.seed || seed
        });
        
    } catch (error) {
        console.error('Generation error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
