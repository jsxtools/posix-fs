import type { Dirent } from "node:fs";
import { normalizePathString } from "../normalize/normalize.js";
import { PathPart } from "../types/path-part.js";

/** Returns a normalize options object with `withFileTypes: true`. */
export const normalizeOptions = (options: any) => ({ __proto__: options, withFileTypes: true });

/** Returns a Dirent with a normalized `parentPath` and `name`. */
export const normalizeDirent = <T extends Dirent<string>>(dirent: T): T =>
	Object.assign(dirent, {
		parentPath: normalizePathString(dirent.parentPath.toString()) + PathPart.SeparatorPosix,
		name: dirent.isDirectory() ? dirent.name + PathPart.SeparatorPosix : dirent.name,
	});

/** Returns a normalize readdir options object with `withFileTypes: true`. */
export const normalizeReaddirOptions = (options: any) =>
	normalizeOptions(typeof options === "string" ? { encoding: options } : options);

/** Returns a normalized value from a glob result. */
export const normalizeGlob = (dirent: Dirent<string>, options: { withFileTypes: boolean }) => (
	(dirent = normalizeDirent(dirent)), options?.withFileTypes ? dirent : dirent.parentPath + dirent.name
);

/** Returns a normalized value from a readdir result. */
export const normalizeReaddir = (dirent: Dirent<string>, options: { withFileTypes?: boolean; encoding?: string }) => (
	(dirent = normalizeDirent(dirent)),
	options?.withFileTypes ? dirent : normalizeEncoding(dirent.parentPath + dirent.name, options?.encoding)
);

/** Returns a path as a Buffer or string. */
const normalizeEncoding = (path: string, encoding?: string) => (encoding === "buffer" ? Buffer.from(path) : path);
