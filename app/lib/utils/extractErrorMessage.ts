export function extractErrorMessage(x: unknown): string | undefined {
  if (typeof x === "string") return x;
  if (x instanceof Error && typeof x.message === "string") return x.message;
  if (typeof x === "object" && x !== null) {
    const r = x as Record<string, unknown>;
    for (const k of ["message", "error", "detail"] as const) {
      const v = r[k];
      if (typeof v === "string" && v.trim()) return v;
    }
  }
  return undefined;
}
