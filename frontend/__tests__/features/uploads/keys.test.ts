import { uploadKeys } from "@/features/uploads/keys";

describe("uploadKeys", () => {
  describe("all", () => {
    it("should return base key", () => {
      expect(uploadKeys.all).toEqual(["uploads"]);
    });
  });

  describe("lists", () => {
    it("should return lists key", () => {
      expect(uploadKeys.lists()).toEqual(["uploads", "list"]);
    });
  });

  describe("list", () => {
    it("should return list key with empty filters", () => {
      expect(uploadKeys.list({})).toEqual(["uploads", "list", {}]);
    });

    it("should return list key with status filter", () => {
      const filters = { status: "completed" as const };
      expect(uploadKeys.list(filters)).toEqual(["uploads", "list", filters]);
    });
  });

  describe("details", () => {
    it("should return details key", () => {
      expect(uploadKeys.details()).toEqual(["uploads", "detail"]);
    });
  });

  describe("detail", () => {
    it("should return detail key with id", () => {
      expect(uploadKeys.detail(456)).toEqual(["uploads", "detail", 456]);
    });
  });

  describe("errors", () => {
    it("should return errors key with uploadId", () => {
      expect(uploadKeys.errors(789)).toEqual(["uploads", "errors", 789]);
    });
  });
});
