import { CharCode } from "../types/char-code.js";
import { PathPart } from "../types/path-part.js";
import { normalizePathPosix } from "./normalize-path-posix.js";

/** Returns a normalized POSIX path from a Windows path. */
export const normalizePathWin32 = (path: string): string => {
	const c0 = path.charCodeAt(0);
	const c1 = path.charCodeAt(1);

	let prefix = PathPart.Empty;
	let start = 0;

	// Check for UNC/device paths starting with \\
	if (c0 === CharCode.Backslash && c1 === CharCode.Backslash) {
		const c2 = path.charCodeAt(2);
		const c3 = path.charCodeAt(3);

		// \\?\UNC\server\share\... or \\?\C:\...
		if (c2 === CharCode.QuestionMark && c3 === CharCode.Backslash) {
			// Check if it's \\?\UNC\
			if (
				path.charCodeAt(4) === CharCode.UpperU &&
				path.charCodeAt(5) === CharCode.UpperN &&
				path.charCodeAt(6) === CharCode.UpperC &&
				path.charCodeAt(7) === CharCode.Backslash
			) {
				prefix = PathPart.DoubleSeparatorPosix;
				start = 8;
			} else {
				prefix = PathPart.SeparatorPosix;
				start = 4;
			}
		} else if (c2 === CharCode.Dot && c3 === CharCode.Backslash) {
			// \\.\C$\Users\...
			prefix = PathPart.DeviceNamespaceWin32;
			start = 4;
		} else {
			// \\server\share\...
			prefix = PathPart.DoubleSeparatorPosix;
			start = 2;
		}
	} else if (c1 === CharCode.Colon) {
		// Drive-letter paths (both absolute like C:\ and relative like C:folder)
		// Check if c0 is A-Z or a-z using bitwise OR to convert to lowercase
		const lower = c0 | CharCode.ToLowerMask;
		if (lower >= CharCode.LowerA && lower <= CharCode.LowerZ) prefix = PathPart.SeparatorPosix;
	}

	// Convert remaining backslashes to forward slashes using native replaceAll
	return normalizePathPosix(prefix + path.slice(start).replaceAll(PathPart.SeparatorWin32, PathPart.SeparatorPosix));
};

/** Returns whether the given path is Windows-like. */
export const isPathWin32Like = (path: string): path is string => path.includes("\\");
