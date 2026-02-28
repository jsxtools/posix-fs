import type { PathLike } from "../types/path-like.js";

/** Returns a normalized POSIX path from a URL path. */
export const normalizePathURL = (url: PathLike, base: PathLike = baseURL): string => (
	(url = new URL(url, base)), (url.hostname ? `//${url.hostname}` : "") + decodeURIComponent(url.pathname)
);

/** Returns whether the given URL or string would match a file URL. */
export const isPathURLLike = (url: PathLike): url is URL | `file:${string}` =>
	url instanceof URL || url.startsWith(baseURL);

const baseURL = "file:/";
