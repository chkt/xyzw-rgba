import { matrix3 as mat3, vector2 as vec2, vector3 as vec3, vector4 as vec4 } from 'xyzw';
import { align, clamp, toFixed } from './real';
import { Transfer, identity } from './colorSpace';
import {
	CSS4_ALPHA,
	CSS4_DELIM,
	CSS_MAX_DECIMALS,
	CssLabString,
	CssOptions,
	UINT8_TO_PCT,
	UINT8_TO_UNIT,
	UNIT_TO_PCT,
	cssDefaults,
	cssPrecision,
	parseCssNumberOrPercent,
	parseCssUnitInterval
} from './parse';


export interface Lab {
	lightness : number;
	a : number;
	b : number;
	alpha : number;
}


const EXPR_CSS_LAB = /^lab\(\s*(\S+)\s*(\S+)\s*([^\s/]+)\s*(?:\/\s*(\S+)\s*)?\)$/;

const DIV_HUNDRED_SIXTEEN = 1.0 / 116.0;
const DIV_TWO_HUNDRED = 1.0 / 200.0;
const DIV_FIVE_HUNDRED = 1.0 / 500.0;
const FOUR_DIV_TWENTY_NINE = 4.0 / 29.0;
const DELTA = 6.0 / 29.0;
const DELTA_SQUARED_X3 = 3.0 * DELTA ** 2;
const DIV_DELTA_SQUARED_X3 = 1.0 / DELTA_SQUARED_X3;
const DELTA_CUBED = DELTA ** 3;


const absfn = Math.abs;
const maxfn = Math.max;
const cbrtfn = Math.cbrt;

const epsilon = 1e-10;
const v30 = vec3.Create();
const v31 = vec3.Create();
const v40 = vec4.Create();
const m30 = mat3.Identity();


const bradford:mat3.Matrix3 = {
	/* eslint-disable object-property-newline, key-spacing */
	r00 :  0.8951, r01 :  0.2664, r02 : -0.1614,
	r10 : -0.7502, r11 :  1.7135, r12 :  0.0367,
	r20 :  0.0389, r21 : -0.0685, r22 :  1.0296
	/* eslint-enable object-property-newline, key-spacing */
};
const invBradford = mat3.Inverse(bradford) as mat3.Matrix3;
const srgbLinearToXyzD65:mat3.Matrix3 = {
	/* eslint-disable object-property-newline, key-spacing */
	r00 : 0.4124, r01 : 0.3576, r02 : 0.1805,
	r10 : 0.2126, r11 : 0.7152, r12 : 0.0722,
	r20 : 0.0193, r21 : 0.1192, r22 : 0.9505
	/* eslint-enable object-property-newline, key-spacing */

};
const rgbToT:Map<vec3.Vector3, mat3.Matrix3> = new Map();
const tToRgb:Map<vec3.Vector3, mat3.Matrix3> = new Map();

export const d50 = tristimulus(vec3.Create(), vec2.Create(0.34567, 0.35850));
export const d65 = tristimulus(vec3.Create(), vec2.Create(0.31271, 0.32902));


function tristimulus<R extends vec3.Vector3>(r:R, { x, y }:vec2.Vector2) : R {
	const z = 1.0 - x - y;
	const yf = 1.0 / y;

	return vec3.assign(r, x * yf, 1.0, z * yf);
}

function bradfordLinear<R extends mat3.Matrix3>(res:R, from:vec3.Vector3, to:vec3.Vector3) : R {
	const f = vec3.multiplyMatrix3(v30, bradford, from);
	const t = vec3.multiplyMatrix3(v31, bradford, to);

	vec3.hadamardInvert(v30, f);
	vec3.hadamardAssign(v30, t);
	mat3.scale(res, v30);
	mat3.concat(res, res, bradford);
	mat3.concat(res, invBradford, res);

	return res;
}

function createRgbToT(illuminant:vec3.Vector3) : mat3.Matrix3 {
	const res = bradfordLinear(mat3.Identity(), d65, illuminant);

	mat3.concat(res, res, srgbLinearToXyzD65);
	mat3.scale(m30, vec3.assign(v30, 1.0 / illuminant.x, 1.0 / illuminant.y, 1.0 / illuminant.z));
	mat3.concat(res, m30, res);

	rgbToT.set(illuminant, res);

	return res;
}

function createTtoRgb(illuminant:vec3.Vector3) : mat3.Matrix3 {
	const inv = rgbToT.get(illuminant) ?? createRgbToT(illuminant);
	const res = mat3.Inverse(inv);

	if (res === undefined) throw new Error(`bad illuminant "${ JSON.stringify(illuminant) }"`);

	tToRgb.set(illuminant, res);

	return res;
}


export function equals(a:Lab, b:Lab, e:number = epsilon) : boolean {
	return absfn(a.lightness - b.lightness) < e &&
		absfn(a.a - b.a) < e &&
		absfn(a.b - b.b) < e &&
		absfn(a.alpha - b.alpha) < e;
}

export function Create(lightness:number = 100.0, a:number = 0.0, b:number = 0.0, alpha:number = 1.0) : Lab {
	return { lightness, a, b, alpha };
}

export function assign<R extends Lab>(
	res:R,
	lightness:number = 100.0,
	a:number = 0.0,
	b:number = 0.0,
	alpha:number = 1.0
) : R {
	res.lightness = lightness;
	res.a = a;
	res.b = b;
	res.alpha = alpha;

	return res;
}

