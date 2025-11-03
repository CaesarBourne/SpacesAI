import { Request, Response, NextFunction } from "express";

export function validateChatInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { query } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'query' field" });
  }

  next();
}
