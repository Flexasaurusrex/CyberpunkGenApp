// Vercel Serverless Function - Health Check
// api/health.js

export default async function handler(req, res) {
    // Check if API key is configured
    const hasApiKey = !!process.env.TOGETHER_API_KEY;
    
    return res.status(200).json({
        status: 'ok',
        api_configured: hasApiKey,
        timestamp: new Date().toISOString()
    });
}
