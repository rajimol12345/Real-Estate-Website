const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Message = require('../models/Message');
const Lead = require('../models/Lead');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// Helper to fetch properties based on structured criteria
const searchProperties = async (criteria) => {
    try {
        const query = {};

        if (criteria.location && typeof criteria.location === 'string') {
            query.location = { $regex: criteria.location, $options: 'i' };
        }
        if (criteria.type && typeof criteria.type === 'string' && criteria.type.toLowerCase() !== 'any') {
            query.type = { $regex: criteria.type, $options: 'i' };
        }
        if (criteria.status && typeof criteria.status === 'string' && criteria.status.toLowerCase() !== 'any') {
            const status = criteria.status.toLowerCase();
            if (status.includes('buy') || status.includes('sale')) {
                query.status = 'For Sale';
            } else if (status.includes('rent')) {
                query.status = 'For Rent';
            }
        }
        if (criteria.budget) {
            const budgetStr = String(criteria.budget).replace(/[^0-9]/g, '');
            const budgetNum = parseInt(budgetStr);
            if (!isNaN(budgetNum)) {
                query.price = { $lte: budgetNum };
            }
        }
        if (criteria.beds) {
            const bedsNum = parseInt(criteria.beds);
            if (!isNaN(bedsNum)) {
                query.beds = { $gte: bedsNum };
            }
        }

        return await Property.find(query).limit(5);
    } catch (err) {
        console.error("Search properties error:", err);
        return [];
    }
};

// Basic rule-based fallback logic
const applyRuleBasedFallback = (message, response) => {
    const msg = (message || '').toLowerCase();
    if (msg.includes('buy') || msg.includes('sale') || msg.includes('search')) {
        response.reply = "I'd be happy to help you find a property. What location are you interested in?";
        response.intent = "search";
        response.suggestedActions = ["Apartment", "House", "Villa"];
    } else if (msg.includes('rent')) {
        response.reply = "Looking for a rental? Tell me which city or area you're looking in.";
        response.intent = "search";
        if (!response.searchCriteria) response.searchCriteria = {};
        response.searchCriteria.status = "Rent";
    } else if (msg.includes('visit') || msg.includes('book') || msg.includes('show')) {
        response.reply = "I can help you schedule a site visit. Which property are you interested in?";
        response.intent = "book_visit";
    } else if (msg.includes('contact') || msg.includes('talk') || msg.includes('agent')) {
        response.reply = "I'll connect you with one of our expert agents. You can also call us at +1 (555) 123-4567.";
        response.intent = "contact_agent";
    } else {
        response.reply = "Hello! I'm your EstatePro assistant. How can I help you with your property search today?";
        response.intent = "general";
    }
};

