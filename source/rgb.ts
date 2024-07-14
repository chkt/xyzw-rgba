import { Create, Vector3, hadamard, multiplyAssignScalar } from 'xyzw/dist/vector3';
import { ColorSpace, linear } from './colorSpace';
import {
	CSS2_DELIM,
	CSS4_DELIM,
	CSS_MAX_DECIMALS,
	CSS_PCT,
	CssOptions,
	CssRgbString,
	HexOptions,
	UINT8_TO_PCT,
	UNIT_TO_PCT,
	UNIT_TO_UINT8,
	compressUint24,
	cssDefaults,
	cssFormat,
	cssPrecision,
	expandUint24,
	hexDefaults,
	parseCssUint8
} from './parse';
import { toFixed } from './real';
// eslint-disable-next-line @typescript-eslint/no-shadow
import { align, clamp, round, toString } from './vector3';


const EXPR_HASH24 = /^#?(?<hex>[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const HALF = 0.5;
const ONE_THIRD = 1.0 / 3.0;
const SIXTH_TURN = Math.PI / 3.0;
const Y709 = Create(0.2126, 0.7152, 0.0722);

const absfn = Math.abs;
const maxfn = Math.max;
const minfn = Math.min;

const v = Create();


/**
 * C = max(r,g,b) - min(r,g,b)
 */
export function chroma(rgb64:Vector3) : number {
	const { x, y, z } = rgb64;

	return maxfn(x, y, z) - minfn(x, y, z);
}


export function hue(rgb64:Vector3) : number {
	const { x, y, z } = rgb64;
	const max = maxfn(x, y, z);
	const c = max - minfn(x, y, z);

	if (c === 0.0) return 0.0;
	else if (max === x) return ((y - z) / c + 6.0) % 6.0 * SIXTH_TURN;
	else if (max === y) return ((z - x) / c + 2.0) * SIXTH_TURN;
	else return ((x - y) / c + 4.0) * SIXTH_TURN;
}

/**
 * S = C/(1 - |2L-1|)
 */
export function hSl(rgb64:Vector3) : number {
	const { x, y, z } = rgb64;
	const min = minfn(x, y, z), max = maxfn(x, y, z);
	const l = 1.0 - absfn(max + min - 1.0);

	if (l !== 0.0) return (max - min) / l;
	else return 0.0;
}

/**
 * S = C/V
 */
export function hSv(rgb64:Vector3) : number {
	const { x, y, z } = rgb64;
	const max = maxfn(x, y, z);

	if (max !== 0.0) return (max - minfn(x, y, z)) / max;
	else return 0.0;
}

/**
 * S = 1 - min(r,g,b)/I
 */
export function hSi(rgb64:Vector3) : number {
	const { x, y, z } = rgb64;
	const i = (x + y + z) * ONE_THIRD;

	if (i !== 0.0) return 1.0 - minfn(x, y, z) / i;
	else return 0.0;
}

/**
 * L = mean(max(r,g,b), min(r,g,b))
 */
export function hsL(rgb64:Vector3) : number {
	const { x, y, z } = rgb64;

	return (maxfn(x, y, z) + minfn(x, y, z)) * HALF;
}

/**
 * V = max(r,g,b)
 */
export function hsV(rgb64:Vector3) : number {
	const { x, y, z } = rgb64;

	return maxfn(x, y, z);
}

/**
 * I = mean(r,g,b)
 */
export function hsI(rgba64:Vector3) : number {
	const { x, y, z } = rgba64;

	return (x + y + z) * ONE_THIRD;
}

/**
 * Y' = RᵤRᵥ + GᵤGᵥ + BᵤBᵥ
 */
export function luma(rgb64:Vector3, coefficient:Vector3 = Y709) : number {
	const { x, y, z } = hadamard(v, rgb64, coefficient);

	return x + y + z;
}


export function Hex24(value:string, profile?:ColorSpace) : Vector3 {
	return hex24(Create(), value, profile);
}

