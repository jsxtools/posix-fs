import { describe, expect, it } from "vitest";
import { glob, readdir } from "../../src/node/fs/promises.ts";

describe("glob", () => {
	it("yields normalized paths", async () => {
		const results: unknown[] = [];
		for await (const entry of glob("src/types/*.ts")) {
			results.push(entry);
		}
		expect(results.length).toBeGreaterThan(0);
		for (const result of results) {
			expect(result).not.toContain("\\");
		}
	});

	it("yields Dirents with normalized parentPath when withFileTypes is true", async () => {
		const results: unknown[] = [];
		for await (const entry of glob("src/types/*.ts", { withFileTypes: true })) {
			results.push(entry);
		}
		expect(results.length).toBeGreaterThan(0);
		for (const entry of results) {
			expect(typeof entry).toBe("object");
			expect((entry as any).parentPath).not.toContain("\\");
		}
	});
});

describe("readdir", () => {
	it("returns normalized paths", async () => {
		const results = await readdir("src/types");
		expect(results.length).toBeGreaterThan(0);
		for (const result of results) {
			expect(typeof result).toBe("string");
		}
	});
});
