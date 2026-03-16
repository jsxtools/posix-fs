/// tests

import { describe, expect, it } from "vitest";
import { glob, globSync, readdir, readdirSync } from "../../src/node/fs.ts";

describe("glob", () => {
	it("returns normalized paths via callback", () =>
		new Promise<void>((resolve, reject) => {
			glob("src/types/*.ts", (err, results) => {
				if (err) return reject(err);

				expect(results.length).toBeGreaterThan(0);

				for (const result of results) {
					expect(result).not.toContain("\\");
				}

				resolve();
			});
		}));

	it("returns Dirents with normalized parentPath when withFileTypes is true", () =>
		new Promise<void>((resolve, reject) => {
			glob("src/types/*.ts", { withFileTypes: true }, (err, results) => {
				if (err) return reject(err);

				expect(results.length).toBeGreaterThan(0);

				for (const entry of results) {
					expect(typeof entry).toBe("object");
					expect(entry.parentPath).not.toContain("\\");
				}

				resolve();
			});
		}));

	it("passes errors to callback", () =>
		new Promise<void>((resolve) => {
			glob("src/types/*.ts", { cwd: "__nonexistent__" }, (err) => {
				expect(err).toBeInstanceOf(Error);
				resolve();
			});
		}));
});

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
			expect(entry.parentPath).not.toContain("\\");
		}
	});
});

describe("readdir", () => {
	it("returns normalized paths via callback", () =>
		new Promise<void>((resolve, reject) => {
			readdir("src/types", (err, results) => {
				if (err) return reject(err);

				expect(results.length).toBeGreaterThan(0);

				for (const result of results) {
					expect(typeof result).toBe("string");
				}

				resolve();
			});
		}));

	it("returns Dirents with normalized parentPath when withFileTypes is true", () =>
		new Promise<void>((resolve, reject) => {
			readdir("src/types", { withFileTypes: true }, (err, results) => {
				if (err) return reject(err);

				expect(results.length).toBeGreaterThan(0);

				for (const entry of results) {
					expect(typeof entry).toBe("object");
					expect(entry.parentPath).not.toContain("\\");
				}

				resolve();
			});
		}));

	it("returns Buffers when encoding is buffer", () =>
		new Promise<void>((resolve, reject) => {
			readdir("src", "buffer", (err, results) => {
				if (err) return reject(err);

				expect(results.length).toBeGreaterThan(0);

				for (const entry of results) {
					expect(Buffer.isBuffer(entry)).toBe(true);
				}

				resolve();
			});
		}));

	it("passes errors to callback", () =>
		new Promise<void>((resolve) => {
			readdir("__nonexistent__", (err) => {
				expect(err).toBeInstanceOf(Error);
				resolve();
			});
		}));
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
			expect(entry.parentPath).not.toContain("\\");
		}
	});

	it("returns Buffers when encoding is buffer", () => {
		const results = readdirSync("src", "buffer");

		expect(results.length).toBeGreaterThan(0);

		for (const entry of results) {
			expect(Buffer.isBuffer(entry)).toBe(true);
		}
	});
});
