/// <reference types="node" />

import type { Dirent, GlobOptions } from "node:fs";
import { glob as globBase, readdir as readdirBase } from "node:fs/promises";
import { normalizePathFromString } from "../../normalize-path/normalize-path.js";

export const { glob, readdir } = {
	async *glob(pattern, options?: GlobOptions): AsyncIterable<string | Dirent> {
		for await (const value of globBase(pattern, options!)) {
			yield value && typeof value === "object"
				? Object.assign(value, {
						parentPath: normalizePathFromString(value.parentPath.toString()),
					})
				: normalizePathFromString(value);
		}
	},
	async readdir(path, options?: { withFileTypes?: false } | null): Promise<string[]> {
		return (await readdirBase(path, options!)).map(normalizePathFromString);
	},
} as typeof import("node:fs/promises");

export type {
	CreateReadStreamOptions,
	CreateWriteStreamOptions,
	FileChangeInfo,
	FileHandle,
	FileReadResult,
	FlagAndOpenMode,
	ReadableWebStreamOptions,
	WatchOptions,
	WatchOptionsWithBufferEncoding,
	WatchOptionsWithStringEncoding,
} from "node:fs/promises";

export {
	access,
	appendFile,
	chmod,
	chown,
	constants,
	copyFile,
	cp,
	lchmod,
	lchown,
	link,
	lstat,
	lutimes,
	mkdir,
	mkdtemp,
	open,
	opendir,
	readFile,
	readlink,
	realpath,
	rename,
	rm,
	rmdir,
	stat,
	statfs,
	symlink,
	truncate,
	unlink,
	utimes,
	watch,
	writeFile,
} from "node:fs/promises";
