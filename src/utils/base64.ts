import { toByteArray } from "base64-js";

export function base64ToFloatArray(base64: string): number[] {
  const bytes = toByteArray(base64);
  const view = new DataView(bytes.buffer);

  const floats: number[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    floats.push(view.getFloat32(i, true));
  }
  return floats;
}