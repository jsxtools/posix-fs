/// <reference types="node" />

import {
	glob as globBase,
	globSync as globSyncBase,
	readdir as readdirBase,
	readdirSync as readdirSyncBase,
} from "node:fs";
import { normalizeGlobResult, normalizeReaddirResult } from "./_normalize.js";

export const { glob, globSync, readdir, readdirSync } = {
	glob(pattern, options: any, callback?: any) {
		if (typeof options === "function") {
			callback = options;
			options = undefined;
		}

		globBase(pattern, options, (err, results) => {
			if (err) return callback(err);

			callback(null, results.map(normalizeGlobResult));
		});
	},
	globSync(pattern, options?: any) {
		return globSyncBase(pattern, options).map(normalizeGlobResult);
	},
	readdir(path, options: any, callback?: any) {
		if (typeof options === "function") {
			callback = options;
			options = undefined;
		}

		readdirBase(path, options, (err, results) => {
			if (err) return callback(err);

			callback(null, results.map(normalizeReaddirResult));
		});
	},
	readdirSync(path, options?: any) {
		return readdirSyncBase(path, options).map(normalizeReaddirResult);
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
