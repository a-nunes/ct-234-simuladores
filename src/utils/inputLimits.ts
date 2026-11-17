/**
 * Limites de entrada dos simuladores.
 *
 * Os atributos HTML min/max/maxLength só restringem as setas e a digitação
 * "normal" — valores colados ou digitados ainda chegam ao onChange. Por isso
 * todo valor numérico vindo do usuário passa por clampInt antes de virar estado,
 * evitando tabelas/passos gigantes que travam a aba do navegador.
 */
export function clampInt(raw: string | number, min: number, max: number, fallback = min): number {
  const n = typeof raw === 'number' ? raw : parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/** Corta uma string a no máximo `max` caracteres (proteção contra colagens enormes). */
export function clampText(raw: string, max: number): string {
  return raw.length > max ? raw.slice(0, max) : raw;
}
