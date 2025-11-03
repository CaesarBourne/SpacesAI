/**
 * 🧮 Simple arithmetic calculator for agent use.
 * Supports addition, subtraction, multiplication, division, percentages, powers, etc.
 */

export function calculator(expression: string): string {
  try {
    // Clean up the input (remove currency symbols, commas, etc.)
    const sanitized = expression
      .replace(/[^\d+\-*/().%^ ]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!sanitized) return "Invalid or empty expression.";

    // Evaluate safely using Function (instead of eval) in isolated scope
    const result = Function(`"use strict"; return (${sanitized})`)();

    if (typeof result === "number" && isFinite(result)) {
      return `Result: ${result}`;
    } else {
      return "Unable to compute expression.";
    }
  } catch (err) {
    return "Error while computing expression.";
  }
}
