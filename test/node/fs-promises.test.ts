/// <reference lib="ESNext.Array" />

import { describe, expect, it } from "vitest";
import { glob, readdir } from "../../src/node/fs/promises.ts";

describe("glob", () => {
	it("yields normalized paths", async () => {
		const results = await Array.fromAsync(glob("src/types/*.ts"));

		expect(results.length).toBeGreaterThan(0);

		for (const result of results) {
			expect(result).not.toContain("\\");
		}
	});

	it("yields Dirents with normalized parentPath when withFileTypes is true", async () => {
		const results = await Array.fromAsync(glob("src/types/*.ts", { withFileTypes: true }));

		expect(results.length).toBeGreaterThan(0);

		for (const entry of results) {
			expect(typeof entry).toBe("object");
			expect(entry.parentPath).not.toContain("\\");
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

	it("returns Dirents with normalized names when withFileTypes is true", async () => {
		const results = await readdir("src/types", { withFileTypes: true });

		expect(results.length).toBeGreaterThan(0);

		for (const entry of results) {
			expect(typeof entry).toBe("object");
			expect(entry.parentPath).not.toContain("\\");
		}
	});

	it("returns Buffers when encoding is buffer", async () => {
		const results = await readdir("src", "buffer");

		expect(results.length).toBeGreaterThan(0);

		for (const entry of results) {
			expect(Buffer.isBuffer(entry)).toBe(true);
		}
	});
});