export function Rgba(rgba64:vec4.Vector4, illuminant?:vec3.Vector3, expand?:Transfer) : Lab {
	return rgba(Create(), rgba64, illuminant, expand);
}

export function rgba<R extends Lab>(
	res:R,
	rgba64:vec4.Vector4,
	illuminant:vec3.Vector3 = d50,
	expand:Transfer = identity
) : R {
	const transform = rgbToT.get(illuminant) ?? createRgbToT(illuminant);

	expand(v40, vec4.copy(v40, rgba64));

	const { x, y, z, w : alpha } = vec3.multiplyMatrix3(v40, transform, v40);
	const [ fx, fy, fz ] = [
		x > DELTA_CUBED ? cbrtfn(x) : x * DIV_DELTA_SQUARED_X3 + FOUR_DIV_TWENTY_NINE,
		y > DELTA_CUBED ? cbrtfn(y) : y * DIV_DELTA_SQUARED_X3 + FOUR_DIV_TWENTY_NINE,
		z > DELTA_CUBED ? cbrtfn(z) : z * DIV_DELTA_SQUARED_X3 + FOUR_DIV_TWENTY_NINE
	];

	res.lightness = 116.0 * fy - 16.0;
	res.a = 500.0 * (fx - fy);
	res.b = 200.0 * (fy - fz);
	res.alpha = alpha;

	return res;
}

export function toRgba(lab:Lab, illuminant?:vec3.Vector3, compress?:Transfer) : vec4.Vector4 {
	return assignRgba(vec4.Create(), lab, illuminant, compress);
}

export function assignRgba<R extends vec4.Vector4>(
	res:R,
	lab:Lab,
	illuminant:vec3.Vector3 = d50,
	compress:Transfer = identity
) : R {
	const transform = tToRgb.get(illuminant) ?? createTtoRgb(illuminant);
	const fy = (lab.lightness + 16) * DIV_HUNDRED_SIXTEEN;
	const fx = fy + lab.a * DIV_FIVE_HUNDRED;
	const fz = fy - lab.b * DIV_TWO_HUNDRED;

	vec4.assign(
		res,
		fx > DELTA ? fx ** 3 : (fx - FOUR_DIV_TWENTY_NINE) * DELTA_SQUARED_X3,
		fy > DELTA ? fy ** 3 : (fy - FOUR_DIV_TWENTY_NINE) * DELTA_SQUARED_X3,
		fz > DELTA ? fz ** 3 : (fz - FOUR_DIV_TWENTY_NINE) * DELTA_SQUARED_X3,
		lab.alpha
	);
	vec3.multiplyMatrix3(res, transform, res);

	return compress(res, res);
}

export function CssLab(expr:CssLabString) : Lab {
	return cssLab(Create(), expr);
}

export function cssLab<R extends Lab>(res:R, expr:CssLabString) : Lab {
	const match = EXPR_CSS_LAB.exec(expr) as [string, string, string, string, string | undefined] | null;

	if (match === null) throw new Error(`bad css color '${ expr }'`);

	const [ , l, a, b, alpha ] = match;

	try {
		res.lightness = maxfn(parseCssNumberOrPercent(l, 1.0), 0.0);
		res.a = parseCssNumberOrPercent(a, 1.25);
		res.b = parseCssNumberOrPercent(b, 1.25);
		res.alpha = alpha !== undefined ? parseCssUnitInterval(alpha) : 1.0;
	}
	catch (err) {
		throw new Error(`bad css color '${ expr }'`);
	}

	return res;
}

export function toCss(lab:Lab, opts?:Partial<CssOptions>) : CssLabString {
	let { lightness, a, b, alpha } = lab;

	if (Number.isNaN(lightness + a + b + alpha)) throw new Error(`bad lab "${
		lab.lightness.toFixed(2) } ${
		lab.a.toFixed(2) } ${
		lab.b.toFixed(2) } ${
		lab.alpha.toFixed(2) }"`);

	lightness = maxfn(lightness, 0.0);
	alpha = clamp(alpha, 0.0, 1.0);

	const settings = { ...cssDefaults, ...opts };
	const labDigits = Math.min(Math.max(settings.decimals, 0), CSS_MAX_DECIMALS);
	let alphaDigits = labDigits;
	let unit = '';

	if (settings.percent) {
		a *= 0.8;
		b *= 0.8;
		alpha *= UNIT_TO_PCT;
		unit = '%';

		if (settings.precision === cssPrecision.uint8) {
			alpha = align(alpha, UINT8_TO_PCT, 0.5 - 1e-10);
			alphaDigits = 1;
		}
	}
	else if (settings.precision === cssPrecision.uint8) {
		alpha = align(alpha, UINT8_TO_UNIT);
		alphaDigits = Math.min(alphaDigits, 3);
	}

	const res = `${
		toFixed(lightness, labDigits) }${ unit }${ CSS4_DELIM }${
		toFixed(a, labDigits) }${ unit }${ CSS4_DELIM }${
		toFixed(b, labDigits) }${ unit }`;

	if (alpha === 1.0) return `lab(${ res })`;
	else return `lab(${ res }${ CSS4_ALPHA }${
			toFixed(alpha, alphaDigits) }${ unit })`;
}

export function Copy(lab:Lab) : Lab {
	return { ...lab };
}

export function copy<R extends Lab>(res:R, lab:Lab) : R {
	res.lightness = lab.lightness;
	res.a = lab.a;
	res.b = lab.b;
	res.alpha = lab.alpha;

	return res;
}
