import * as vec4 from 'xyzw/dist/vector4';
import { AngleUnit, angle, angleUnit, toFixed } from './real';
import * as vec4Rgba from './vector4';
import {
	CSS2_DELIM,
	CSS4_ALPHA,
	CSS4_DELIM,
	CSS_MAX_DECIMALS,
	CSS_PCT,
	CssHslString,
	CssHslaString,
	CssOptions,
	UINT8_TO_UNIT,
	UNIT_TO_PCT,
	cssDefaults,
	cssFormat,
	cssPrecision,
	parseCssAlpha,
	parseCssAngle,
	parseCssPercent
} from './parse';
import { ColorSpace, Transfer, linear } from './colorSpace';
import * as hslApi from './hsl';


export interface Hsla extends hslApi.Hsl {
	alpha : number;
}


const EXPR_CSS_HSLA = /^hsla?\(\s*([^\s,]+)\s*,?\s*([^\s,]+)\s*,?\s*([^\s,/]+)\s*(?:[,/]\s*([^\s)]+)\s*)?\)$/;


const absfn = Math.abs;
const minfn = Math.min;
const maxfn = Math.max;

const epsilon = 1e-10;
const cssResolution:Readonly<Record<AngleUnit, number>> = {
	[angleUnit.turn] : 4,
	[angleUnit.rad] : 3,
	[angleUnit.deg] : 1,
	[angleUnit.grad] : 1
};
const v = vec4.Create();
const ins = Create();


export function equals(a:Hsla, b:Hsla, e:number = epsilon) : boolean {
	return hslApi.equals(a, b, e) && absfn(a.alpha - b.alpha) < e;
}


export function Create(hue:number = 0.0, saturation:number = 0.0, lightness:number = 1.0, alpha:number = 1.0) : Hsla {
	return {
		hue,
		saturation,
		lightness,
		alpha
	};
}

export function assign<R extends Hsla>(
	res:R,
	hue:number = 0.0,
	saturation:number = 1.0,
	lightness:number = 1.0,
	alpha:number = 1.0
) : Hsla {
	res.hue = hue;
	res.saturation = saturation;
	res.lightness = lightness;
	res.alpha = alpha;

	return res;
}


export function Rgba(rgba64:vec4.Vector4, transfer?:Transfer) : Hsla {
	return rgba(Create(), rgba64, transfer);
}

export function rgba<R extends Hsla>(res:R, rgba64:vec4.Vector4, transfer?:Transfer) : R {
	res.alpha = rgba64.w;

	return hslApi.rgb(res, rgba64, transfer);
}

export function toRgba(hsla:Hsla, transfer?:Transfer) : vec4.Vector4 {
	return assignRgba(vec4.Create(), hsla, transfer);
}

export function assignRgba<R extends vec4.Vector4>(res:R, hsla:Hsla, transfer?:Transfer) : R {
	res.w = hsla.alpha;

	return hslApi.assignRgb(res, hsla, transfer);
}


export function Hsl(hsl64:hslApi.Hsl, alpha:number = 1.0) : Hsla {
	return Create(hsl64.hue, hsl64.saturation, hsl64.lightness, alpha);
}

export function hsl<R extends Hsla>(res:R, hsl64:hslApi.Hsl, alpha:number = 1.0) : Hsla {
	return assign(res, hsl64.hue, hsl64.saturation, hsl64.lightness, alpha);
}


export function CssHsla(expr:CssHslString | CssHslaString, profile?:ColorSpace) : Hsla {
	return rgba(Create(), cssHslaAssignRgba(v, expr, profile));
}

export function cssHsla<R extends Hsla>(res:R, expr:CssHslString | CssHslaString, profile?:ColorSpace) : Hsla {
	return rgba(res, cssHslaAssignRgba(v, expr, profile));
}

export function CssHslaToRgba(expr:CssHslString | CssHslaString, profile?:ColorSpace) : vec4.Vector4 {
	return cssHslaAssignRgba(vec4.Create(), expr, profile);
}

