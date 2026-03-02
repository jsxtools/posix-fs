import { normalizePath, normalizePathString, normalizePathURL } from "../normalize/normalize.js";
import type { ParsedPath } from "../parse/parse-normalized-path.js";
import { parseNormalizedPath } from "../parse/parse-normalized-path.js";
import type { PathLike } from "../types/path-like.js";

export type { ParsedPath } from "../parse/parse-normalized-path.js";

/** Returns a parsed object representing the given string or URL as a normalized POSIX path. */
export const parsePath = (path: PathLike): ParsedPath => parseNormalizedPath(normalizePath(path));

/** Returns a parsed object representing the given string as a normalized POSIX path. */
export const parsePathString = (path: string): ParsedPath => parseNormalizedPath(normalizePathString(path));

/** Returns a parsed object representing the given URL or URL-like string as a normalized POSIX path. */
export const parsePathURL = (url: URL | `${string}:${string}`): ParsedPath =>
	parseNormalizedPath(normalizePathURL(url));
