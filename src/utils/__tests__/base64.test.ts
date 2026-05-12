import { toByteArray } from "base64-js";
import { base64ToFloatArray } from '../base64';

describe('base64ToFloatArray', () => {
  it('should convert base64 string to float array', () => {
    // Crée un Float32Array et le transforme en Uint8Array
    const floats = new Float32Array([1.5, -2.25]);
    const bytes = new Uint8Array(floats.buffer);

    // Convertir en base64 avec fromCharCode
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const base64 = btoa(binary);

    const result = base64ToFloatArray(base64);
    expect(result.length).toBe(2);
    expect(result[0]).toBeCloseTo(1.5);
    expect(result[1]).toBeCloseTo(-2.25);
  });
});