import type { PathLike } from "../types/path-like.js";
import { PathPart } from "../types/path-part.js";
import { normalizePathPosix } from "./normalize-path-posix.js";
import { isPathURLLike, normalizePathURL } from "./normalize-path-url.js";
import { isPathWin32Like, normalizePathWin32 } from "./normalize-path-win32.js";

/** Returns a normalized POSIX path from the given string or URL. */
export const normalizePath = (path: PathLike): string =>
	isPathURLLike(path) ? normalizePathURL(path) : normalizePathString(path);

/** Returns a normalized POSIX path from the given string. */
export const normalizePathString = (path: string): string =>
	isPathWin32Like(path) ? normalizePathWin32(path) : normalizePathPosix(path);

/** Represents the path segment separator character. */
export const separator = PathPart.SeparatorPosix;

export { isPathURLLike, isPathWin32Like, normalizePathURL };
