import { describe, it, expect, vi } from "vitest";

vi.mock("firebase/auth", () => {
  const auth = {} as any;
  return {
    getAuth: () => auth,
    sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
  };
});

import { validateEmail, sendPasswordReset } from "./auth";
import { firebaseAuth } from "./firebaseClient";

describe("validateEmail", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });
  it("rejects invalid emails", () => {
    expect(validateEmail("bad-email")).toBe(false);
  });
});

describe("sendPasswordReset", () => {
  it("delegates to firebase", async () => {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordReset("user@example.com");
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(firebaseAuth, "user@example.com");
  });
});
