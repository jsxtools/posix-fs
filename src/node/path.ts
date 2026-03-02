/// <reference types="node" />

import type { ParsedPath } from "node:path/posix";
import {
	basename as basenameBase,
	dirname as dirnameBase,
	extname as extnameBase,
	isAbsolute as isAbsoluteBase,
	join as joinBase,
	normalize as normalizeBase,
	parse as parseBase,
	relative as relativeBase,
	resolve as resolveBase,
} from "node:path/posix";
import { normalizePath } from "../normalize/normalize.js";
import type { PathLike } from "../types/path-like.js";

/**
 * Return the last portion of a path. Similar to the Unix basename command.
 * Often used to extract the file name from a fully qualified path.
 *
 * @param path the path to evaluate.
 * @param suffix optionally, an extension to remove from the result.
 * @throws {TypeError} if `path` is not a string or URL or if `ext` is given and is not a string.
 */
export const basename = (path: PathLike, suffix?: string): string => basenameBase(normalizePath(path), suffix);

/**
 * Return the directory name of a path. Similar to the Unix dirname command.
 *
 * @param path the path to evaluate.
 * @throws {TypeError} if `path` is not a string or URL.
 */
export const dirname = (path: PathLike): string => dirnameBase(normalizePath(path));

/**
 * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
 * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.
 *
 * @param path the path to evaluate.
 * @throws {TypeError} if `path` is not a string or URL.
 */
export const extname = (path: PathLike): string => extnameBase(normalizePath(path));

/**
 * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.
 *
 * If the given {path} is a zero-length string, `false` will be returned.
 *
 * @param path path to test.
 * @throws {TypeError} if `path` is not a string.
 */
export const isAbsolute = (path: PathLike): boolean => isAbsoluteBase(normalizePath(path));

/**
 * Join all arguments together and normalize the resulting path.
 *
 * @param paths paths to join.
 * @throws {TypeError} if any of the path segments is not a string or URL.
 */
export const join = (...segments: PathLike[]): string => joinBase(...segments.map(normalizePath));

/**
 * Normalize a path, reducing '..' and '.' parts.
 * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. If the path is a zero-length string, '.' is returned, representing the current working directory.
 *
 * @param path path to normalize.
 * @throws {TypeError} if `path` is not a string or URL.
 */
export const normalize = (path: PathLike): string => normalizeBase(normalizePath(path));

/**
 * Returns an object from a path string - the opposite of format().
 *
 * @param path path to evaluate.
 * @throws {TypeError} if `path` is not a string or URL.
 */
export const parse = (path: PathLike): ParsedPath => parseBase(normalizePath(path));

/**
 * Solve the relative path from {from} to {to} based on the current working directory.
 * At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
 *
 * @throws {TypeError} if either `from` or `to` is not a string or URL.
 */
export const relative = (from: PathLike, to: PathLike): string => relativeBase(normalizePath(from), normalizePath(to));

/**
 * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
 *
 * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
 *
 * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
 * until an absolute path is found. If after using all {from} paths still no absolute path is found,
 * the current working directory is used as well. The resulting path is normalized,
 * and trailing slashes are removed unless the path gets resolved to the root directory.
 *
 * @param paths A sequence of paths or path segments.
 * @throws {TypeError} if any of the arguments is not a string or URL.
 */
export const resolve = (...segments: PathLike[]): string => resolveBase(...segments.map(normalizePath));

export type { FormatInputPathObject, ParsedPath, PlatformPath } from "node:path/posix";

export { delimiter, format, matchesGlob, sep } from "node:path/posix";
