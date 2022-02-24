import * as vec3 from 'xyzw/dist/vector3';
import { angle, angleUnit, toFixed } from './real';
// eslint-disable-next-line @typescript-eslint/no-shadow
import { clamp, toString } from './vector3';
import {
	CSS2_DELIM, CSS4_DELIM, CSS_MAX_DECIMALS, CSS_PCT, CssHslString, CssOptions,
	TURN_TO_RAD,
	UNIT_TO_PCT,
	cssDefaults,
	cssFormat,
	parseCssAngle,
	parseCssPercent
} from './parse';
import { ColorSpace, Transfer, identity, linear } from './colorSpace';
import { Hsla } from './hsla';


export interface Hsl {
	hue : number;
	saturation : number;
	lightness : number;
}


const PI_DIV_THREE = Math.PI / 3.0;
const THREE_DIV_PI = 1.0 / PI_DIV_THREE;

const abs = Math.abs;
const maxfn = Math.max;
const minfn = Math.min;

const epsilon = 1e-10;
const v0 = vec3.Create();
const v1 = vec3.Create();
const ins = Create();
const white:Hsl = { hue : 0.0, saturation : 0.0, lightness : 1.0 };


export function equals(a:Hsl, b:Hsl, e:number = epsilon) : boolean {
	return abs(a.hue - b.hue) < e &&
		abs(a.saturation - b.saturation) < e &&
		abs(a.lightness - b.lightness) < e;
}


export function chroma(hsl:Hsl) : number {
	return (1.0 - abs(2.0 * minfn(maxfn(hsl.lightness, 0.0), 1.0) - 1.0)) * minfn(maxfn(hsl.saturation, 0.0), 1.0);
}

/**
 * H mod 2π ((H % 2π + 2π) % 2π)
 */
export function normalizeHue(hsl:Hsl) : number {
	const h = hsl.hue % TURN_TO_RAD;

	return h + (h < 0.0 ? TURN_TO_RAD : 0.0);
}


export function Create(hue:number = 0.0, saturation:number = 0.0, lightness:number = 1.0) : Hsl {
	return {
		hue,
		saturation,
		lightness
	};
}

export function assign<R extends Hsl>(res:R, hue:number = 0.0, saturation:number = 1.0, lightness = 1.0) : R {
	res.hue = hue;
	res.saturation = saturation;
	res.lightness = lightness;

	return res;
}

export function Rgb(rgb64:vec3.Vector3, transfer?:Transfer) : Hsl {
	return rgb(Create(), rgb64, transfer);
}

export function rgb<R extends Hsl>(res:R, rgb64:vec3.Vector3, transfer:Transfer = identity) : R {
	const { x : r, y : g, z : b } = transfer(v0, rgb64);

	const max = maxfn(r, g, b);
	const min = minfn(r, g, b);
	const c = max - min;

	res.lightness = 0.5 * (max + min);

	if (c === 0.0) {
		res.hue = 0.0;
		res.saturation = 0.0;

		return res;
	}

	if (max === r) res.hue = ((g - b) / c + 6.0) % 6.0;
	else if (max === g) res.hue = (b - r) / c + 2.0;
	else res.hue = (r - g) / c + 4.0;

	res.hue *= PI_DIV_THREE;
	res.saturation = c / (1.0 - abs(2.0 * res.lightness - 1.0));

	return res;
}

export function toRgb(hsl:Hsl, transfer?:Transfer) : vec3.Vector3 {
	return assignRgb(vec3.Create(), hsl, transfer);
}

