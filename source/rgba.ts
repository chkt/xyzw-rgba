import * as vec3 from 'xyzw/dist/vector3';
import * as vec4 from 'xyzw/dist/vector4';
import { toFixed } from './real';
import * as vec3Rgb from './vector3';
import * as vec4Rgb from './vector4';
import {
	CSS2_DELIM, CSS4_ALPHA,
	CSS4_DELIM,
	CSS_MAX_DECIMALS, CSS_PCT,
	CssOptions, CssRgbString,
	CssRgbaString, HexOptions,
	UINT8_TO_PCT, UINT8_TO_UNIT,
	UNIT_TO_PCT,
	UNIT_TO_UINT8,
	cssDefaults, cssFormat, cssPrecision, expandUint24, hexDefaults, parseCssUint8, parseCssUnitInterval
} from './parse';
import { ColorSpace, linear } from './colorSpace';


const EXPR_HASH32 = /^#?(?<hex>[0-9A-Fa-f]{4}|[0-9A-Fa-f]{8})$/;
const EXPR_CSS_RGBA = /^rgba?\(\s*([^\s,]+)\s*,?\s*([^\s,]+)\s*,?\s*([^\s,/]+)\s*(?:[,/]\s*([^\s)]+)\s*)?\)$/;


const v = vec4.Create();


export function Hex32(value:string, profile?:ColorSpace) : vec4.Vector4 {
	return hex32(vec4.Create(), value, profile);
}

export function hex32<R extends vec4.Vector4>(res:R, value:string, profile:ColorSpace = linear) : R {
	const match = EXPR_HASH32.exec(value);

	if (match === null) throw new Error(`bad hex '${ value }'`);

	const rgba = (match.groups as { hex : string }).hex;
	const len = rgba.length === 4 ? 1 : 2;
	const len2 = len * 2;
	const len3 = len * 3;

	const r = rgba.slice(0, len);
	const g = rgba.slice(len, len2);
	const b = rgba.slice(len2, len3);
	const a = rgba.slice(len3);

	res.x = Number.parseInt(r.padStart(2, r), 0x10);
	res.y = Number.parseInt(g.padStart(2, g), 0x10);
	res.z = Number.parseInt(b.padStart(2, b), 0x10);
	res.w = Number.parseInt(a.padStart(2, a), 0x10);

	return profile.expand(res, vec4.multiplyAssignScalar(res, UINT8_TO_UNIT));
}

export function toHex32(rgba64:vec4.Vector4, profile:ColorSpace = linear, opts?:Partial<HexOptions>) : string {
	if (Number.isNaN(rgba64.x + rgba64.y + rgba64.z + rgba64.w)) throw new Error(`bad rgba64 ${ vec4Rgb.toString(rgba64) }`);

	const settings = { ...hexDefaults, ...opts };

	profile.compress(v, vec4.copy(v, rgba64));
	vec4.multiplyAssignScalar(v, UNIT_TO_UINT8);
	vec4Rgb.round(v, v);
	vec4Rgb.clamp(v, v, 0.0, UNIT_TO_UINT8);

	const r = v.x.toString(0x10).padStart(2, '0');
	const g = v.y.toString(0x10).padStart(2, '0');
	const b = v.z.toString(0x10).padStart(2, '0');
	const a = v.w.toString(0x10).padStart(2, '0');

	const res = `${
		settings.hash ? '#' : '' }${
		// eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
		settings.short && r[0] === r[1] && g[0] === g[1] && b[0] === b[1] && a[0] === a[1] ?
			r[0] + g[0] + b[0] + a[0] :
			r + g + b + a }`;

	return settings.uppercase ? res.toUpperCase() : res;
}


export function CssRgba(expr:CssRgbString | CssRgbaString, profile?:ColorSpace) : vec4.Vector4 {
	return cssRgba(vec4.Create(), expr, profile);
}

export function cssRgba<R extends vec4.Vector4>(
	res:R,
	expr:CssRgbString | CssRgbaString,
	profile:ColorSpace = linear
) : R {
	const match = EXPR_CSS_RGBA.exec(expr) as [string, string, string, string, string | undefined] | null;

	if (match === null) throw new Error(`bad css color '${ expr }'`);

	const [ , r, g, b, a ] = match;

	try {
		res.x = parseCssUint8(r);
		res.y = parseCssUint8(g);
		res.z = parseCssUint8(b);
		res.w = a !== undefined ? parseCssUnitInterval(a) : 1.0;
	}
	catch (err) {
		throw new Error(`bad css color '${ expr }'`);
	}

	return expandUint24(res, res, profile);
}

export function toCss(
	rgba64:vec4.Vector4,
	profile:ColorSpace = linear,
	opts?:Partial<CssOptions>
) : CssRgbString | CssRgbaString {
	if (Number.isNaN(rgba64.x + rgba64.y + rgba64.z + rgba64.w)) throw new Error(`bad rgba64 ${ vec4Rgb.toString(rgba64) }`);

	const settings = { ...cssDefaults, ...opts };
	const css4 = settings.format === cssFormat.css4;
	const rgbDelim = css4 ? CSS4_DELIM : CSS2_DELIM;

	let unit = '';
	let rgbDigits = Math.min(Math.max(settings.decimals, 0), CSS_MAX_DECIMALS);
	let alphaDigits = rgbDigits;

	profile.compress(v, vec4.copy(v, rgba64));

	if (settings.percent) {
		vec4.multiplyAssignScalar(v, UNIT_TO_PCT);

		unit = CSS_PCT;

		if (settings.precision === cssPrecision.uint8 && rgbDigits > 0) {
			vec4Rgb.align(v, v, UINT8_TO_PCT, 0.5 - 1e-10);

			rgbDigits = 1;
			alphaDigits = rgbDigits;
		}

		vec4Rgb.clamp(v, v, 0.0, UNIT_TO_PCT);
	}
	else {
		vec3.multiplyAssignScalar(v, UNIT_TO_UINT8);

		if (settings.precision === cssPrecision.uint8) {
			vec4Rgb.alignAssignAlpha(vec3Rgb.round(v, v), UINT8_TO_UNIT);

			rgbDigits = 0;
			alphaDigits = Math.min(alphaDigits, 3);
		}

		vec4Rgb.clampAssignAlpha(vec3.clampScalar(v, v, 0.0, UNIT_TO_UINT8), 0.0, 1.0);
	}

	const res = `${
		toFixed(v.x, rgbDigits) }${ unit }${ rgbDelim }${
		toFixed(v.y, rgbDigits) }${ unit }${ rgbDelim }${
		toFixed(v.z, rgbDigits) }${ unit }`;

	if (rgba64.w >= 1.0) return `rgb(${ res })`;
	else {
		return `rgb${ css4 ? '' : 'a' }(${
			res }${ css4 ? CSS4_ALPHA : CSS2_DELIM }${
			toFixed(v.w, alphaDigits) }${ unit })`;
	}
}
