/// <reference types="node" />

import { glob as globBase, readdir as readdirBase } from "node:fs/promises";
import { normalizeGlob, normalizeOptions, normalizeReaddir, normalizeReaddirOptions } from "../_normalize.js";

export const { glob, readdir } = {
	async *glob(pattern, options?: any) {
		options = normalizeOptions(options);

		for await (const value of globBase(pattern, options)) {
			yield normalizeGlob(value, options.__proto__);
		}
	},
	async readdir(path, options?: any) {
		options = normalizeReaddirOptions(options);

		return readdirBase(path, options as { withFileTypes: true }).then((dirents) =>
			dirents.map((dirent) => normalizeReaddir(dirent, options.__proto__)),
		);
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
