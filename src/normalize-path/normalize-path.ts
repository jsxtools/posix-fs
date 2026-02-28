import type { PathLike } from "../types/path-like.js";
import { normalizePathPosix } from "./normalize-path-posix.js";
import { isPathURLLike, normalizePathURL } from "./normalize-path-url.js";
import { isPathWin32Like, normalizePathWin32 } from "./normalize-path-win32.js";

/** Returns a normalized POSIX path from a URL or string. */
export const normalizePath = (path: PathLike): string =>
	isPathURLLike(path) ? normalizePathURL(path) : normalizePathFromString(path);

/** Returns a normalized POSIX path from a string. */
export const normalizePathFromString = (path: string): string =>
	isPathWin32Like(path) ? normalizePathWin32(path) : normalizePathPosix(path);
