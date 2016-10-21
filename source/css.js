const INT_DEC = '\\s*(\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\s*';
const INT_DEG = '\\s*(\\d|[1-9]\\d|[12]\\d{2}|3[0-5]\\d|360)\\s*';
const INT_PCT = '\\s*(\\d|[1-9]\\d|100)%\\s*';
const FLOAT_CLAMPED = '\\s*(0(?:\\.\\d+)?|1(?:\\.(?:0+|\\d+e-\\d+))?)\\s*';

const EXPR_HASH = new RegExp(`^#([0-9a-f]{3}|[0-9a-f]{6})$`,'i');
const EXPR_RGB = new RegExp(`^(rgb)\\(${ INT_DEC },${ INT_DEC },${ INT_DEC }\\)$`);
const EXPR_RGBA = new RegExp(`^(rgb)a\\(${ INT_DEC },${ INT_DEC },${ INT_DEC },${ FLOAT_CLAMPED }\\)$`, 'i');
const EXPR_HSL = new RegExp(`^(hsl)\\(${ INT_DEG },${ INT_PCT },${ INT_PCT }\\)$`);
const EXPR_HSLA = new RegExp(`^(hsl)a\\(${ INT_DEG },${ INT_PCT },${ INT_PCT },${ FLOAT_CLAMPED }\\)$`, 'i');

const EXPRESSION_LIST = [
	EXPR_RGBA,
	EXPR_HSLA,
	EXPR_HSL,
	EXPR_RGB
];


const COLOR_MAP = {
	black : '000',
	silver : 'c0c0c0',
	gray : '808080',
	white : 'fff',
	maroon : '800000',
	red : 'f00',
	purple : '800080',
	fuchsia : 'f0f',
	green : '008000',
	lime : '0f0',
	olive : '808000',
	yellow : 'ff0',
	navy : '000080',
	blue : '00f',
	teal : '008080',
	aqua : '0ff',
	orange : 'ffa500'
};

const ALIAS_NAME = [
	'transparent'
];

const ALIAS_STR = [
	'rgba(0,0,0,0)'
];


function _getDescriptor(type, c0, c1, c2, alpha = 1.0) {
	return {
		type,
		components : [
			c0,
			c1,
			c2,
			alpha
		]
	};
}

function _parseHash(hash) {
	const segs = hash.split('');

	if (segs.length === 3) {
		segs.splice(2, 0, segs[2]);
		segs.splice(1, 0, segs[1]);
		segs.splice(0, 0, segs[0]);
	}

	return [
		Number.parseInt(`0x${ segs.slice(0, 2).join('') }`),
		Number.parseInt(`0x${ segs.slice(2, 4).join('') }`),
		Number.parseInt(`0x${ segs.slice(4, 6).join('') }`),
		1.0
	];
}

function _stringifyHash(rgb) {
	let res = '', short = true;

	for (let cmp of rgb) {
		let str = cmp.toString(16);

		if (str.length === 1) str = `0${ str }`;

		if (str[0] !== str[1]) short = false;

		res += str;
	}

	return short ? res[0] + res[2] + res[4] : res;
}


function _stringifyHSL([h, s, l, a]) {
	if (
		!Number.isSafeInteger(h) || h < 0 || h > 360 ||
		!Number.isSafeInteger(s) || s < 0 || s > 100 ||
		!Number.isSafeInteger(l) || l < 0 || l > 100 ||
		typeof a !== 'number' || a < 0 || a > 1
	) throw new TypeError();

	const hsl = `${ h },${ s }%,${ l }%`;

	return a === 1.0 ? `hsl(${ hsl })` : `hsla(${ hsl },${ a })`;
}

function _stringifyRGB([r, g, b, a]) {
	if (
		!Number.isSafeInteger(r) || r < 0 || r > 255 ||
		!Number.isSafeInteger(g) || g < 0 || g > 255 ||
		!Number.isSafeInteger(b) || b < 0 || b > 255 ||
		typeof a !== 'number' || a < 0 || a > 1
	) throw new TypeError();

	if (a !== 1.0) return `rgba(${ r },${ g },${ b },${ a })`;

	const hash = _stringifyHash([r, g, b]);

	for (let name in COLOR_MAP) {
		if (COLOR_MAP[name] !== hash) continue;

		if (name.length < hash.length + 1) return name;

		break;
	}

	return `#${ hash }`;
}


export function addAliases(items) {
	for (let name in items) {
		ALIAS_NAME.push(name);
		ALIAS_STR.push(items[name]);
	}
}

export function resetAliases() {
	const len = ALIAS_STR.length;

	ALIAS_NAME.splice(0, len);
	ALIAS_NAME.push('transparent');

	ALIAS_STR.splice(0, len);
	ALIAS_STR.push('rgba(0,0,0,0)');
}


export function parse(css) {
	if (typeof css !== 'string') throw new Error();

	css = css.trim();

	const index = ALIAS_NAME.indexOf(css);

	if (index !== -1) css = ALIAS_STR[index];

	const match = css.match(EXPR_HASH);

	if (match !== null) return _getDescriptor('rgb', ..._parseHash(match[1]));

	for (let expr of EXPRESSION_LIST) {
		const match = css.match(expr);

		if (match !== null) return _getDescriptor(...match.slice(1));
	}

	throw new Error();
}

export function stringify({ type, components }) {
	if (
		type !== 'rgb' && type !== 'hsl' ||
		!Array.isArray(components)
	) throw new TypeError();

	let res = '';

	switch (type) {
		case 'hsl':
			res = _stringifyHSL(components);

			break;

		case 'rgb':
			res = _stringifyRGB(components);

			break;

		default : throw new Error();
	}

	const index = ALIAS_STR.indexOf(res);

	return index === -1 ? res : ALIAS_NAME[index];
}


addAliases(COLOR_MAP);
