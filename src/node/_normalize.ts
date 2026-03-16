import type { Dirent } from "node:fs";
import { normalizePathString } from "../normalize/normalize.js";
import { PathPart } from "../types/path-part.js";

/** Returns a normalized glob result (string or Dirent). */
export const normalizeGlobResult = (value: string | Dirent<string>) =>
	typeof value === "string" ? normalizePathString(value) : normalizeDirent(value);

/** Returns a normalized readdir result (string, Buffer, or Dirent). */
export const normalizeReaddirResult = (value: string | Buffer | Dirent<string>) =>
	Buffer.isBuffer(value)
		? Buffer.from(normalizePathString(value.toString()))
		: typeof value === "object"
			? normalizeDirent(value)
			: value;

/** Returns a Dirent with a normalized `parentPath` and `name`. */
const normalizeDirent = <T extends Dirent<string>>(dirent: T): T =>
	Object.assign(dirent, {
		parentPath: normalizePathString(dirent.parentPath.toString()) + PathPart.SeparatorPosix,
		name: dirent.isDirectory() ? dirent.name + PathPart.SeparatorPosix : dirent.name,
	});
