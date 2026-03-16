/// <reference types="node" />

import { glob as globBase, readdir as readdirBase } from "node:fs/promises";
import { normalizeGlobResult, normalizeReaddirResult } from "../_normalize.js";

export const { glob, readdir } = {
	async *glob(pattern, options?: any) {
		for await (const value of globBase(pattern, options)) {
			yield normalizeGlobResult(value);
		}
	},
	async readdir(path, options?: any) {
		return readdirBase(path, options).then((results) => results.map(normalizeReaddirResult));
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
