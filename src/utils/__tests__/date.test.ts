import { formatDateForAPI, formatDateForApp, formatReportDate, formatDate } from '../date';

describe('formatDateForAPI', () => {
  it('should convert a Date to ISO UTC string without milliseconds', () => {
    const date = new Date(Date.UTC(2000, 0, 27, 0, 0, 0));
    expect(formatDateForAPI(date)).toBe('2000-01-27T00:00:00Z');
  });

  it('should convert a string date to ISO UTC string', () => {
    const dateStr = '2000-01-27T12:34:56Z';
    const result = formatDateForAPI(dateStr);
    expect(result).toBe('2000-01-27T12:34:56Z');
  });

  it('should handle local date strings correctly', () => {
    const dateStr = '2000-01-27';
    const result = formatDateForAPI(dateStr);
    
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  it('should return undefined for undefined', () => {
    expect(formatDateForAPI(undefined)).toBeUndefined();
  });

  it('should return undefined for invalid date', () => {
    expect(formatDateForAPI('invalid-date')).toBeUndefined();
  });

  it('should remove milliseconds from ISO string', () => {
    const date = new Date(Date.UTC(2000, 0, 27, 12, 34, 56, 789));
    const result = formatDateForAPI(date);
    expect(result).toBe('2000-01-27T12:34:56Z');
    expect(result).not.toContain('.789');
  });
});

describe('formatDateForApp', () => {
  it('should format Date to dd/mm/yyyy', () => {
    const date = new Date(2000, 0, 27);
    expect(formatDateForApp(date)).toBe('27/01/2000');
  });

  it('should format string date to dd/mm/yyyy', () => {
    const dateStr = '2000-01-27T00:00:00Z';
    const result = formatDateForApp(dateStr);
    
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    
    const parts = result.split('/');
    expect(parts[2]).toBe('2000');
    expect(parts[1]).toBe('01');
    expect(['26', '27']).toContain(parts[0]);
  });

  it('should handle date-only strings', () => {
    const dateStr = '2000-01-27';
    const result = formatDateForApp(dateStr);
    expect(result).toMatch(/^\d{2}\/\d{2}\/2000$/);
  });

  it('should return empty string for undefined', () => {
    expect(formatDateForApp(undefined)).toBe('');
  });

  it('should return empty string for invalid date', () => {
    expect(formatDateForApp('invalid-date')).toBe('');
  });

  it('should pad single digit days and months', () => {
    const date = new Date(2000, 0, 1); // 1 Jan 2000
    expect(formatDateForApp(date)).toBe('01/01/2000');
  });
});

describe('formatReportDate', () => {
  it('retourne une chaîne non vide pour une date ISO valide', () => {
    const result = formatReportDate('2026-05-03T12:00:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it("contient l'année dans la chaîne retournée", () => {
    const result = formatReportDate('2026-05-03T12:00:00Z');
    expect(result).toContain('2026');
  });

  it('contient le jour formaté sur 2 chiffres', () => {
    const result = formatReportDate('2026-05-03T00:00:00Z');
    expect(result).toMatch(/0[2-4]/); // 03 UTC peut devenir 02 ou 03 selon la timezone
  });

  it('retourne des résultats différents pour des mois différents', () => {
    const jan = formatReportDate('2026-01-15T00:00:00Z');
    const dec = formatReportDate('2026-12-15T00:00:00Z');
    expect(jan).not.toBe(dec);
  });

  it('retourne des résultats différents pour des années différentes', () => {
    const y2025 = formatReportDate('2025-05-01T00:00:00Z');
    const y2026 = formatReportDate('2026-05-01T00:00:00Z');
    expect(y2025).not.toBe(y2026);
  });
});

describe('formatDate', () => {
  it("retourne 'N/A' si la date est undefined", () => {
    expect(formatDate(undefined)).toBe('N/A');
  });

  it('retourne une chaîne non vide pour une date ISO valide', () => {
    const result = formatDate('2026-05-03T12:00:00Z');
    expect(result).toBeTruthy();
    expect(result).not.toBe('N/A');
  });

  it('retourne une date différente selon la valeur fournie', () => {
    const r1 = formatDate('2026-01-01T00:00:00Z');
    const r2 = formatDate('2026-12-31T00:00:00Z');
    expect(r1).not.toBe(r2);
  });
});