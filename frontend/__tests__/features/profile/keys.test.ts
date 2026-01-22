import { profileKeys } from "@/features/profile/keys";

describe("profileKeys", () => {
  describe("all", () => {
    it("should return base key", () => {
      expect(profileKeys.all).toEqual(["profile"]);
    });
  });

  describe("current", () => {
    it("should return current profile key", () => {
      expect(profileKeys.current()).toEqual(["profile", "current"]);
    });
  });
});
