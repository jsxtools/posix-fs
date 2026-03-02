import { CharCode } from "../types/char-code.js";

/** Returns a parsed representation of a normalized POSIX path. */
export const parseNormalizedPath = (path: string): ParsedPath => {
	const sizeOfPath = path.length;

	/** Whether the path is absolute. */
	const isAbsolute = sizeOfPath > 0 && path.charCodeAt(0) === CharCode.Slash;

	/** Whether the path is a directory. */
	const isDirectory = sizeOfPath > 0 && path.charCodeAt(sizeOfPath - 1) === CharCode.Slash;

	/** Position of the filename. */
	let indexOfName = 0;

	for (let i = sizeOfPath - (isDirectory ? 2 : 1); i >= 0; --i) {
		if (path.charCodeAt(i) === CharCode.Slash) {
			indexOfName = i + 1;

			break;
		}
	}

	// Root path edge case: "/" has no name segment
	if (isDirectory && indexOfName === 0 && isAbsolute) indexOfName = sizeOfPath;

	const name = path.slice(indexOfName);
	const dir = path.slice(0, indexOfName);
	const sizeOfName = name.length;

	/** Whether the name is "." or "..". */
	let isSpecial = false;

	if (sizeOfName === 1) {
		isSpecial = name.charCodeAt(0) === CharCode.Dot; // "."
	} else if (sizeOfName === 2) {
		isSpecial = name.charCodeAt(0) === CharCode.Dot && name.charCodeAt(1) === CharCode.Dot; // ".."
	}

	/** Whether the name represents a dotfile. */
	const isDotFile = sizeOfName > 1 && !isDirectory && !isSpecial && name.charCodeAt(0) === CharCode.Dot;

	/** Position of the last dot in the name. */
	let indexOfLastDot = -1;
	if (!isDirectory && !isSpecial) {
		for (let i = sizeOfName - 1; i >= 0; --i) {
			if (name.charCodeAt(i) === CharCode.Dot) {
				indexOfLastDot = i;
				break;
			}
		}
	}

	/** Computed basename and extension. */
	let basename = isDirectory ? name.slice(0, -1) : name;
	let extension: string | null = null;

	// only compute these separately if there is a last dot that is not the first character
	if (indexOfLastDot > 0) {
		basename = name.slice(0, indexOfLastDot);
		extension = name.slice(indexOfLastDot + 1);
	}

	return {
		path,
		name,
		dir,
		basename,
		extension,
		isAbsolute,
		isDirectory,
		isDotFile,
	};
};

/** Represents a parsed path. */
export interface ParsedPath {
	/** The full normalized path. */
	path: string;

	/** The file or directory name, including extension. */
	name: string;

	/** The directory portion of the path. */
	dir: string;

	/** The file name without extension. */
	basename: string;

	/** The file extension, or null if none. */
	extension: string | null;

	/** Whether the path is absolute. */
	isAbsolute: boolean;

	/** Whether the path represents a directory. */
	isDirectory: boolean;

	/** Whether the name is a dotfile. */
	isDotFile: boolean;
}
