import {
	CSS4_ALPHA,
	CSS4_DELIM,
	CSS_MAX_DECIMALS,
	CssLchString,
	CssOptions,
	UINT8_TO_PCT,
	UINT8_TO_UNIT,
	UNIT_TO_PCT,
	createNumberOrPercentParser,
	cssDefaults,
	cssPrecision,
	parseCssAlpha,
	parseCssAngle,
	parseCssLabLightness
} from './parse';
import { align, angle, angleUnit, clamp, interval, toFixed } from './real';
import * as labApi from './lab';


export interface Lch {
	lightness : number;
	chroma : number;
	hue : number;
	alpha : number;
}


const EXPR_CSS_LCH = /^lch\(\s*(\S+)\s*(\S+)\s*([^\s/]+)\s*(?:\/\s*(\S+)\s*)?\)$/;
const TAU = 2.0 * Math.PI;
const EPSILON = 1e-10;

const { abs : absfn, max : maxfn, min : minfn, atan2 : atan2fn, sqrt : sqrtfn } = Math;
const nanfn = Number.isNaN;
const parseChroma = createNumberOrPercentParser({ percentScale : 1.5, clampMin : 0.0 });


export function equals(a:Lch, b:Lch, e:number = EPSILON) : boolean {
	return absfn(a.lightness - b.lightness) < e &&
		absfn(a.chroma - b.chroma) < e &&
		absfn(interval(a.hue, 0.0, TAU) - interval(b.hue, 0.0, TAU)) < e &&
		absfn(a.alpha - b.alpha) < e;
}

export function isChromaHuePowerless(lch:Lch, e:number = EPSILON) : boolean {
	return nanfn(lch.lightness) || absfn(lch.lightness) < e;
}

export function isHuePowerless(lch:Lch, e:number = EPSILON) : boolean {
	return nanfn(lch.lightness + lch.chroma) || absfn(lch.lightness) < e || absfn(lch.chroma) < e;
}

export function Create(lightness:number = 100.0, chroma:number = 0.0, hue:number = 0.0, alpha:number = 1.0) : Lch {
	return { lightness, chroma, hue, alpha };
}

export function assign<R extends Lch>(
	res:R,
	lightness:number = 100.0,
	chroma:number = 0.0,
	hue:number = 0.0,
	alpha:number = 1.0
) : R {
	res.lightness = lightness;
	res.chroma = chroma;
	res.hue = hue;
	res.alpha = alpha;

	return res;
}

export function Lab(color:labApi.Lab) : Lch {
	return lab(Create(), color);
}

export function lab<R extends Lch>(res:R, color:labApi.Lab) : R {
	const { lightness, a, b, alpha } = color;

	res.lightness = lightness;
	res.chroma = sqrtfn(a ** 2 + b ** 2);
	res.hue = atan2fn(b, a);
	res.alpha = alpha;

	return res;
}

export function toLab(lch:Lch) : labApi.Lab {
	return assignLab(labApi.Create(), lch);
}

export function assignLab<R extends labApi.Lab>(res:R, lch:Lch) : R {
	const { lightness, chroma, hue, alpha } = lch;

	res.lightness = lightness;
	res.a = chroma * Math.cos(hue);
	res.b = chroma * Math.sin(hue);
	res.alpha = alpha;

	return res;
}

export function CssLch(expr:CssLchString) : Lch {
	return cssLch(Create(), expr);
}

export function cssLch<R extends Lch>(res:R, expr:CssLchString) : R {
	const match = EXPR_CSS_LCH.exec(expr) as [ string, string, string, string, string | undefined ] | null;

	if (match === null) throw new Error(`bad css color '${ expr }'`);

	const [ , l, c, h, a ] = match;

	try {
		res.lightness = parseCssLabLightness(l);
		res.chroma = parseChroma(c);
		res.hue = parseCssAngle(h);
		res.alpha = a !== undefined ? parseCssAlpha(a) : 1.0;
	}
	catch (err) {
		throw new Error(`bad css color '${ expr }'`);
	}

	return res;
}

export function toCss(lch:Lch, opts?:Partial<CssOptions>) : CssLchString {
	let { lightness, chroma, hue, alpha } = lch;

	if (Number.isNaN(lightness + chroma + hue + alpha)) throw new Error(`bad lch "${
		lightness.toFixed(2) } ${
		chroma.toFixed(2) } ${
		hue.toFixed(2) } ${
		alpha.toFixed(2) }"`);

	lightness = maxfn(lightness, 0.0);
	chroma = maxfn(chroma, 0.0);
	hue = interval(hue, 0.0, TAU);
	alpha = clamp(alpha, 0.0, 1.0);

	const settings = { ...cssDefaults, ...opts };
	const lchDigits = clamp(settings.decimals, 0, CSS_MAX_DECIMALS);
	let alphaDigits = lchDigits;
	let unit = '';

	if (settings.percent) {
		chroma *= 1.0 / 1.5;
		alpha *= UNIT_TO_PCT;
		unit = '%';

		if (settings.precision === cssPrecision.uint8) {
			alpha = align(alpha, UINT8_TO_PCT, 0.5 - 1e10);
			alphaDigits = 1;
		}
	}
	else if (settings.precision === cssPrecision.uint8) {
		alpha = align(alpha, UINT8_TO_UNIT);
		alphaDigits = minfn(alphaDigits, 3);
	}

	let res = `${
		toFixed(lightness, lchDigits) }${ unit }${ CSS4_DELIM }${
		toFixed(chroma, lchDigits) }${ unit }${ CSS4_DELIM }${
		toFixed(angle(hue, angleUnit.rad, settings.angleUnit), lchDigits) }${
		settings.angleUnit !== angleUnit.deg ? settings.angleUnit : '' }`;

	if (alpha !== 1.0) res += `${ CSS4_ALPHA }${ toFixed(alpha, alphaDigits) }${ unit }`;

	return `lch(${ res })`;
}

export function Copy(lch:Lch) : Lch {
	return { ...lch };
}

export function copy<R extends Lch>(res:R, lch:Lch) : R {
	res.lightness = lch.lightness;
	res.chroma = lch.chroma;
	res.hue = lch.hue;
	res.alpha = lch.alpha;

	return res;
}