export function cssHslaAssignRgba<R extends vec4.Vector4>(
	res:R, expr:CssHslString | CssHslaString,
	profile:ColorSpace = linear
) : R {
	const match = EXPR_CSS_HSLA.exec(expr) as [ string, string, string, string, string | undefined ] | null;

	if (match === null) throw new Error(`bad css color '${ expr }'`);

	const [ , h, s, l, a ] = match;

	try {
		assignRgba(res, {
			hue : parseCssAngle(h),
			saturation : parseCssPercent(s),
			lightness : parseCssPercent(l),
			alpha : a !== undefined ? parseCssAlpha(a) : 1.0
		});
	}
	catch (err) {
		throw new Error(`bad css color '${ expr }'`);
	}

	return profile.expand(res, res);
}

export function toCss(
	hsla:Hsla,
	profile?:ColorSpace,
	opts?:Partial<CssOptions>
) : CssHslString | CssHslaString {
	return rgbaToCss(assignRgba(v, hsla), profile, opts);
}

export function rgbaToCss(
	rgba64:vec4.Vector4,
	profile:ColorSpace = linear,
	opts?:Partial<CssOptions>
) : CssHslString | CssHslaString {
	if (Number.isNaN(rgba64.x + rgba64.y + rgba64.z + rgba64.w)) throw new Error(`bad rgba64 ${ vec4Rgba.toString(rgba64) }`);

	const settings = { ...cssDefaults, ...opts };
	const digits = minfn(maxfn(settings.decimals, 0), CSS_MAX_DECIMALS);

	const [ cDel, aDel, aSig ] = settings.format === cssFormat.css4 ?
		[ CSS4_DELIM, CSS4_ALPHA, '' ] as const :
		[ CSS2_DELIM, CSS2_DELIM, 'a' ] as const;
	let hDec:number, sDec:number, lDec:number, aDec:number;
	let [ hUnit, aUnit, aScale ] = [ settings.angleUnit !== angleUnit.deg ? settings.angleUnit : '', '', 1.0 ];

	profile.compress(v, vec4.copy(v, rgba64));
	vec4Rgba.clamp(v, v, 0.0, 1.0);

	if (settings.precision === cssPrecision.uint8) {
		vec4Rgba.align(v, v, UINT8_TO_UNIT, 0.5 - 1e-10);

		[ hDec, sDec, lDec, aDec ] = [ cssResolution[settings.angleUnit], 1, 1, 3 ];
	}
	else [ hDec, sDec, lDec, aDec ] = [
		maxfn(digits - 4 + cssResolution[settings.angleUnit], 0),
		maxfn(digits - 2, 0),
		maxfn(digits - 2, 0),
		digits
	];

	if (settings.percent) [ aScale, aDec, aUnit ] = [ UNIT_TO_PCT, maxfn(aDec - 2, 0), CSS_PCT ];

	const hsla = rgba(ins, v);
	const res = `${
		toFixed(angle(hsla.hue, angleUnit.rad, settings.angleUnit), hDec) }${ hUnit }${ cDel }${
		toFixed(hsla.saturation * UNIT_TO_PCT, sDec) }${ CSS_PCT }${ cDel }${
		toFixed(hsla.lightness * UNIT_TO_PCT, lDec) }${ CSS_PCT }`;

	if (rgba64.w >= 1.0) return `hsl(${ res })`;
	else return `hsl${
		aSig }(${ res }${ aDel }${
		toFixed(v.w * aScale, aDec) }${ aUnit })`;
}


export function Copy(hsla:Hsla) : Hsla {
	return { ...hsla };
}

export function copy<R extends Hsla>(res:R, hsla:Hsla) : R {
	res.hue = hsla.hue;
	res.saturation = hsla.saturation;
	res.lightness = hsla.lightness;
	res.alpha = hsla.alpha;

	return res;
}
