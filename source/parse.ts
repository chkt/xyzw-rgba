import { Vector3, clampScalar, multiplyAssignScalar, multiplyScalar } from 'xyzw/dist/vector3';
import { AngleUnit, angle, angleUnit, clamp, interval } from './real';
import { round } from './vector3';
import { ColorSpace, linear } from './colorSpace';


interface ParseNumberOrPercentOptions {
	percentScale : number;
	clampMin : number;
	clampMax : number;
	assertMin : number;
	assertMax : number;
}

type parseNumber = (value:string) => number;

export interface HexOptions {
	readonly hash : boolean;
	readonly uppercase : boolean;
	readonly short : boolean;
}

export type CssRgbString = `rgb(${ string })`;
export type CssRgbaString = CssRgbString | `rgba(${ string })`;
export type CssHslString = `hsl(${ string })`;
export type CssHslaString = CssHslString | `hsla(${ string })`;
export type CssLabString = `lab(${ string })`;

export type CssPrecision = 8 | 64;
export type CssFormat = 2 | 4;
export interface CssOptions {
	readonly decimals : number;
	readonly percent : boolean;
	readonly precision : CssPrecision;
	readonly format : CssFormat;
	readonly angleUnit : AngleUnit;
}


export const enum cssPrecision {
	uint8 = 8,
	float64 = 64
}
export const enum cssFormat {
	css2 = 2,
	css4 = 4
}


const EXPR_CSS_PERCENT = /^[+-]?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?%$/;
const EXPR_CSS_NUMBER_OR_PERCENT = /^[+-]?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?%?$/;
const EXPR_CSS_ANGLE = /^([+-]?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?)(deg|g?rad|turn)?$/;

export const CSS_MAX_DECIMALS = 10;
export const CSS2_DELIM = ',';
export const CSS4_DELIM = ' ';
export const CSS4_ALPHA = '/';
export const CSS_PCT = '%';

export const TURN_TO_RAD = Math.PI * 2.0;
export const DEG_TO_RAD = Math.PI / 180.0;
export const RAD_TO_DEG = 1.0 / DEG_TO_RAD;

export const PCT_TO_UINT8 = 2.55;
export const UINT8_TO_PCT = 1.0 / PCT_TO_UINT8;
export const PCT_TO_UNIT = 0.01;
export const UNIT_TO_PCT = 100.0;
export const UNIT_TO_UINT8 = 255.0;
export const UINT8_TO_UNIT = 1.0 / UNIT_TO_UINT8;


const parseNumberOrPercentDefaults:ParseNumberOrPercentOptions = {
	percentScale : 0.01,
	clampMin : Number.NEGATIVE_INFINITY,
	clampMax : Number.POSITIVE_INFINITY,
	assertMin : Number.NEGATIVE_INFINITY,
	assertMax : Number.POSITIVE_INFINITY
};

export const hexDefaults:HexOptions = {
	hash : true,
	uppercase : false,
	short : true
};
export const cssDefaults:CssOptions = {
	decimals : 3,
	percent : false,
	precision : cssPrecision.uint8,
	format : cssFormat.css2,
	angleUnit : angleUnit.deg
};


export function expandUint24<R extends Vector3>(res:R, rgb8:Vector3, profile:ColorSpace = linear) : R {
	return profile.expand(res, multiplyScalar(res, rgb8, UINT8_TO_UNIT));
}

export function compressUint24<R extends Vector3>(res:R, rgb64:Vector3, profile:ColorSpace = linear) : R {
	return round(res, clampScalar(
		res,
		multiplyAssignScalar(profile.compress(res, rgb64), UNIT_TO_UINT8),
		0.0,
		UNIT_TO_UINT8
	));
}

export function createNumberOrPercentParser(opts?:Partial<ParseNumberOrPercentOptions>) : parseNumber {
	const settings = { ...parseNumberOrPercentDefaults, ...opts };

	return value => {
		if (!EXPR_CSS_NUMBER_OR_PERCENT.test(value)) throw new Error(`bad css number or percentage '${ value }'`);

		const n = clamp(
			Number.parseFloat(value) * (value.endsWith('%') ? settings.percentScale : 1.0),
			settings.clampMin,
			settings.clampMax
		);

		if (
			n < settings.assertMin ||
			n > settings.assertMax
		) throw new Error(`bad css number or percentage '${ value }'`);

		return n;
	};
}

export const parseCssLabLightness = createNumberOrPercentParser({
	percentScale : 1.0,
	clampMin : 0.0
});

export const parseCssAlpha = createNumberOrPercentParser({
	percentScale : PCT_TO_UNIT,
	clampMin : 0.0,
	clampMax : 1.0
});

/**
 * @deprecated use createNumberOrPercentParser instead
 */
function parseCssNumberOrPercent(value:string, percentScale:number = 0.01) : number {
	if (!EXPR_CSS_NUMBER_OR_PERCENT.test(value)) throw new Error(`bad css number or percentage '${ value }'`);

	return Number.parseFloat(value) * (value.endsWith('%') ? percentScale : 1.0);
}

export function parseCssUint8(value:string) : number {
	const res = parseCssNumberOrPercent(value, PCT_TO_UINT8);

	if (res < 0.0 || res > 255.0) throw new Error(`bad css uint8 '${ value }'`);

	return Math.round(res);
}

export function parseCssAngle(value:string) : number {
	const match = EXPR_CSS_ANGLE.exec(value) as [ string, string, string | undefined ] | null;

	if (match === null) throw new Error(`bad css angle '${ value }'`);

	const u = (match[2] ?? angleUnit.deg) as AngleUnit;

	return interval(angle(Number.parseFloat(match[1]), u), 0.0, TURN_TO_RAD);
}

export function parseCssPercent(value:string) : number {
	if (!EXPR_CSS_PERCENT.test(value)) throw new Error(`bad css percentage '${ value }'`);

	const res = Number.parseFloat(value) * 0.01;

	if (res < 0.0 || res > 1.0) throw new Error(`bad css percentage '${ value }'`);

	return res;
}

export function isCssRgbString(expr:string) : expr is CssRgbString {
	return expr.startsWith('rgb(') && expr.endsWith(')') && !expr.includes('/');
}

export function isCssRgbaString(expr:string) : expr is CssRgbaString {
	return (expr.startsWith('rgba(') || expr.startsWith('rgb(')) && expr.endsWith(')');
}

export function isCssHslString(expr:string) : expr is CssHslString {
	return expr.startsWith('hsl(') && expr.endsWith(')') && !expr.includes('/');
}

export function isCssHslaString(expr:string) : expr is CssHslaString {
	return (expr.startsWith('hsla(') || expr.startsWith('hsl(')) && expr.endsWith(')');
}

export function isCssLabString(expr:string) : expr is CssLabString {
	return expr.startsWith('lab(') && expr.endsWith(')');
}