export function hex24<R extends Vector3>(res:R, value:string, profile?:ColorSpace) : R {
	const match = EXPR_HASH24.exec(value);

	if (match === null) throw new Error(`bad hex '${ value }'`);

	const rgb = (match.groups as { hex : string }).hex;
	const len = rgb.length === 3 ? 1 : 2;
	const len2 = len * 2;

	const r = rgb.slice(0, len);
	const g = rgb.slice(len, len2);
	const b = rgb.slice(len2);

	res.x = Number.parseInt(r.padStart(2, r), 0x10);
	res.y = Number.parseInt(g.padStart(2, g), 0x10);
	res.z = Number.parseInt(b.padStart(2, b), 0x10);

	return expandUint24(res, res, profile);
}

export function toHex24(rgb64:Vector3, profile?:ColorSpace, opts?:Partial<HexOptions>) : string {
	if (Number.isNaN(rgb64.x + rgb64.y + rgb64.z)) throw new Error(`bad color ${ toString(rgb64) }`);

	const settings = { ...hexDefaults, ...opts };

	compressUint24(v, rgb64, profile);

	const r = v.x.toString(0x10).padStart(2, '0');
	const g = v.y.toString(0x10).padStart(2, '0');
	const b = v.z.toString(0x10).padStart(2, '0');

	const res = `${
		settings.hash ? '#' : '' }${
		// eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
		settings.short && r[0] === r[1] && g[0] === g[1] && b[0] === b[1] ? r[0] + g[0] + b[0] : r + g + b }`;

	return settings.uppercase ? res.toUpperCase() : res;
}

export function Uint24(value:number, profile?:ColorSpace) : Vector3 {
	return uint24(Create(), value, profile);
}

export function uint24<R extends Vector3>(res:R, value:number, profile?:ColorSpace) : R {
	// eslint-disable-next-line no-bitwise
	[ res.x, res.y, res.z ] = [ value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff ];

	return expandUint24(res, res, profile);
}

export function toUint24(rgb64:Vector3, profile?:ColorSpace) : number {
	compressUint24(v, rgb64, profile);

	// eslint-disable-next-line no-bitwise
	return v.x << 16 | v.y << 8 | v.z;
}


export function CssRgb(expr:CssRgbString, profile?:ColorSpace) : Vector3 {
	return cssRgb(Create(), expr, profile);
}

export function cssRgb<R extends Vector3>(res:R, expr:CssRgbString, profile?:ColorSpace) : R {
	const [ r, g, b ] = expr.slice(4, -1).split(CSS2_DELIM, 3);

	try {
		res.x = parseCssUint8(r.trim());
		res.y = parseCssUint8(g.trim());
		res.z = parseCssUint8(b.trim());
	}
	catch (err) {
		throw new Error(`bad css color '${ expr }'`);
	}

	return expandUint24(res, res, profile);
}

export function toCss(rgb64:Vector3, profile:ColorSpace = linear, opts?:Partial<CssOptions>) : CssRgbString {
	if (Number.isNaN(rgb64.x + rgb64.y + rgb64.z)) throw new Error(`bad rgb64 ${ toString(rgb64) }`);

	const settings = { ...cssDefaults, ...opts };
	const delim = settings.format === cssFormat.css4 ? CSS4_DELIM : CSS2_DELIM;

	let unit = '';
	let digits = Math.min(Math.max(settings.decimals, 0), CSS_MAX_DECIMALS);

	profile.compress(v, rgb64);

	if (settings.percent) {
		multiplyAssignScalar(v, UNIT_TO_PCT);

		unit = CSS_PCT;

		if (settings.precision === cssPrecision.uint8 && digits > 0) {
			align(v, v, UINT8_TO_PCT, 0.5 - 1e-10);

			digits = 1;
		}

		clamp(v, v, 0.0, UNIT_TO_PCT);
	}
	else {
		multiplyAssignScalar(v, UNIT_TO_UINT8);

		if (settings.precision === cssPrecision.uint8) {
			round(v, v);

			digits = 0;
		}

		clamp(v, v, 0.0, UNIT_TO_UINT8);
	}

	return `rgb(${
		toFixed(v.x, digits) }${ unit }${ delim }${
		toFixed(v.y, digits) }${ unit }${ delim }${
		toFixed(v.z, digits) }${ unit })`;
}
