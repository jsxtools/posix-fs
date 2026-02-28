import { describe, expect, it } from "vitest";
import { resolvePath } from "../src/resolve-path/resolve-path.ts";

describe("resolvePath", () => {
	it("resolves relative segments against a base without trailing slash", () => {
		expect(resolvePath("/foo/bar", "baz")).toBe("/foo/baz");
		expect(resolvePath("/foo/bar", "baz/qux")).toBe("/foo/baz/qux");
	});

	it("resolves relative segments against a base with trailing slash", () => {
		expect(resolvePath("/foo/bar/", "baz")).toBe("/foo/bar/baz");
		expect(resolvePath("/foo/bar/", "baz/qux")).toBe("/foo/bar/baz/qux");
	});

	it("replaces entirely when segment is absolute", () => {
		expect(resolvePath("/foo/bar", "/abs")).toBe("/abs");
		expect(resolvePath("/foo/bar/", "/abs")).toBe("/abs");
	});

	it("resolves dot-segments", () => {
		expect(resolvePath("/foo/bar", "../baz")).toBe("/baz");
		expect(resolvePath("/foo/bar/", "../baz")).toBe("/foo/baz");
		expect(resolvePath("/foo/bar", "./baz")).toBe("/foo/baz");
		expect(resolvePath("/foo/bar/", "./baz")).toBe("/foo/bar/baz");
	});

	it("chains multiple paths sequentially", () => {
		expect(resolvePath("/foo/bar/", "baz/", "qux")).toBe("/foo/bar/baz/qux");
		expect(resolvePath("/foo/bar/", "baz", "qux")).toBe("/foo/bar/qux");
		expect(resolvePath("/a/b/", "c/d/", "../e")).toBe("/a/b/c/e");
	});

	it("handles absolute segment in the middle of a chain", () => {
		expect(resolvePath("/foo/bar/", "baz", "/abs", "qux")).toBe("/qux");
	});

	it("normalizes Win32 inputs", () => {
		expect(resolvePath("C:\\foo\\bar\\", "baz")).toBe("/C:/foo/bar/baz");
		expect(resolvePath("/foo/bar/", "C:\\baz\\qux")).toBe("/C:/baz/qux");
	});

	it("normalizes URL inputs", () => {
		expect(resolvePath(new URL("file:///foo/bar/"), "baz")).toBe("/foo/bar/baz");
		expect(resolvePath("file:///foo/bar", "baz")).toBe("/foo/baz");
	});

	it("returns the base when no paths are given", () => {
		expect(resolvePath("/foo/bar")).toBe("/foo/bar");
		expect(resolvePath("/foo/bar/")).toBe("/foo/bar/");
	});

	it("handles relative base", () => {
		expect(resolvePath("foo/bar", "baz")).toBe("foo/baz");
		expect(resolvePath("foo/bar/", "baz")).toBe("foo/bar/baz");
	});
});
