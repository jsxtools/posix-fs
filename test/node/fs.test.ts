import { describe, expect, it } from "vitest";
import { globSync, readdirSync } from "../../src/node/fs.ts";

describe("globSync", () => {
	it("returns normalized paths", () => {
		const results = globSync("src/types/*.ts");
		expect(results.length).toBeGreaterThan(0);
		for (const result of results) {
			expect(result).not.toContain("\\");
		}
	});

	it("returns Dirents with normalized parentPath when withFileTypes is true", () => {
		const results = globSync("src/types/*.ts", { withFileTypes: true });
		expect(results.length).toBeGreaterThan(0);
		for (const entry of results) {
			expect(typeof entry).toBe("object");
			expect((entry as any).parentPath).not.toContain("\\");
		}
	});
});

describe("readdirSync", () => {
	it("returns normalized paths", () => {
		const results = readdirSync("src/types");
		expect(results.length).toBeGreaterThan(0);
		for (const result of results) {
			expect(typeof result).toBe("string");
		}
	});

	it("returns Dirents with normalized names when withFileTypes is true", () => {
		const results = readdirSync("src/types", { withFileTypes: true });
		expect(results.length).toBeGreaterThan(0);
		for (const entry of results) {
			expect(typeof entry).toBe("object");
			expect((entry as any).name).not.toContain("\\");
		}
	});
});
