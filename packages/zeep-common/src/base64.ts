export function encodeBytesAsBase64(bytes: Uint8Array | ArrayBuffer): string {
  return bytes instanceof Uint8Array
    ? btoa(bytes.reduce((data, byte) => data + String.fromCharCode(byte), ''))
    : encodeBytesAsBase64(new Uint8Array(bytes));
}

export function decodeBytesFromBase64(base64: string): Uint8Array {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);

  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  return bytes;
}
