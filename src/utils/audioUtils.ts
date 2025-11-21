// src/utils/audioUtils.ts

// 1. 辅助函数：Float32 转 Int16 (发送给 AI 用)
export function convertFloat32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    // 转换成 16位 PCM，处理边界
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Array;
}

// 2. 辅助函数：ArrayBuffer 转 Base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// 3. 辅助函数：Base64 转 Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// 4. 核心解码：PCM 转 AudioBuffer (播放 AI 的声音用)
// 这里我们给 PCM 数据加上 WAV 头，伪装成一个 WAV 文件让浏览器解码，这是最稳的办法
export async function decodeAudioData(
  audioData: Uint8Array,
  audioContext: AudioContext,
  targetSampleRate: number = 24000,
  targetChannels: number = 1
): Promise<AudioBuffer> {
  // 创建 WAV 头部
  const wavHeader = createWavHeader(audioData.length, targetSampleRate, targetChannels, 16);
  // 合并 头部 + 音频数据
  const wavBytes = new Uint8Array(wavHeader.length + audioData.length);
  wavBytes.set(wavHeader, 0);
  wavBytes.set(audioData, wavHeader.length);

  // 让浏览器原生解码，避免手动计算出错
  return await audioContext.decodeAudioData(wavBytes.buffer);
}

// --- 内部工具：手写一个 WAV 文件头 ---
function createWavHeader(dataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number): Uint8Array {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