// @desc    Handle chat message
// @route   POST /api/chat
// @access  Public
const handleChatMessage = asyncHandler(async (req, res) => {
    console.log(">>> [DEBUG] handleChatMessage hit at " + new Date().toISOString());

    // 1. Safe Body Validation
    if (!req.body) {
        return res.status(400).json({ success: false, message: 'Request body is missing' });
    }

    const { message = '', threadId = '', userEmail = '', userName = '' } = req.body;
    console.log(`>>> [DEBUG] Chat payload: ${JSON.stringify({ message, threadId, userEmail, userName })}`);

    if (!message || !threadId) {
        console.log(">>> [DEBUG] Missing required fields: message or threadId");
        return res.status(400).json({
            success: false,
            message: 'Message and threadId are required'
        });
    }

    try {
        // 2. Get previous messages for context (Wrapped in try/catch)
        let chatHistoryContext = "";
        try {
            const history = await Message.find({ threadId }).sort({ createdAt: 1 }).limit(5);
            chatHistoryContext = history.map(m => `${m.sender}: ${m.content}`).join('\n');
        } catch (dbErr) {
            console.error("History fetch error (continuing without context):", dbErr);
        }

        // Initialize default response
        let aiResponse = {
            reply: "Hello! I'm your EstatePro assistant. How can I help you with your property search today?",
            intent: "general",
            searchCriteria: {},
            suggestedActions: ["Buy Property", "Rent Property", "Contact Agent"]
        };

        // 3. AI Processing
        const apiKey = process.env.GEMINI_API_KEY;
        const isApiKeyValid = apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey !== '';

        if (isApiKeyValid) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const systemPrompt = `
                You are a smart real estate assistant for "EstatePro".
                Your goal is to understand the user's intent and extract search criteria.
                
                AGENCY CONTACT:
                Phone: +1 (555) 123-4567
                Email: contact@estatepro.com

                CURRENT CONTEXT:
                ${chatHistoryContext}

                USER INFO: ${userName || 'Unknown'} (${userEmail || 'Unknown'})

                OUTPUT FORMAT (JSON ONLY):
                {
                    "reply": "Your conversational response",
                    "intent": "search" | "book_visit" | "contact_agent" | "general",
                    "searchCriteria": { "location": "...", "budget": "...", "type": "...", "status": "...", "beds": "..." },
                    "leadDetails": { "name": "...", "phone": "...", "email": "..." },
                    "suggestedActions": ["...", "..."] 
                }
                `;

                const fullPrompt = `${systemPrompt}\n\nUSER MESSAGE: ${message}`;
                const result = await model.generateContent(fullPrompt);

                if (!result || !result.response) {
                    throw new Error("Empty response from AI model");
                }

                const responseText = result.response.text();

                // Clean and parse JSON
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                const cleanJson = jsonMatch ? jsonMatch[0] : responseText.replace(/```json|```/g, '').trim();

                try {
                    const parsed = JSON.parse(cleanJson);
                    aiResponse = { ...aiResponse, ...parsed };
                } catch (parseErr) {
                    console.error("JSON Parse Error on AI response:", parseErr, "Raw text:", responseText);
                    applyRuleBasedFallback(message, aiResponse);
                }
            } catch (aiErr) {
                console.error('AI Processing Error (falling back to rules):', aiErr.message);
                // CRITICAL FIX: Ensure we use the fallback instead of crashing
                applyRuleBasedFallback(message, aiResponse);
            }
        } else {
            console.log(">>> [DEBUG] Valid GEMINI_API_KEY not found or invalid, using rule-based fallback");
            applyRuleBasedFallback(message, aiResponse);
        }

        // 4. Perform Property Search
        let properties = [];
        try {
            const criteria = aiResponse.searchCriteria || {};
            const hasSearchCriteria = criteria.location || criteria.budget || criteria.type || criteria.status;

            if (aiResponse.intent === 'search' || hasSearchCriteria) {
                properties = await searchProperties(criteria);

                if (properties && properties.length > 0) {
                    if (!aiResponse.reply.includes('found')) {
                        aiResponse.reply += ` I found ${properties.length} properties that match your criteria.`;
                    }
                } else if (aiResponse.intent === 'search') {
                    aiResponse.reply += " I couldn't find any exact matches right now, but I can help you broaden your search.";
                }
            }
        } catch (searchErr) {
            console.error("Search error (continuing):", searchErr);
        }

        // 5. Save Messages (Non-blocking / Background-ish)
        let botMsgId = null;
        try {
            await Message.create({ threadId, sender: 'user', content: message, intent: aiResponse.intent });
            const botMsg = await Message.create({
                threadId,
                sender: 'bot',
                content: aiResponse.reply,
                intent: aiResponse.intent,
                metadata: {
                    suggestedProperties: properties ? properties.map(p => p._id) : []
                }
            });
            botMsgId = botMsg._id;
        } catch (msgErr) {
            console.error("Save message error (continuing):", msgErr);
        }

        // 6. Return Clean Response
        return res.status(200).json({
            success: true,
            reply: aiResponse.reply,
            intent: aiResponse.intent,
            suggestedProperties: properties || [],
            suggestedActions: aiResponse.suggestedActions || ["Buy Property", "Rent Property", "Contact Agent"],
            action: aiResponse.intent === 'book_visit' ? 'book_appointment' : 'none',
            messageId: botMsgId
        });

    } catch (globalErr) {
        console.error("CRITICAL GLOBAL CHAT ERROR:", globalErr);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during chat processing",
            reply: "I apologize, I'm having some internal technical difficulties. How else can I assist you?",
            error: process.env.NODE_ENV === 'development' ? globalErr.message : undefined
        });
    }
});

// @desc    Get chat history
// @route   GET /api/chat/history/:threadId
const getChatHistory = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ threadId: req.params.threadId }).sort({ createdAt: 1 });
        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get chat analytics
// @route   GET /api/chat/analytics
const getChatAnalytics = asyncHandler(async (req, res) => {
    try {
        const intentCounts = await Lead.aggregate([
            { $group: { _id: "$intent", count: { $sum: 1 } } }
        ]);
        res.json({ success: true, data: intentCounts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = {
    handleChatMessage,
    getChatHistory,
    getChatAnalytics
};
