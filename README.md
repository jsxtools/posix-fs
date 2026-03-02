# posix-fs

[![NPM Version](https://img.shields.io/npm/v/posix-fs.svg)](https://www.npmjs.com/package/posix-fs)
![Tests](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jsxtools/posix-fs/refs/heads/badges/tests.json)
![Coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jsxtools/posix-fs/refs/heads/badges/coverage.json)
[![License](https://img.shields.io/badge/license-MIT--0-blue.svg)](LICENSE.md)

**posix-fs** normalizes Windows, POSIX, and `file:` URL paths into a single,
canonical POSIX-style format. Its goal is to provide correctness,
reproducibility, and cross‑platform determinism by giving every path consistent
parsing and normalization semantics, regardless of the platform it originated.

To ensure predictable behavior, trailing slashes follow URL‑style resolution
rules rather than OS‑specific filesystem conventions. Because path semantics
vary across platforms — and between native and POSIX‑compatible tools — URL
resolution offers a single, well‑defined rule set to reliably standardize on.

Modern build systems, bundlers, and content pipelines encounter subtle
Windows–Unix mismatches: separators, drive letters, UNC paths, and resolution
differences. **posix-fs** addresses these issues by providing a stable,
predictable path model suitable for graph keys, dependency maps, and virtual
filesystems.

- [Usage](#usage)
- [API](#api)
  - [Core](#core-functionality)
    - [normalize](#normalizepath-string--url-string)
    - [rebase](#rebasebase-string--url-paths-string--url-string)
    - [parse](#parsepath-string--url-parsedpath)
  - [Type-Focused](#type-focused-functionality)
    - [normalize](#normalize-functions)
    - [rebase](#rebase-functions)
    - [parse](#parse-functions)
  - [Utilities](#utilities)
    - [isPathURLLike](#ispathurllikepath-string--url-boolean)
    - [isPathWin32Like](#ispathwin32likepath-string-boolean)
    - [separator](#separator-)
    - [PathLike](#pathlike)
- [NodeJS Augmentations](#nodejs-augmentations)
  - [NodeJS Path](#nodejs-path)
  - [NodeJS FS](#nodejs-fs)
- [Exports](#exports)
- [License](#license)

<br />

## Usage

Install **posix-fs** with npm:

```shell
npm install posix-fs
```

The **normalize** function returns a normalized POSIX path from a given
string or URL.

```js
import { normalize } from "posix-fs";

normalize("./get/../path//to/./file.txt"); // "./path/to/file.txt"
normalize("\\\\server\\share\\file.txt"); //  "//server/share/file.txt"
normalize("C:\\Users\\file.txt"); //          "/C:/Users/file.txt"
normalize("file:///path/to/file.txt"); //     "/path/to/file.txt"
```

### Combine paths with URL resolution

The **rebase** function returns a normalized POSIX path from a given
string or URL, resolved against any additional path specifiers using URL-style
resolution.

```js
import { rebase } from "posix-fs";

// Trailing slashes determine directory context
rebase("/to/path", "file"); //  "/to/file"      (/path is considered a file)
rebase("/to/path/", "file"); // "/to/path/file" (/path/ is considered a directory)

// Leading slashes replace paths entirely
rebase("/to/path/", "/abs"); // "/abs"

// Dot-segments resolve relative to the last segment
rebase("/to/path/", "../file"); // "/to/file"

// Multiple paths chain sequentially
rebase("/a/b/", "c/d/", "../e"); // "/a/b/c/e"

// URL and Win32 paths are still normalized before rebasing
rebase(new URL("file:///path/to/"), "file"); // "/path/to/file"
rebase("C:\\path\\to\\", "file"); //            "/C:/path/to/file"
```

### Parse paths into components

The **parse** function returns an object that describes significant elements of
a normalized POSIX path.

```js
import { parse } from "posix-fs";

parse("/foo/bar/file.txt");
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

parse("C:\\Users\\.bashrc");
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

<br />

## API

### Core Functionality

#### normalize(path: string | URL): string

The **normalize** function returns a normalized POSIX path from the given
string or URL.

```js
import { normalize } from "posix-fs";

normalize("/path/to/file.txt"); // "/path/to/file.txt"
```

#### normalizePathString(path: string): string

The **normalizePathString** function returns a normalized POSIX path from the
given string.

```js
import { normalizePathString } from "posix-fs";
```

#### rebase(base: string | URL, ...paths: (string | URL)[]): string

The **rebase** function returns a normalized POSIX path from the given base resolved against any number of paths using URL-style resolution.

```js
import { rebase } from "posix-fs";

rebase("/foo/bar", "baz"); //  "/foo/baz"
rebase("/foo/bar/", "baz"); // "/foo/bar/baz"
```

#### parse(path: string | URL): ParsedPath

The **parse** function returns a parsed representation of the given string or
URL as a normalized POSIX path.

```js
import { parse } from "posix-fs";

parse("/path/to/file.txt");
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

<br />

### Type-Focused Functionality

The `posix-fs/normalize`, `posix-fs/parse`, and `posix-fs/rebase` modules
provide functions for specific input types.

#### normalize functions

The **normalizePathString** function returns a normalized POSIX path from the
given string.

The **normalizePathURL** function returns a normalized POSIX path from the
given URL or URL-like string.

```ts
import { normalizePathString, normalizePathURL } from "posix-fs/normalize";
```

#### parse functions

The **parsePathString** function returns a parsed representation of the given string as a normalized POSIX path.

The **parsePathURL** function returns a parsed representation of the given URL or URL-like string as a normalized POSIX path.

```ts
import { parsePathString, parsePathURL } from "posix-fs/parse";
```

#### rebase functions

The **rebasePathString** function returns a normalized POSIX path from the given string, resolved against any additional string path specifiers using URL-style resolution.

```ts
import { rebasePathString } from "posix-fs/rebase";
```

<br />

### Utilities

#### isPathURLLike(path: string | URL): boolean

The **isPathURLLike** function returns whether the given path is a URL or a URL-like string.

```js
import { isPathURLLike } from "posix-fs";

isPathURLLike("file:///path/to/file"); //  true
isPathURLLike(new URL("file:///path")); // true
isPathURLLike("/file/path/to/file"); //    false
```

#### isPathWin32Like(path: string): boolean

The **isPathWin32Like** function returns whether the given path contains Win32 backslash separators.

```js
import { isPathWin32Like } from "posix-fs";

isPathWin32Like("C:\\Users\\file"); // true
isPathWin32Like("/path/to/file"); //  false
```

#### separator: "/"

The **separator** constant represents the POSIX path segment separator.

```js
import { separator } from "posix-fs";

separator; // "/"
```

#### PathLike

The **PathLike** type represents a `string | URL` path.

```ts
import type { PathLike } from "posix-fs";
```

## NodeJS Augmentations

**posix-fs** provides drop-in replacements for `node:path`, `node:fs`, and
`node:fs/promises` that normalize paths into POSIX format.

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

### NodeJS Path

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

### NodeJS FS

The `posix-fs/node/fs` and `posix-fs/node/fs/promises` modules normalize output paths to POSIX format.

```js
import { globSync, readdirSync } from "posix-fs/node/fs";
import { glob, readdir } from "posix-fs/node/fs/promises";

const files = globSync("src/**/*.ts"); // POSIX-normalized paths
const entries = readdirSync("src", { withFileTypes: true }); // POSIX-normalized dirents
```

<br />

## Exports

| Export                      | Description                                                             |
| :-------------------------- | :---------------------------------------------------------------------- |
| `posix-fs`                  | Core `normalize`, `rebase`, and `parse`. Works in any environment.      |
| `posix-fs/node`             | Provides both `path` and async `fs` for NodeJS-like environments.       |
| `posix-fs/node/path`        | POSIX-normalized wrapper around `node:path/posix`.                      |
| `posix-fs/node/fs`          | POSIX-normalized wrapper around `node:fs` (`globSync`, `readdirSync`).  |
| `posix-fs/node/fs/promises` | POSIX-normalized wrapper around `node:fs/promises` (`glob`, `readdir`). |
| `posix-fs/normalize`        | Type-focused normalize functions.                                       |
| `posix-fs/parse`            | Type-focused parse functions.                                           |
| `posix-fs/rebase`           | Type-focused rebase functions.                                          |

- The `normalize` function contributes up to 1.29 kB minified and uncompressed.
- The `rebase` function contributes an additional 395 B minified and uncompressed.
- The `parse` function contributes an additional 725 B minified and uncompressed.

<br />

## License

[MIT-0](LICENSE.md)
