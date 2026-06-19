import { describe, expect, it } from "vitest";

import { sanitizeLoginEmail, sanitizeLoginPassword } from "@/lib/login-sanitizer";

describe("login sanitizer", () => {
  it("trims and lowercases realtor email input", () => {
    expect(sanitizeLoginEmail("  HOMILOM30@GMAIL.COM\u200B  ")).toBe("homilom30@gmail.com");
  });

  it("trims generated password input without changing the password body", () => {
    expect(sanitizeLoginPassword("  Odyssey-MAY5-6TVC!32\uFEFF  ")).toBe("Odyssey-MAY5-6TVC!32");
  });
});
