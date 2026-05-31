import { describe, expect, it } from "vitest";
import { parseAppId } from "./steamApi";

describe("parseAppId", () => {
  it("parses a direct numeric appid", () => {
    expect(parseAppId("548430")).toBe(548430);
  });

  it("parses a Steam store URL", () => {
    expect(parseAppId("https://store.steampowered.com/app/548430/Deep_Rock_Galactic/")).toBe(548430);
  });

  it("parses a Steam store URL without trailing path", () => {
    expect(parseAppId("https://store.steampowered.com/app/466560")).toBe(466560);
  });

  it("parses a Steam community URL", () => {
    expect(parseAppId("https://steamcommunity.com/app/548430")).toBe(548430);
  });

  it("returns null for non-Steam URLs", () => {
    expect(parseAppId("https://example.com/game")).toBeNull();
  });

  it("returns null for random text", () => {
    expect(parseAppId("Deep Rock Galactic")).toBeNull();
  });

  it("handles whitespace around numeric input", () => {
    expect(parseAppId("  548430  ")).toBe(548430);
  });
});
