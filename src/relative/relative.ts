import { normalizePath, normalizePathString } from "../normalize/normalize.js";
import { CharCode } from "../types/char-code.js";
import type { PathLike } from "../types/path-like.js";
import { PathPart } from "../types/path-part.js";

/** Returns a relative POSIX path from the base path to the target path, using URL-style directory resolution. */
export const relativePath = (base: PathLike, target: PathLike): string =>
	relativePathNormalized(normalizePath(base), normalizePath(target));

/** Returns a relative POSIX path from the base string to the target string, using URL-style directory resolution. */
export const relativePathString = (base: string, target: string): string =>
	relativePathNormalized(normalizePathString(base), normalizePathString(target));

/** Returns a relative path between two normalized paths. */
const relativePathNormalized = (base: string, target: string): string => {
	if (base === target) return PathPart.DotSegment;

	// Determine the base directory (everything up to and including the last slash)
	const baseDir =
		base.charCodeAt(base.length - 1) === CharCode.Slash
			? base
			: base.slice(0, base.lastIndexOf(PathPart.SeparatorPosix) + 1);

	// If the target starts with the base directory, the result is "./" + remainder
	if (target.startsWith(baseDir) && baseDir.length > 0) {
		return PathPart.DotSegment + PathPart.SeparatorPosix + target.slice(baseDir.length);
	}

	// Split into segments for comparison
	const baseSegments = baseDir.length > 0 ? baseDir.split(PathPart.SeparatorPosix) : [PathPart.Empty];
	const targetSegments = target.split(PathPart.SeparatorPosix);

	// Find the common prefix length
	let common = 0;

	while (
		common < baseSegments.length &&
		common < targetSegments.length &&
		baseSegments[common] === targetSegments[common]
	) {
		++common;
	}

	// Count non-empty segments remaining in the base directory
	const ups: string[] = [];

	for (let i = common; i < baseSegments.length; ++i) {
		if (baseSegments[i].length > 0) {
			ups.push(PathPart.DoubleDotSegment);
		}
	}

	const remainder = targetSegments.slice(common);

	const parts = [...ups, ...remainder];

	if (parts.length === 0) return PathPart.DotSegment;

	const result = parts.join(PathPart.SeparatorPosix);

	// Ensure result starts with "./" or "../" for explicit relative paths
	if (result.charCodeAt(0) !== CharCode.Dot) {
		return PathPart.DotSegment + PathPart.SeparatorPosix + result;
	}

	return result;
};
