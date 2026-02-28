import { CharCode } from "../types/char-code.js";
import { PathPart } from "../types/path-part.js";

/** Returns a normalized POSIX path. */
export const normalizePathPosix = (path: string): string => {
	const n = path.length;

	// Special case: device paths like //./... should not be normalized
	if (
		n > 2 &&
		path.charCodeAt(0) === CharCode.Slash &&
		path.charCodeAt(1) === CharCode.Slash &&
		path.charCodeAt(2) === CharCode.Dot
	)
		return path;

	// Count initial slashes
	let i = 0;

	while (i < n && path.charCodeAt(i) === CharCode.Slash) {
		++i;
	}

	const keepDouble = i >= 2;
	const isAbs = i > 0;

	// Reset to start of first segment (main loop handles consecutive slashes)
	i = isAbs ? (keepDouble ? 2 : 1) : 0;

	// Check for trailing slash: ends with / or /. or /..
	const last = path.charCodeAt(n - 1);

	let hasTrailing = last === CharCode.Slash;

	if (!hasTrailing && last === CharCode.Dot) {
		const prev = path.charCodeAt(n - 2);

		hasTrailing = prev === CharCode.Slash || (prev === CharCode.Dot && path.charCodeAt(n - 3) === CharCode.Slash);
	}

	const out = []; // segment stack

	let segStart = i;

	for (; i <= n; ++i) {
		const ch = i < n ? path.charCodeAt(i) : CharCode.Slash; // treat end as '/'
		if (ch === CharCode.Slash) {
			const len = i - segStart;

			if (len === 1 && path.charCodeAt(segStart) === CharCode.Dot) {
				// '.' - skip
			} else if (
				len === 2 &&
				path.charCodeAt(segStart) === CharCode.Dot &&
				path.charCodeAt(segStart + 1) === CharCode.Dot
			) {
				// '..'
				const outLen = out.length;

				if (outLen > 0 && out[outLen - 1] !== PathPart.DoubleDotSegment) {
					out.pop();
				} else if (!isAbs) {
					out.push(PathPart.DoubleDotSegment);
				}
			} else if (len > 0) {
				out.push(path.slice(segStart, i));
			}

			// skip consecutive slashes
			while (i + 1 < n && path.charCodeAt(i + 1) === CharCode.Slash) {
				++i;
			}

			segStart = i + 1;
		}
	}

	// Build result
	const prefix = keepDouble ? PathPart.DoubleSeparatorPosix : isAbs ? PathPart.SeparatorPosix : PathPart.Empty;

	if (out.length === 0) return prefix || path; // "/" | "//" | "." | ""

	return prefix + out.join(PathPart.SeparatorPosix) + (hasTrailing ? PathPart.SeparatorPosix : PathPart.Empty);
};
