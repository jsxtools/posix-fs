import { normalizePath, normalizePathString } from "../normalize/normalize.js";
import { normalizePathPosix } from "../normalize/normalize-path-posix.js";
import { CharCode } from "../types/char-code.js";
import type { PathLike } from "../types/path-like.js";
import { PathPart } from "../types/path-part.js";

/** Returns a normalized POSIX path from the given string or URL, resolved against any additional path specifiers using URL-style resolution. */
export const rebasePath = (base: PathLike, ...paths: PathLike[]): string => {
	let result = normalizePath(base);

	for (const path of paths) {
		const segment = normalizePath(path);

		if (segment.charCodeAt(0) === CharCode.Slash) {
			result = segment;
		} else {
			result = normalizePathPosix(result.slice(0, result.lastIndexOf(PathPart.SeparatorPosix) + 1) + segment);
		}
	}

	return result;
};

/** Returns a normalized POSIX path from the given string, resolved against any additional string path specifiers using URL-style resolution. */
export const rebasePathString = (base: string, ...paths: string[]): string => {
	let result = normalizePathString(base);

	for (const path of paths) {
		const segment = normalizePathString(path);

		if (segment.charCodeAt(0) === CharCode.Slash) {
			result = segment;
		} else {
			result = normalizePathPosix(result.slice(0, result.lastIndexOf(PathPart.SeparatorPosix) + 1) + segment);
		}
	}

	return result;
};
