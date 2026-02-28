# posix-fs

[![NPM Version](https://img.shields.io/npm/v/posix-fs.svg)](https://www.npmjs.com/package/posix-fs)
[![License](https://img.shields.io/badge/license-MIT--0-blue.svg)](LICENSE.md)

**posix-fs** is a library for working with file system paths in POSIX format.

It normalizes URLs, Win32 paths, and POSIX paths into a consistent POSIX format.

## Installation

```shell
npm install posix-fs
```

## Usage

Use the `normalizePath` function to normalize paths into POSIX format.

```js
import { normalizePath } from "posix-fs";

normalizePath("/path/to/file.txt"); //       "/path/to/file.txt" (unchanged)
normalizePath("./foo/../bar//baz/./qux"); // "./bar/baz/qux" (POSIX-relative)

normalizePath("C:\\Users\\file.txt"); //     "/C:/Users/file.txt" (POSIX-normalized)
normalizePath("\\\\server\\share\\file"); // "//server/share/file" (POSIX-normalized UNC)

normalizePath("file:///foo/bar"); //          "/foo/bar" (POSIX-normalized path)
normalizePath(new URL("file:///foo/bar")); // "/foo/bar" (POSIX-normalized path)
```

### Resolve paths with href-like rules

```js
import { resolvePath } from "posix-fs";

// Trailing slash determines directory context (like URL resolution)
resolvePath("/foo/bar", "baz"); //  "/foo/baz"     (/bar is a file)
resolvePath("/foo/bar/", "baz"); // "/foo/bar/baz" (/bar/ is a directory)

// Absolute segments replace entirely
resolvePath("/foo/bar/", "/abs"); // "/abs"

// Dot-segments work as expected
resolvePath("/foo/bar/", "../baz"); // "/foo/baz"

// Chain multiple paths sequentially
resolvePath("/a/b/", "c/d/", "../e"); // "/a/b/c/e"

// Accepts URLs and Win32 paths
resolvePath(new URL("file:///foo/bar/"), "baz"); // "/foo/bar/baz"
resolvePath("C:\\foo\\bar\\", "baz"); //            "/C:/foo/bar/baz"
```

### Parse paths into components

```js
import { parsePath } from "posix-fs";

parsePath("/foo/bar/file.txt");
/*
 * {
 * 	path: "/foo/bar/file.txt",
 * 	name: "file.txt",
 * 	dir: "/foo/bar/",
 * 	basename: "file",
 * 	extension: "txt",
 * 	isAbsolute: true,
 * 	isDirectory: false,
 * 	isDotFile: false,
 * }
 */

parsePath("C:\\Users\\.bashrc");
/*
 * {
 * 	path: "/C:/Users/.bashrc",
 * 	name: ".bashrc",
 * 	dir: "/C:/Users/",
 * 	basename: ".bashrc",
 * 	extension: null,
 * 	isAbsolute: true,
 * 	isDirectory: false,
 * 	isDotFile: true,
 * }
 */
```

---

### NodeJS `path` and `fs` replacements

**posix-fs** also provides a drop-in replacement for `node:path`, `node:fs`, and `node:fs/promises`
that normalizes paths to POSIX format.

```js
import { basename, dirname, join, resolve, relative, parse } from "posix-fs/node/path";

join("C:\\Users", "file.txt"); // normalized to "/C:/Users/file.txt"

dirname(new URL("file:///foo/bar")); // normalized to "/foo"

resolve("C:\\foo", "./bar"); // normalized to "/C:/foo/bar"

relative("C:\\foo\\bar", "C:\\foo\\baz"); // normalized to "../baz"
```

```js
import { globSync, readdirSync } from "posix-fs/node/fs";
import { glob, readdir } from "posix-fs/node/fs/promises";

const files = globSync("src/**/*.ts"); // POSIX-normalized paths
const entries = readdirSync("src", { withFileTypes: true }); // POSIX-normalized dirents
```

## Exports

| Export                      | Description                                                                           |
| :-------------------------- | :------------------------------------------------------------------------------------ |
| `posix-fs`                  | Core `normalizePath`, `parsePath`, and related utilities. Works in Node and browsers. |
| `posix-fs/node`             | Provides both `path` and `fs` (promises).                                             |
| `posix-fs/node/path`        | POSIX-normalized wrapper around `node:path/posix`.                                    |
| `posix-fs/node/fs`          | POSIX-normalized wrapper around `node:fs` (`globSync`, `readdirSync`).                |
| `posix-fs/node/fs/promises` | POSIX-normalized wrapper around `node:fs/promises` (`glob`, `readdir`).               |

## API

### Core

#### normalizePath(path: string | URL): string

Normalizes a POSIX path, Win32 path, or URL to a POSIX path string.

```js
import { normalizePath } from "posix-fs";

normalizePath("/path/to/file.txt"); // "/path/to/file.txt"
```

#### normalizePathFromString(path: string): string

Normalizes a POSIX or Win32 path string to a POSIX path string.

```js
import { normalizePathFromString } from "posix-fs";
```

#### resolvePath(base: string | URL, ...paths: (string | URL)[]): string

Resolves paths against a base using href-like rules. A trailing slash on the base (or intermediate result) determines the directory context — without a trailing slash, the last segment is treated as a file and replaced.

```js
import { resolvePath } from "posix-fs";

resolvePath("/foo/bar", "baz"); //  "/foo/baz"
resolvePath("/foo/bar/", "baz"); // "/foo/bar/baz"
```

#### parsePath(path: string | URL): ParsedPath

Normalizes and parses a path into its components.

```js
import { parsePath } from "posix-fs";

parsePath("/path/to/file.txt");
/*
 * {
 * 	path: "/path/to/file.txt",
 * 	name: "file.txt",
 * 	dir: "/path/to/",
 * 	basename: "file",
 * 	extension: "txt",
 * 	isAbsolute: true,
 * 	isDirectory: false,
 * 	isDotFile: false,
 * }
 */
```

#### parsePathFromString(path: string): ParsedPath

Normalizes and parses a string path into its components.

```js
import { parsePathFromString } from "posix-fs";
```

#### ParsedPath

```ts
interface ParsedPath {
	path: string; // Full normalized path
	name: string; // File or directory name, including extension
	dir: string; // Directory portion
	basename: string; // Name without extension
	extension: string | null; // File extension, or null
	isAbsolute: boolean;
	isDirectory: boolean;
	isDotFile: boolean;
}
```

---

### Node Path

The `posix-fs/node/path` module normalizes output paths to POSIX format.

```js
import {
	basename,
	dirname,
	extname,
	isAbsolute,
	join,
	matchesGlob,
	normalize,
	parse,
	relative,
	resolve,
} from "posix-fs/node/path";

basename("C:\\foo\\bar"); // "bar"
dirname("C:\\foo\\bar"); // "/C:/foo"
extname("C:\\foo\\bar.txt"); // ".txt"
isAbsolute("C:\\foo\\bar"); // true
join("C:\\foo", "bar"); // "/C:/foo/bar"
normalize("C:\\foo\\bar"); // "/C:/foo/bar"
parse("C:\\foo\\bar"); // ParsedPath
relative("C:\\foo\\bar", "C:\\foo\\baz"); // "../baz"
resolve("C:\\foo", "bar"); // "/C:/foo/bar"

matchesGlob("/foo/bar", "/foo/*"); // true;
```

### Node FS

The `posix-fs/node/fs` and `posix-fs/node/fs/promises` modules normalize output paths to POSIX format.

```js
import { globSync, readdirSync } from "posix-fs/node/fs";
import { glob, readdir } from "posix-fs/node/fs/promises";

const files = globSync("src/**/*.ts"); // POSIX-normalized paths
const entries = readdirSync("src", { withFileTypes: true }); // POSIX-normalized dirents
```

## License

[MIT-0](LICENSE.md)
