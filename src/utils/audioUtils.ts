
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function pcmToWav(pcmData: Int16Array, sampleRate: number): ArrayBuffer {
    // Simple WAV header construction for playing back if needed locally, 
    // though for AudioContext decoding we usually use decodeAudioData on the raw buffer if constructed correctly,
    // or just put raw PCM into an AudioBuffer manually.
    // However, for the Live API output, we manually stuff the buffer.
    // This function is just a placeholder if we needed file download.
    return pcmData.buffer;
}

// Helper to convert Web Audio API Float32 to PCM Int16 for the model
export function convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
    const l = float32Array.length;
    const int16Array = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      // Clamp values between -1 and 1
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      // Convert to 16-bit PCM
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
}

export async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
