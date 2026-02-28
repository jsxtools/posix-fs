import { normalizePath, normalizePathFromString } from "../normalize-path/normalize-path.js";
import type { PathLike } from "../types/path-like.js";
import type { ParsedPath } from "./parse-normalized-path.js";
import { parseNormalizedPath } from "./parse-normalized-path.js";

export type { ParsedPath } from "./parse-normalized-path.js";

/** Returns a parsed path from a string. */
export const parsePath = (path: PathLike): ParsedPath => parseNormalizedPath(normalizePath(path));

/** Returns a parsed path from a string. */
export const parsePathFromString = (path: string): ParsedPath => parseNormalizedPath(normalizePathFromString(path));
