import { describe, expect, it } from "vitest";
import { normalizePath } from "../src/normalize-path/normalize-path.ts";
import { normalizePathPosix } from "../src/normalize-path/normalize-path-posix.ts";
import { normalizePathURL } from "../src/normalize-path/normalize-path-url.ts";
import { normalizePathWin32 } from "../src/normalize-path/normalize-path-win32.ts";

describe("normalizePath", () => {
	it("routes to normalizePathPosix or normalizePathWin32 based on backslash presence", () => {
		expect(normalizePath("/foo/bar")).toBe("/foo/bar");
		expect(normalizePath("C:\\foo\\bar")).toBe("/C:/foo/bar");
	});

	it("handles URL inputs", () => {
		expect(normalizePath(new URL("file:///foo/bar"))).toBe("/foo/bar");
		expect(normalizePath("file:///foo/bar")).toBe("/foo/bar");
	});
});

describe("normalizePathURL", () => {
	it("handles URLs with hostname", () => {
		expect(normalizePathURL("file://server/share/file")).toBe("//server/share/file");
	});
});

describe("normalizePathPosix", () => {
	it("returns device paths unchanged", () => {
		expect(normalizePathPosix("//./device")).toBe("//./device");
	});

	it("handles leading slashes", () => {
		expect(normalizePathPosix("/foo/bar")).toBe("/foo/bar");
		expect(normalizePathPosix("//foo/bar")).toBe("//foo/bar");
		expect(normalizePathPosix("///foo/bar")).toBe("//foo/bar");
		expect(normalizePathPosix("/")).toBe("/");
		expect(normalizePathPosix("//")).toBe("//");
		expect(normalizePathPosix("///")).toBe("//");
	});

	it("handles relative paths", () => {
		expect(normalizePathPosix("foo/bar")).toBe("foo/bar");
		expect(normalizePathPosix("foo")).toBe("foo");
		expect(normalizePathPosix("")).toBe("");
		expect(normalizePathPosix(".")).toBe(".");
	});

	it("resolves dot segments", () => {
		expect(normalizePathPosix("./foo/./bar/.")).toBe("foo/bar/");
		expect(normalizePathPosix("foo/bar/../baz")).toBe("foo/baz");
		expect(normalizePathPosix("../foo")).toBe("../foo");
		expect(normalizePathPosix("../../foo")).toBe("../../foo");
		expect(normalizePathPosix("../..")).toBe("../../");
		expect(normalizePathPosix("/foo/../..")).toBe("/");
		expect(normalizePathPosix("/foo/..")).toBe("/");
	});

	it("collapses consecutive slashes", () => {
		expect(normalizePathPosix("foo//bar///baz")).toBe("foo/bar/baz");
		expect(normalizePathPosix("foo/bar//")).toBe("foo/bar/");
	});

	it("preserves trailing slashes", () => {
		expect(normalizePathPosix("foo/bar/")).toBe("foo/bar/");
		expect(normalizePathPosix("foo/bar/.")).toBe("foo/bar/");
		expect(normalizePathPosix("foo/bar/baz/..")).toBe("foo/bar/");
	});

	it("handles complex paths", () => {
		expect(normalizePathPosix("/foo")).toBe("/foo");
		expect(normalizePathPosix("/a/b/../c/./d//e/../f")).toBe("/a/c/d/f");
	});
});

describe("normalizePathWin32", () => {
	it("converts UNC paths", () => {
		expect(normalizePathWin32("\\\\server\\share\\folder")).toBe("//server/share/folder");
	});

	it("converts extended-length paths", () => {
		expect(normalizePathWin32("\\\\?\\C:\\Users\\file.txt")).toBe("/C:/Users/file.txt");
		expect(normalizePathWin32("\\\\?\\UNC\\server\\share\\file")).toBe("//server/share/file");
	});

	it("converts device namespace paths", () => {
		expect(normalizePathWin32("\\\\.\\C$\\Users")).toBe("//./C$/Users");
	});

	it("converts drive letter paths", () => {
		expect(normalizePathWin32("C:\\foo\\bar")).toBe("/C:/foo/bar");
		expect(normalizePathWin32("c:\\foo\\bar")).toBe("/c:/foo/bar");
		expect(normalizePathWin32("C:folder\\file")).toBe("/C:folder/file");
		expect(normalizePathWin32("A:\\test")).toBe("/A:/test");
		expect(normalizePathWin32("Z:\\test")).toBe("/Z:/test");
		expect(normalizePathWin32("a:\\test")).toBe("/a:/test");
		expect(normalizePathWin32("z:\\test")).toBe("/z:/test");
	});

	it("converts backslashes to forward slashes", () => {
		expect(normalizePathWin32("foo\\bar\\baz")).toBe("foo/bar/baz");
		expect(normalizePathWin32("foo\\bar/baz\\qux")).toBe("foo/bar/baz/qux");
	});

	it("normalizes after conversion", () => {
		expect(normalizePathWin32("C:\\foo\\bar\\..\\baz")).toBe("/C:/foo/baz");
		expect(normalizePathWin32("C:\\foo\\\\bar")).toBe("/C:/foo/bar");
	});

	it("handles edge cases", () => {
		expect(normalizePathWin32("\\foo\\bar")).toBe("/foo/bar");
		expect(normalizePathWin32("1:\\foo")).toBe("1:/foo");
	});
});
