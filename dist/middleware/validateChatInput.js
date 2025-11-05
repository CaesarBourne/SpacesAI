export function validateChatInput(req, res, next) {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'query' field" });
    }
    next();
}
