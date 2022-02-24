import * as vec3 from 'xyzw/dist/vector3';


export type Transfer = <R extends vec3.Vector3>(target:R, source:vec3.Vector3) => R;

export interface ColorSpace {
	readonly expand : Transfer;
	readonly compress : Transfer;
}


const SRGB_COMPRESS_THRESH = 0.0031308;
const SRGB_EXPAND_THRESH = 0.04045;

const SRGB_COMPRESS_F0 = 12.92;
const SRGB_EXPAND_F0 = 1.0 / SRGB_COMPRESS_F0;

const SRGB_COMPRESS_F1 = 0.055;
const SRGB_EXPAND_F1 = SRGB_COMPRESS_F1;

const SRGB_COMPRESS_F2 = 1.0 + SRGB_COMPRESS_F1;
const SRGB_EXPAND_F2 = 1.0 / SRGB_COMPRESS_F2;

const SRGB_EXPAND_EXP = 2.4;
const SRGB_COMPRESS_EXP = 1.0 / SRGB_EXPAND_EXP;


export const identity = vec3.copy;


export function expandSrgb<R extends vec3.Vector3>(res:R, source:vec3.Vector3) : R {
	const { x : r, y : g, z : b } = source;

	[ res.x, res.y, res.z ] = [
		r <= SRGB_EXPAND_THRESH ? r * SRGB_EXPAND_F0 : ((r + SRGB_EXPAND_F1) * SRGB_EXPAND_F2) ** SRGB_EXPAND_EXP,
		g <= SRGB_EXPAND_THRESH ? g * SRGB_EXPAND_F0 : ((g + SRGB_EXPAND_F1) * SRGB_EXPAND_F2) ** SRGB_EXPAND_EXP,
		b <= SRGB_EXPAND_THRESH ? b * SRGB_EXPAND_F0 : ((b + SRGB_EXPAND_F1) * SRGB_EXPAND_F2) ** SRGB_EXPAND_EXP
	];

	return res;
}

export function compressSrgb<R extends vec3.Vector3>(res:R, rgb:vec3.Vector3) : R {
	const { x : r, y : g, z : b } = rgb;

	[ res.x, res.y, res.z ] = [
		r <= SRGB_COMPRESS_THRESH ? r * SRGB_COMPRESS_F0 : r ** SRGB_COMPRESS_EXP * SRGB_COMPRESS_F2 - SRGB_COMPRESS_F1,
		g <= SRGB_COMPRESS_THRESH ? g * SRGB_COMPRESS_F0 : g ** SRGB_COMPRESS_EXP * SRGB_COMPRESS_F2 - SRGB_COMPRESS_F1,
		b <= SRGB_COMPRESS_THRESH ? b * SRGB_COMPRESS_F0 : b ** SRGB_COMPRESS_EXP * SRGB_COMPRESS_F2 - SRGB_COMPRESS_F1
	];

	return res;
}

export function expandGamma<R extends vec3.Vector3>(factor:number, res:R, source:vec3.Vector3) : R {
	const { x : r, y : g, z : b } = source;

	[ res.x, res.y, res.z ] = [ r ** factor, g ** factor, b ** factor ];

	return res;
}

export function compressGamma<R extends vec3.Vector3>(inverse:number, res:R, rgb:vec3.Vector3) : R {
	const { x : r, y : g, z : b } = rgb;

	[ res.x, res.y, res.z ] = [ r ** inverse, g ** inverse, b ** inverse ];

	return res;
}


export const linear:ColorSpace = {
	expand : vec3.copy,
	compress : vec3.copy
};

export const srgb:ColorSpace = {
	expand : expandSrgb,
	compress : compressSrgb
};

export function gamma(factor:number = 2.2) : ColorSpace {
	const inverse = 1.0 / factor;

	return {
		expand : expandGamma.bind(null, factor) as Transfer,
		compress : compressGamma.bind(null, inverse) as Transfer
	};
}
