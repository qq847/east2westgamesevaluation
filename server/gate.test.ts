import { describe, expect, it } from "vitest";
import { SignJWT, jwtVerify } from "jose";

const GATE_PASSWORD = "0426";
const GATE_COOKIE_NAME = "e2w_gate";

// Simulate the gate logic
const gateSecret = new TextEncoder().encode("test_secret_gate");

async function createGateToken() {
  return new SignJWT({ gate: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + 86400 * 30)
    .sign(gateSecret);
}

async function verifyGateToken(token: string) {
  const { payload } = await jwtVerify(token, gateSecret);
  return payload;
}

describe("Password Gate", () => {
  it("rejects incorrect password", () => {
    const password = "wrong";
    expect(password === GATE_PASSWORD).toBe(false);
  });

  it("accepts correct password 0426", () => {
    const password = "0426";
    expect(password === GATE_PASSWORD).toBe(true);
  });

  it("creates a valid JWT token on successful auth", async () => {
    const token = await createGateToken();
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("verifies a valid gate token", async () => {
    const token = await createGateToken();
    const payload = await verifyGateToken(token);
    expect(payload.gate).toBe(true);
  });

  it("rejects an invalid/tampered token", async () => {
    const badToken = "eyJhbGciOiJIUzI1NiJ9.eyJnYXRlIjpmYWxzZX0.invalid";
    await expect(verifyGateToken(badToken)).rejects.toThrow();
  });

  it("rejects an expired token", async () => {
    const expiredToken = await new SignJWT({ gate: true })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(Math.floor(Date.now() / 1000) - 100)
      .sign(gateSecret);
    await expect(verifyGateToken(expiredToken)).rejects.toThrow();
  });
});