export function assignRgb<R extends vec3.Vector3>(res:R, hsl:Hsl, transfer:Transfer = identity) : R {
	const h = normalizeHue(hsl) * THREE_DIV_PI;
	const c = chroma(hsl);
	const x = c * (1.0 - abs(h % 2.0 - 1.0));

	let r = Number.NaN, g = r, b = r;

	if (h < 1.0) [ r, g, b ] = [ c, x, 0.0 ];
	else if (h < 2.0) [ r, g, b ] = [ x, c, 0.0 ];
	else if (h < 3.0) [ r, g, b ] = [ 0.0, c, x ];
	else if (h < 4.0) [ r, g, b ] = [ 0.0, x, c ];
	else if (h < 5.0) [ r, g, b ] = [ x, 0.0, c ];
	else if (h < 6.0) [ r, g, b ] = [ c, 0.0, x ];

	const min = hsl.lightness - 0.5 * c;

	res.x = r + min;
	res.y = g + min;
	res.z = b + min;

	return transfer(res, res);
}


export function Hsla(hsla64:Hsla, matte:Hsl = white) : Hsl {
	return Rgb(vec3.lerp(v0, assignRgb(v0, matte), assignRgb(v1, hsla64), hsla64.alpha));
}

export function hsla<R extends Hsl>(res:R, hsla64:Hsla, matte:Hsl = white) : R {
	return rgb(res, vec3.lerp(v0, assignRgb(v0, matte), assignRgb(v1, hsla64), hsla64.alpha));
}


export function CssHsl(expr:CssHslString, profile?:ColorSpace) : Hsl {
	return rgb(Create(), cssHslAssignRgb(v0, expr, profile));
}

export function cssHsl<R extends Hsl>(res:R, expr:CssHslString, profile?:ColorSpace) : R {
	return rgb(res, cssHslAssignRgb(v0, expr, profile));
}

export function CssHslToRgb(expr:CssHslString, profile?:ColorSpace) : vec3.Vector3 {
	return cssHslAssignRgb(vec3.Create(), expr, profile);
}

export function cssHslAssignRgb<R extends vec3.Vector3>(res:R, expr:CssHslString, profile:ColorSpace = linear) : R {
	const [ h, s, l ] = expr.slice(4, -1).split(CSS2_DELIM, 3);

	try {
		assignRgb(res, {
			hue : parseCssAngle(h.trim()),
			saturation : parseCssPercent(s.trim()),
			lightness : parseCssPercent(l.trim())
		});
	}
	catch (err) {
		throw new Error(`bad css color '${ expr }'`);
	}

	return profile.expand(res, res);
}

export function toCss(hsl:Hsl, profile?:ColorSpace, opts?:Partial<CssOptions>) : CssHslString {
	return rgbToCss(assignRgb(v0, hsl), profile, opts);
}

export function rgbToCss(rgb64:vec3.Vector3, profile:ColorSpace = linear, opts?:Partial<CssOptions>) : CssHslString {
	if (Number.isNaN(rgb64.x + rgb64.y + rgb64.z)) throw new Error(`bad rgb64 ${ toString(rgb64) }`);

	const settings = { ...cssDefaults, ...opts };
	const delim = settings.format === cssFormat.css4 ? CSS4_DELIM : CSS2_DELIM;

	const unit = settings.angleUnit === angleUnit.deg ? '' : settings.angleUnit;
	const digits = minfn(maxfn(settings.decimals, 0), CSS_MAX_DECIMALS);

	const w = clamp(v0, profile.compress(v0, rgb64), 0.0, 1.0);
	const hsl = rgb(ins, w);

	return `hsl(${
		toFixed(angle(hsl.hue, angleUnit.rad, settings.angleUnit), digits) }${ unit }${ delim }${
		toFixed(hsl.saturation * UNIT_TO_PCT, digits) }${ CSS_PCT }${ delim }${
		toFixed(hsl.lightness * UNIT_TO_PCT, digits) }${ CSS_PCT })`;
}


export function Copy(hsl:Hsl) : Hsl {
	return { ...hsl };
}

export function copy<R extends Hsl>(res:R, hsl:Hsl) : R {
	res.hue = hsl.hue;
	res.saturation = hsl.saturation;
	res.lightness = hsl.lightness;

	return res;
}
