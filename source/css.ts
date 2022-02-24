import * as vec3 from 'xyzw/dist/vector3';
import * as vec4 from 'xyzw/dist/vector4';
import * as vec3Rgb from './vector3';
import * as vec4Rgba from './vector4';
import {
	CssFormat,
	cssFormat,
	isCssHslString,
	isCssHslaString,
	isCssRgbString,
	isCssRgbaString
} from './parse';
import { ColorSpace, linear } from './colorSpace';
import * as rgb from './rgb';
import * as rgba from './rgba';
import * as hsl from './hsl';
import * as hsla from './hsla';
import { HashString, NamedRgba64, findNameOfVec3, findNameOfVec4 } from './named';


export type CssStringifyMode = 'fast' | 'short';

export interface CssCommonOptions<K extends string = string> {
	readonly profile : ColorSpace;
	readonly namedColors : NamedRgba64<K>;
}

export interface CssStringifyOptions<K extends string = string> extends CssCommonOptions<K> {
	readonly mode : CssStringifyMode;
	readonly format : CssFormat;
}

export interface CssParseOptions<K extends string = string> extends CssCommonOptions<K> {
	readonly matte : vec3.Vector3;
}


export const enum cssStringifyMode {
	fast = 'fast',
	short = 'short'
}

const cssStringifyDefaults:CssStringifyOptions = {
	mode : cssStringifyMode.fast,
	format : cssFormat.css2,
	profile : linear,
	namedColors : {}
};

const cssParseDefaults:CssParseOptions = {
	profile : linear,
	matte : vec3Rgb.Mono(),
	namedColors : {}
};

const v3 = vec3.Create();
const v4 = vec4.Create();


function isHashString(expr:string) : expr is HashString {
	return (expr.length === 4 || expr.length === 7) && expr.startsWith('#');
}


export function fromRgb(rgb64:vec3.Vector3, opts?:Partial<CssStringifyOptions>) : string {
	const settings = { ...cssStringifyDefaults, ...opts };
	const v = settings.profile.compress(v3, rgb64);

	if (settings.mode === cssStringifyMode.fast) return rgb.toCss(v, undefined, settings);
	else {
		const hex = rgb.toHex24(v);
		const name = findNameOfVec3(settings.namedColors, v);

		return name !== undefined && hex.length > name.length ? name : hex;
	}
}

export function fromRgba(rgba64:vec4.Vector4, opts?:Partial<CssStringifyOptions>) : string {
	if (1.0 - rgba64.w < 1e-10) return fromRgb(rgba64, opts);

	const settings = { ...cssStringifyDefaults, ...opts };
	const v = settings.profile.compress(v4, vec4.copy(v4, rgba64));
	const rgbaExpr = rgba.toCss(v, undefined, settings);

	if (settings.mode === cssStringifyMode.fast) return rgbaExpr;

	const name = findNameOfVec4(settings.namedColors, v);
	const hslaExpr = hsla.rgbaToCss(v, undefined, settings);
	const best = name !== undefined && name.length < hslaExpr.length ? name : hslaExpr;

	return best.length < rgbaExpr.length ? best : rgbaExpr;
}

export function toRgb(expr:string, opts?:Partial<CssParseOptions>) : vec3.Vector3 {
	return assignRgb(vec3.Create(), expr, opts);
}

export function assignRgb<R extends vec3.Vector3>(
	res:R,
	expr:string,
	opts?:Partial<CssParseOptions>
) : vec3.Vector3 {
	const { matte, profile, namedColors } = { ...cssParseDefaults, ...opts };

	if (isHashString(expr)) return rgb.hex24(res, expr, profile);
	else if (isCssRgbString(expr)) return rgb.cssRgb(res, expr, profile);
	else if (isCssRgbaString(expr)) return vec3Rgb.matte(res, matte, rgba.cssRgba(v4, expr, profile));
	else if (isCssHslString(expr)) return hsl.cssHslAssignRgb(res, expr, profile);
	else if (isCssHslaString(expr)) return vec3Rgb.matte(res, matte, hsla.cssHslaAssignRgba(v4, expr, profile));
	else if (expr in namedColors) return vec3Rgb.matte(res, matte, namedColors[expr]);
	else throw new Error(`not css color '${ expr }'`);
}

export function toRgba(expr:string, opts?:Partial<Omit<CssParseOptions, 'matte'>>) : vec4.Vector4 {
	return assignRgba(vec4.Create(), expr, opts);
}

export function assignRgba<R extends vec4.Vector4>(
	res:R,
	expr:string,
	opts?:Partial<Omit<CssParseOptions, 'matte'>>
) : R {
	const { profile, namedColors } = { ...cssParseDefaults, ...opts };

	if (isHashString(expr)) return rgb.hex24(res, expr, profile);
	else if (isCssRgbString(expr)) return rgb.cssRgb(vec4Rgba.assignAlpha(res, 1.0), expr, profile);
	else if (isCssRgbaString(expr)) return rgba.cssRgba(res, expr, profile);
	else if (isCssHslString(expr)) return hsl.cssHslAssignRgb(vec4Rgba.assignAlpha(res, 1.0), expr, profile);
	else if (isCssHslaString(expr)) return hsla.cssHslaAssignRgba(res, expr, profile);
	else if (expr in namedColors) return vec4.copy(res, namedColors[expr]);
	else throw new Error(`not css color '${ expr }'`);
}
