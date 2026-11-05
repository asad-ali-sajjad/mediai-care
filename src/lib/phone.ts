/**
 * Normalizes Pakistani and international phone numbers to standard E.164 format.
 * Returns null if the phone format is invalid.
 * 
 * Example inputs -> Outputs:
 * - "03001234567"     -> "+923001234567"
 * - "923001234567"    -> "+923001234567"
 * - "00923001234567"  -> "+923001234567"
 * - "+923001234567"   -> "+923001234567"
 */
export function normalizePhone(input: string): string | null {
  const cleaned = input.replace(/[\s\-()]/g, "");
  if (/^\+[1-9]\d{7,14}$/.test(cleaned)) return cleaned;
  if (/^00[1-9]\d{7,14}$/.test(cleaned)) return "+" + cleaned.slice(2);
  if (/^0\d{10}$/.test(cleaned)) return "+92" + cleaned.slice(1);
  if (/^92\d{10}$/.test(cleaned)) return "+" + cleaned;
  return null;
}