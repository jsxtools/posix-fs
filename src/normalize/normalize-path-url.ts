import { CharCode } from "../types/char-code.js";
import type { PathLike } from "../types/path-like.js";
import { PathPart } from "../types/path-part.js";

/** Returns a normalized POSIX path from the given URL or URL-like string. */
export const normalizePathURL = (url: PathLike): string => {
	if (url instanceof URL) {
		return (url.hostname ? PathPart.DoubleSeparatorPosix + url.hostname : "") + decodeURIComponent(url.pathname);
	}

	let pos = url.indexOf(PathPart.Colon) + 1;

	if (url.charCodeAt(pos) === CharCode.Slash && url.charCodeAt(pos + 1) === CharCode.Slash) {
		pos += 2;

		const hostStart = pos;

		while (pos < url.length && url.charCodeAt(pos) !== CharCode.Slash) ++pos;

		const hostname = url.slice(hostStart, pos);
		const pathname = pos < url.length ? url.slice(pos) : PathPart.SeparatorPosix;

		return (hostname ? PathPart.DoubleSeparatorPosix + hostname : "") + decodeURIComponent(pathname);
	}

	return decodeURIComponent(url.slice(pos));
};

/** Returns whether the given path is a URL or a URL-like string. */
export const isPathURLLike = (url: PathLike): url is URL | `${string}:${string}` => {
	if (url instanceof URL) {
		return true;
	}

	const pos = url.indexOf(PathPart.Colon);
	const char = url.charCodeAt(0) | CharCode.ToLowerMask;

	return pos >= 2 && char >= CharCode.LowerA && char <= CharCode.LowerZ;
};
