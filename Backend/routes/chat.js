import express from "express";
import Thread from "../models/Thread.js";
import getAIResponse from "../utils/ai.js";

const router = express.Router();


// TEST THREAD SAVE
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: Date.now().toString(),
            title: "Testing New Thread"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});



// GET ALL THREADS
router.get("/thread", async(req, res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt: -1});
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});


// GET SINGLE THREAD CHAT
router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});


// DELETE THREAD
router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});


// MAIN CHAT ROUTE
router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {

        // 1️⃣ find or create thread
        let thread = await Thread.findOne({threadId});

        if(!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: []
            });
        }

        // 2️⃣ save user message first
        thread.messages.push({
            role: "user",
            content: message
        });

        // 3️⃣ call Gemini AI
        const assistantReply = await getAIResponse(message);

        if(!assistantReply) {
            return res.status(500).json({
                error: "AI response failed"
            });
        }

        // 4️⃣ save assistant reply
        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        res.json({reply: assistantReply});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;
