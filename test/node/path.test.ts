import { describe, expect, it } from "vitest";
import {
	basename,
	dirname,
	extname,
	isAbsolute,
	join,
	normalize,
	parse,
	relative,
	resolve,
} from "../../src/node/path.ts";

describe("basename", () => {
	it("returns the last portion of a posix path", () => {
		expect(basename("/foo/bar/baz.txt")).toBe("baz.txt");
		expect(basename("/foo/bar/baz.txt", ".txt")).toBe("baz");
		expect(basename("/foo/bar/")).toBe("bar");
	});

	it("normalizes win32 paths before extracting basename", () => {
		expect(basename("C:\\Users\\file.txt")).toBe("file.txt");
		expect(basename("C:\\Users\\file.txt", ".txt")).toBe("file");
	});

	it("normalizes URL paths before extracting basename", () => {
		expect(basename(new URL("file:///foo/bar/baz.js"))).toBe("baz.js");
	});
});

describe("dirname", () => {
	it("returns the directory name of a posix path", () => {
		expect(dirname("/foo/bar/baz.txt")).toBe("/foo/bar");
		expect(dirname("/foo/bar")).toBe("/foo");
		expect(dirname("/foo")).toBe("/");
		expect(dirname("foo")).toBe(".");
	});

	it("normalizes win32 paths before extracting dirname", () => {
		expect(dirname("C:\\Users\\file.txt")).toBe("/C:/Users");
	});

	it("normalizes URL paths before extracting dirname", () => {
		expect(dirname(new URL("file:///foo/bar/baz.js"))).toBe("/foo/bar");
	});
});

describe("extname", () => {
	it("returns the extension of a posix path", () => {
		expect(extname("/foo/bar/baz.txt")).toBe(".txt");
		expect(extname("/foo/bar/baz")).toBe("");
		expect(extname("/foo/bar/.bashrc")).toBe("");
		expect(extname("/foo/bar/file.tar.gz")).toBe(".gz");
	});

	it("normalizes win32 paths before extracting extname", () => {
		expect(extname("C:\\Users\\file.txt")).toBe(".txt");
	});
});

describe("isAbsolute", () => {
	it("detects absolute posix paths", () => {
		expect(isAbsolute("/foo/bar")).toBe(true);
		expect(isAbsolute("foo/bar")).toBe(false);
		expect(isAbsolute("")).toBe(false);
	});

	it("normalizes win32 paths before checking", () => {
		expect(isAbsolute("C:\\Users\\file.txt")).toBe(true);
	});
});

describe("join", () => {
	it("joins and normalizes posix path segments", () => {
		expect(join("/foo", "bar", "baz")).toBe("/foo/bar/baz");
		expect(join("/foo", "bar", "..", "baz")).toBe("/foo/baz");
		expect(join("foo", "bar")).toBe("foo/bar");
	});

	it("normalizes win32 segments before joining", () => {
		expect(join("C:\\Users", "file.txt")).toBe("/C:/Users/file.txt");
	});
});

describe("normalize", () => {
	it("normalizes posix paths", () => {
		expect(normalize("/foo/bar/../baz")).toBe("/foo/baz");
		expect(normalize("/foo//bar")).toBe("/foo/bar");
		expect(normalize("foo/./bar")).toBe("foo/bar");
	});

	it("normalizes win32 paths", () => {
		expect(normalize("C:\\foo\\bar\\..\\baz")).toBe("/C:/foo/baz");
	});
});

describe("parse", () => {
	it("parses posix paths into components", () => {
		const result = parse("/foo/bar/baz.txt");
		expect(result.root).toBe("/");
		expect(result.dir).toBe("/foo/bar");
		expect(result.base).toBe("baz.txt");
		expect(result.ext).toBe(".txt");
		expect(result.name).toBe("baz");
	});

	it("normalizes win32 paths before parsing", () => {
		const result = parse("C:\\Users\\file.txt");
		expect(result.root).toBe("/");
		expect(result.base).toBe("file.txt");
	});
});

describe("relative", () => {
	it("computes the relative path between two posix paths", () => {
		expect(relative("/foo/bar", "/foo/baz")).toBe("../baz");
		expect(relative("/foo/bar", "/foo/bar")).toBe("");
		expect(relative("/foo/bar/baz", "/foo/qux")).toBe("../../qux");
	});

	it("normalizes win32 paths before computing relative", () => {
		expect(relative("C:\\foo\\bar", "C:\\foo\\baz")).toBe("../baz");
	});
});

describe("resolve", () => {
	it("resolves posix path segments to an absolute path", () => {
		expect(resolve("/foo/bar", "./baz")).toBe("/foo/bar/baz");
		expect(resolve("/foo/bar", "/baz")).toBe("/baz");
		expect(resolve("/foo", "bar", "baz")).toBe("/foo/bar/baz");
	});

	it("normalizes win32 paths before resolving", () => {
		expect(resolve("C:\\Users", "file.txt")).toBe("/C:/Users/file.txt");
	});
});
