import { Create, Vector3, clampScalar, multiplyAssignScalar } from 'xyzw/dist/vector3';
import { toFixed } from './real';
// eslint-disable-next-line @typescript-eslint/no-shadow
import { align, round, toString } from './vector3';
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
import { ColorSpace, linear } from './colorSpace';


const EXPR_HASH24 = /^#?(?<hex>[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const v = Create();


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

		clampScalar(v, v, 0.0, UNIT_TO_PCT);
	}
	else {
		multiplyAssignScalar(v, UNIT_TO_UINT8);

		if (settings.precision === cssPrecision.uint8) {
			round(v, v);

			digits = 0;
		}

		clampScalar(v, v, 0.0, UNIT_TO_UINT8);
	}

	return `rgb(${
		toFixed(v.x, digits) }${ unit }${ delim }${
		toFixed(v.y, digits) }${ unit }${ delim }${
		toFixed(v.z, digits) }${ unit })`;
}
