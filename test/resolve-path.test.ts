import { describe, expect, it } from "vitest";
import { rebasePath, rebasePathString } from "../src/rebase/rebase.ts";

describe("rebasePath", () => {
	it("resolves relative segments against a base without trailing slash", () => {
		expect(rebasePath("/foo/bar", "baz")).toBe("/foo/baz");
		expect(rebasePath("/foo/bar", "baz/qux")).toBe("/foo/baz/qux");
	});

	it("resolves relative segments against a base with trailing slash", () => {
		expect(rebasePath("/foo/bar/", "baz")).toBe("/foo/bar/baz");
		expect(rebasePath("/foo/bar/", "baz/qux")).toBe("/foo/bar/baz/qux");
	});

	it("replaces entirely when segment is absolute", () => {
		expect(rebasePath("/foo/bar", "/abs")).toBe("/abs");
		expect(rebasePath("/foo/bar/", "/abs")).toBe("/abs");
	});

	it("resolves dot-segments", () => {
		expect(rebasePath("/foo/bar", "../baz")).toBe("/baz");
		expect(rebasePath("/foo/bar/", "../baz")).toBe("/foo/baz");
		expect(rebasePath("/foo/bar", "./baz")).toBe("/foo/baz");
		expect(rebasePath("/foo/bar/", "./baz")).toBe("/foo/bar/baz");
	});

	it("chains multiple paths sequentially", () => {
		expect(rebasePath("/foo/bar/", "baz/", "qux")).toBe("/foo/bar/baz/qux");
		expect(rebasePath("/foo/bar/", "baz", "qux")).toBe("/foo/bar/qux");
		expect(rebasePath("/a/b/", "c/d/", "../e")).toBe("/a/b/c/e");
	});

	it("handles absolute segment in the middle of a chain", () => {
		expect(rebasePath("/foo/bar/", "baz", "/abs", "qux")).toBe("/qux");
	});

	it("normalizes Win32 inputs", () => {
		expect(rebasePath("C:\\foo\\bar\\", "baz")).toBe("/C:/foo/bar/baz");
		expect(rebasePath("/foo/bar/", "C:\\baz\\qux")).toBe("/C:/baz/qux");
	});

	it("normalizes URL inputs", () => {
		expect(rebasePath(new URL("file:///foo/bar/"), "baz")).toBe("/foo/bar/baz");
		expect(rebasePath("file:///foo/bar", "baz")).toBe("/foo/baz");
	});

	it("returns the base when no paths are given", () => {
		expect(rebasePath("/foo/bar")).toBe("/foo/bar");
		expect(rebasePath("/foo/bar/")).toBe("/foo/bar/");
	});

	it("handles relative base", () => {
		expect(rebasePath("foo/bar", "baz")).toBe("foo/baz");
		expect(rebasePath("foo/bar/", "baz")).toBe("foo/bar/baz");
	});
});

describe("rebasePathString", () => {
	it("resolves relative segments against a string base", () => {
		expect(rebasePathString("/foo/bar", "baz")).toBe("/foo/baz");
		expect(rebasePathString("/foo/bar/", "baz")).toBe("/foo/bar/baz");
	});

	it("replaces entirely when segment is absolute", () => {
		expect(rebasePathString("/foo/bar", "/abs")).toBe("/abs");
	});

	it("chains multiple string paths", () => {
		expect(rebasePathString("/a/b/", "c/d/", "../e")).toBe("/a/b/c/e");
	});
});
