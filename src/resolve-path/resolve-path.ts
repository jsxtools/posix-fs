import type { PathLike } from "../types/path-like.js";
import { CharCode } from "../types/char-code.js";
import { normalizePath } from "../normalize-path/normalize-path.js";
import { normalizePathPosix } from "../normalize-path/normalize-path-posix.js";

/** Resolves paths against a base path using href-like rules, where a trailing slash on the base determines the directory context. */
export const resolvePath = (base: PathLike, ...paths: PathLike[]): string => {
	let result = normalizePath(base);

	for (const path of paths) {
		const segment = normalizePath(path);

		if (segment.charCodeAt(0) === CharCode.Slash) {
			result = segment;
		} else {
			result = normalizePathPosix(result.slice(0, result.lastIndexOf("/") + 1) + segment);
		}
	}

	return result;
};

