const PI_DIV_THREE = Math.PI / 3.0;
const THREE_DIV_PI = 3.0 / Math.PI;



export function chroma(s, l) {
	return (1.0 - Math.abs(2.0 * l - 1.0)) * s;
}


export function hslToRgb([h, s, l]) {
	h *= THREE_DIV_PI;

	const c = chroma(s, l);
	const x = c * (1.0 - Math.abs(h % 2.0 - 1.0));

	let r, g, b;

	if (h >= 0.0 && h < 1.0) r = c, g = x, b = 0.0;
	else if (h >= 1.0 && h < 2.0) r = x, g = c, b = 0.0;
	else if (h >= 2.0 && h < 3.0) r = 0.0, g = c, b = x;
	else if (h >= 3.0 && h < 4.0) r = 0.0, g = x, b = c;
	else if (h >= 4.0 && h < 5.0) r = x, g = 0.0, b = c;
	else r = c, g = 0.0, b = x;

	const min = l - 0.5 * c;

	return [
		r + min,
		g + min,
		b + min
	];
}

export function rgbToHsl([r, g, b]) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let h, s, l, c = max - min;

	if (c === 0.0) h = 0.0;
	else if (max === r) h = (g - b) / c % 6.0;
	else if (max === g) h = (b - r) / c + 2.0;
	else h = (r - g) / c + 4.0;

	h *= PI_DIV_THREE;
	l = 0.5 * (max + min);

	if (c === 0.0) s = 0.0;
	else s = c / (1.0 - Math.abs(2.0 * l - 1.0));

	return [h, s, l];
}
