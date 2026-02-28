// Patch URL constructor to support file:// URLs in Firefox
{
	const __URL = globalThis.URL;
	const __patchStr = (uri) => (uri.startsWith("file:/") ? "file+" + uri.slice(4) : uri);
	const __patchURL = (url) => __patchStr(url instanceof __URL ? url.toString() : url);

	__URL.prototype.constructor = Object.assign(globalThis, {
		URL: function URL(...args) {
			return Reflect.construct(__URL, args.map(__patchURL));
		},
	}).URL;

	globalThis.URL.prototype = __URL.prototype;
}
