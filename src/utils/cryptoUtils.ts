const subtleCrypto = window.crypto.subtle;

function getKeyMaterial(password) {
  const format = "raw";
  const encoder = new TextEncoder();
  const keyData = encoder.encode(password);
  const algorithm = { name: "PBKDF2" };
  const isExtractable = false;
  const keyUsages = ["deriveBits", "deriveKey"];

  return subtleCrypto.importKey(
    format,
    keyData,
    algorithm,
    isExtractable,
    keyUsages
  );
}

function getKey(keyMaterial, salt) {
  const algorithm = {
    name: "PBKDF2",
    salt,
    iterations: 100000,
    hash: "SHA-256",
  };
  const derivedKeyType = { name: "AES-GCM", length: 256 };
  const isExtractable = true;
  const keyUsages = ["encrypt", "decrypt"];

  return subtleCrypto.deriveKey(
    algorithm,
    keyMaterial,
    derivedKeyType,
    isExtractable,
    keyUsages
  );
}

function getEncodedMessage(message) {
  const encoder = new TextEncoder();
  return encoder.encode(message);
}

export function bufferToString(buffer) {
  const charArray = buffer.reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  );
  return window.btoa(charArray);
}

export function stringToBuffer(string) {
  const atobString = window.atob(string);
  let bufferView = Uint8Array.from(atobString, (c) => c.charCodeAt(0));
  return bufferView;
}

export async function encrypt(message, password) {
  const keyMaterial = await getKeyMaterial(password);
  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  const key = await getKey(keyMaterial, salt);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedMessage = getEncodedMessage(message);

  const algorithm = {
    name: "AES-GCM",
    iv: iv,
  };

  const encryptedMessageBuffer = await subtleCrypto.encrypt(
    algorithm,
    key,
    encodedMessage
  );

  const bufferArray = new Uint8Array(encryptedMessageBuffer);

  const encryptedMessage = bufferToString(bufferArray);
  const saltStr = bufferToString(salt);
  const ivStr = bufferToString(iv);

  return `${encryptedMessage},${saltStr},${ivStr}`;
}

export async function decrypt(encryptedText, password) {
  const [encryptedMessage, saltStr, ivStr] = encryptedText.split(",");

  const keyMaterial = await getKeyMaterial(password);
  const salt = stringToBuffer(saltStr);

  const key = await getKey(keyMaterial, salt);
  const iv = stringToBuffer(ivStr);

  const algorithm = {
    name: "AES-GCM",
    iv: iv,
  };

  let decrypted = await subtleCrypto.decrypt(
    algorithm,
    key,
    stringToBuffer(encryptedMessage)
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export default {
  encrypt,
  decrypt,
  bufferToString,
  stringToBuffer,
};
