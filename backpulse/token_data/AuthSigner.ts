

import crypto from "crypto"

export class AuthSigner {
  private algorithm = "RSA-SHA256"
  private keys = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  })

  async sign(data: string): Promise<string> {
    const s = crypto.createSign(this.algorithm)
    s.update(data)
    s.end()
    return s.sign(this.keys.privateKey, "base64")
  }

  async verify(data: string, sig: string): Promise<boolean> {
    const v = crypto.createVerify(this.algorithm)
    v.update(data)
    v.end()
    return v.verify(this.keys.publicKey, sig, "base64")
  }

  exportPublicKey(): string {
    return this.keys.publicKey
  }
}
