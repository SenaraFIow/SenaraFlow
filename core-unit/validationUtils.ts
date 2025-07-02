// senaraflow/core-unit/validationUtils.ts

import { z, ZodError } from "zod"

/**
 * Safely parse JSON into a given Zod schema, returning either the typed data or a formatted error.
 * @param schema A Zod schema to validate against.
 * @param raw Unknown input (e.g. JSON.parse output).
 */
export function parseWithSchema<T>(
  schema: z.ZodSchema<T>,
  raw: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(raw)
    return { success: true, data: result }
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = err.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ")
      return { success: false, error: `Validation error: ${messages}` }
    }
    return { success: false, error: String(err) }
  }
}

/**
 * Ensure a numeric value is within a given range.
 * @param value The number to check.
 * @param min Inclusive minimum.
 * @param max Inclusive maximum.
 */
export function assertInRange(
  value: number,
  min: number,
  max: number
): void {
  if (value < min || value > max) {
    throw new RangeError(`Value ${value} is out of range [${min}, ${max}]`)
  }
}
