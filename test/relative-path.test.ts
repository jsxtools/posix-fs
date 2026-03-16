import { describe, expect, it } from "vitest";
import { relativePath, relativePathString } from "../src/relative/relative.ts";

describe("relativePath", () => {
	it("returns dot when base and target are identical", () => {
		expect(relativePath("/a/b/c", "/a/b/c")).toBe(".");
	});

	it("returns a relative path from a base file to a target", () => {
		expect(relativePath("/a/b/c", "/a/b/d/e")).toBe("./d/e");
	});

	it("returns a relative path from a base directory to a target", () => {
		expect(relativePath("/a/b/c/", "/a/b/d/e")).toBe("../d/e");
	});
});

describe("relativePathString", () => {
	it("handles bare relative base with no slash", () => {
		expect(relativePathString("a", "b")).toBe("./b");
		expect(relativePathString("a", "")).toBe(".");
	});
});
