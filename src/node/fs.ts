/// <reference types="node" />

import {
	glob as globBase,
	globSync as globSyncBase,
	readdir as readdirBase,
	readdirSync as readdirSyncBase,
} from "node:fs";
import { normalizeGlob, normalizeOptions, normalizeReaddir, normalizeReaddirOptions } from "./_normalize.js";

export const { glob, globSync, readdir, readdirSync } = {
	glob(pattern, options: any, callback?: any) {
		if (typeof options === "function") {
			callback = options;
			options = undefined;
		}

		options = normalizeOptions(options);

		globBase(pattern, options, (err, dirents) => {
			if (err) return callback(err);

			callback(
				null,
				dirents.map((dirent) => normalizeGlob(dirent, options.__proto__)),
			);
		});
	},
	globSync(pattern, options?: any) {
		options = normalizeOptions(options);

		return globSyncBase(pattern, options).map((dirent) => normalizeGlob(dirent, options.__proto__));
	},
	readdir(path, options: any, callback?: any) {
		if (typeof options === "function") {
			callback = options;
			options = undefined;
		}

		options = normalizeReaddirOptions(options);

		readdirBase(path, options as { withFileTypes: true }, (err, dirents) => {
			if (err) return callback(err);

			callback(
				null,
				dirents.map((dirent) => normalizeReaddir(dirent, options.__proto__)),
			);
		});
	},
	readdirSync(path, options?: any) {
		options = normalizeReaddirOptions(options);

		return readdirSyncBase(path, options as { withFileTypes: true }).map((dirent) =>
			normalizeReaddir(dirent, options.__proto__),
		);
	},
} as typeof import("node:fs");

export type {
	BigIntOptions,
	BigIntStats,
	BigIntStatsFs,
	BigIntStatsListener,
	BufferEncodingOption,
	CopyOptions,
	CopySyncOptions,
	EncodingOption,
	FSWatcher,
	GlobOptions,
	GlobOptionsWithFileTypes,
	GlobOptionsWithoutFileTypes,
	MakeDirectoryOptions,
	Mode,
	NoParamCallback,
	ObjectEncodingOptions,
	OpenAsBlobOptions,
	OpenDirOptions,
	OpenMode,
	PathLike,
	PathOrFileDescriptor,
	ReadAsyncOptions,
	ReadOptions,
	ReadOptionsWithBuffer,
	ReadPosition,
	ReadSyncOptions,
	ReadVResult,
	RmDirOptions,
	RmOptions,
	StatFsOptions,
	StatOptions,
	StatSyncFn,
	StatSyncOptions,
	StatsBase,
	StatsFsBase,
	StatsListener,
	StatWatcher,
	TimeLike,
	WatchEventType,
	WatchFileOptions,
	WatchListener,
	WatchOptions,
	WatchOptionsWithBufferEncoding,
	WatchOptionsWithStringEncoding,
	WriteFileOptions,
	WriteOptions,
	WriteVResult,
} from "node:fs";

export {
	access,
	accessSync,
	appendFile,
	appendFileSync,
	chmod,
	chmodSync,
	chown,
	chownSync,
	close,
	closeSync,
	constants,
	copyFile,
	copyFileSync,
	cp,
	cpSync,
	createReadStream,
	createWriteStream,
	Dir,
	Dirent,
	exists,
	existsSync,
	fchmod,
	fchmodSync,
	fchown,
	fchownSync,
	fdatasync,
	fdatasyncSync,
	fstat,
	fstatSync,
	fsync,
	fsyncSync,
	ftruncate,
	ftruncateSync,
	futimes,
	futimesSync,
	lchmod,
	lchmodSync,
	lchown,
	lchownSync,
	link,
	linkSync,
	lstat,
	lstatSync,
	lutimes,
	lutimesSync,
	mkdir,
	mkdirSync,
	mkdtemp,
	mkdtempSync,
	open,
	openAsBlob,
	opendir,
	opendirSync,
	openSync,
	ReadStream,
	read,
	readFile,
	readFileSync,
	readlink,
	readlinkSync,
	readSync,
	readv,
	readvSync,
	realpath,
	realpathSync,
	rename,
	renameSync,
	rm,
	rmdir,
	rmdirSync,
	rmSync,
	Stats,
	StatsFs,
	stat,
	statfs,
	statfsSync,
	statSync,
	symlink,
	symlinkSync,
	truncate,
	truncateSync,
	unlink,
	unlinkSync,
	unwatchFile,
	utimes,
	utimesSync,
	WriteStream,
	watch,
	watchFile,
	write,
	writeFile,
	writeFileSync,
	writeSync,
	writev,
	writevSync,
} from "node:fs";
