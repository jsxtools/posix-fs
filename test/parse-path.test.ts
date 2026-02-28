import { describe, expect, it } from "vitest";
import { parseNormalizedPath } from "../src/parse-path/parse-normalized-path.ts";
import { parsePath, parsePathFromString } from "../src/parse-path/parse-path.ts";

describe("parseNormalizedPath", () => {
	it("parses absolute file paths", () => {
		const result = parseNormalizedPath("/foo/bar/file.txt");
		expect(result.path).toBe("/foo/bar/file.txt");
		expect(result.name).toBe("file.txt");
		expect(result.dir).toBe("/foo/bar/");
		expect(result.basename).toBe("file");
		expect(result.extension).toBe("txt");
		expect(result.isAbsolute).toBe(true);
		expect(result.isDirectory).toBe(false);
		expect(result.isDotFile).toBe(false);
	});

	it("parses relative file paths", () => {
		const result = parseNormalizedPath("foo/bar.js");
		expect(result.path).toBe("foo/bar.js");
		expect(result.name).toBe("bar.js");
		expect(result.dir).toBe("foo/");
		expect(result.basename).toBe("bar");
		expect(result.extension).toBe("js");
		expect(result.isAbsolute).toBe(false);
		expect(result.isDirectory).toBe(false);
	});

	it("parses directory paths", () => {
		const result = parseNormalizedPath("/foo/bar/");
		expect(result.name).toBe("bar/");
		expect(result.dir).toBe("/foo/");
		expect(result.basename).toBe("bar");
		expect(result.extension).toBe(null);
		expect(result.isDirectory).toBe(true);
	});

	it("parses dotfiles", () => {
		const result = parseNormalizedPath("/home/.bashrc");
		expect(result.name).toBe(".bashrc");
		expect(result.basename).toBe(".bashrc");
		expect(result.extension).toBe(null);
		expect(result.isDotFile).toBe(true);
	});

	it("parses dotfiles with extensions", () => {
		const result = parseNormalizedPath("/home/.config.json");
		expect(result.name).toBe(".config.json");
		expect(result.basename).toBe(".config");
		expect(result.extension).toBe("json");
		expect(result.isDotFile).toBe(true);
	});

	it("handles files without extensions", () => {
		const result = parseNormalizedPath("/usr/bin/node");
		expect(result.name).toBe("node");
		expect(result.basename).toBe("node");
		expect(result.extension).toBe(null);
	});

	it("handles special segments (. and ..)", () => {
		const dotResult = parseNormalizedPath(".");
		expect(dotResult.name).toBe(".");
		expect(dotResult.basename).toBe(".");
		expect(dotResult.extension).toBe(null);
		expect(dotResult.isDotFile).toBe(false);

		const dotDotResult = parseNormalizedPath("..");
		expect(dotDotResult.name).toBe("..");
		expect(dotDotResult.basename).toBe("..");
		expect(dotDotResult.extension).toBe(null);
		expect(dotDotResult.isDotFile).toBe(false);
	});

	it("handles empty path", () => {
		const result = parseNormalizedPath("");
		expect(result.path).toBe("");
		expect(result.name).toBe("");
		expect(result.dir).toBe("");
		expect(result.isAbsolute).toBe(false);
		expect(result.isDirectory).toBe(false);
	});

	it("handles root path", () => {
		const result = parseNormalizedPath("/");
		expect(result.path).toBe("/");
		expect(result.name).toBe("");
		expect(result.dir).toBe("/");
		expect(result.isAbsolute).toBe(true);
		expect(result.isDirectory).toBe(true);
	});

	it("handles single filename", () => {
		const result = parseNormalizedPath("file.txt");
		expect(result.name).toBe("file.txt");
		expect(result.dir).toBe("");
		expect(result.basename).toBe("file");
		expect(result.extension).toBe("txt");
		expect(result.isAbsolute).toBe(false);
	});
});

describe("parsePath", () => {
	it("normalizes and parses paths", () => {
		const result = parsePath("/foo/bar/../baz/file.txt");
		expect(result.path).toBe("/foo/baz/file.txt");
		expect(result.name).toBe("file.txt");
		expect(result.dir).toBe("/foo/baz/");
	});

	it("handles Windows paths", () => {
		const result = parsePath("C:\\Users\\file.txt");
		expect(result.path).toBe("/C:/Users/file.txt");
		expect(result.isAbsolute).toBe(true);
	});
});

describe("parsePathFromString", () => {
	it("normalizes and parses string paths", () => {
		const result = parsePathFromString("/foo/bar/../baz/file.txt");
		expect(result.path).toBe("/foo/baz/file.txt");
		expect(result.name).toBe("file.txt");
	});
});
