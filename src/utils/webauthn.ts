export const base64urlToUint8Array = (input: string): Uint8Array => {
	const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

export const bufferToBase64 = (buffer: ArrayBuffer): string => {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};
