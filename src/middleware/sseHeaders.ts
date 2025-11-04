import { Request, Response, NextFunction } from "express";

export function sseHeaders(_: Request, res: Response, next: NextFunction) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  next();
}
