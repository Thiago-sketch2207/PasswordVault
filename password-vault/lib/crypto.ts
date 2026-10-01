const enc = new TextEncoder()
const dec = new TextDecoder()

function b64(bytes: Uint8Array) {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s)
}
function unb64(value: string) {
  const s = atob(value)
  return Uint8Array.from(s, c => c.charCodeAt(0))
}

export async function deriveKey(password: string, saltB64: string, iterations: number) {
  const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    {name:'PBKDF2',salt:unb64(saltB64),iterations,hash:'SHA-256'},
    material,
    {name:'AES-GCM',length:256},
    false,
    ['encrypt','decrypt']
  )
}

export async function generateVaultKey() {
  return crypto.subtle.generateKey({name:'AES-GCM',length:256}, true, ['encrypt','decrypt'])
}

export async function wrapVaultKey(vaultKey: CryptoKey, kek: CryptoKey) {
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', vaultKey))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv}, kek, raw))
  return JSON.stringify({iv:b64(iv),data:b64(ciphertext)})
}

export async function unwrapVaultKey(wrapped: string, kek: CryptoKey) {
  const obj = JSON.parse(wrapped)
  const raw = await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(obj.iv)}, kek, unb64(obj.data))
  return crypto.subtle.importKey('raw', raw, {name:'AES-GCM'}, false, ['encrypt','decrypt'])
}

export async function encryptJson(value: unknown, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(value))))
  return JSON.stringify({iv:b64(iv),data:b64(ciphertext)})
}

export async function decryptJson<T>(payload: string, key: CryptoKey): Promise<T> {
  const obj = JSON.parse(payload)
  const plain = await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(obj.iv)},key,unb64(obj.data))
  return JSON.parse(dec.decode(plain)) as T
}

export function randomSalt() {
  return b64(crypto.getRandomValues(new Uint8Array(16)))
}
