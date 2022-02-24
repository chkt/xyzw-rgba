import { Lerp, Vector3, lerp } from 'xyzw/dist/vector3';
import { Vector4 } from 'xyzw/dist/vector4';
import { toFixed } from './real';


export type unary1 = (n:number) => number;
type unary3 = (v:Vector3) => Vector3;
export type binary11 = (a:number, b:number) => number;
type binary31 = (v:Vector3, n:number) => Vector3;


const floorFn = Math.floor;
const roundFn = Math.round;
const ceilFn = Math.ceil;
const minFn = Math.min;
const maxFn = Math.max;


function create3(op:unary1, v:Vector3) : Vector3 {
	return {
		x : op(v.x),
		y : op(v.y),
		z : op(v.z)
	};
}

function assign3<R extends Vector3>(op:unary1, r:R, v:Vector3) : R {
	r.x = op(v.x);
	r.y = op(v.y);
	r.z = op(v.z);

	return r;
}

function create31(op:binary11, v:Vector3, n:number) : Vector3 {
	return {
		x : op(v.x, n),
		y : op(v.y, n),
		z : op(v.z, n)
	};
}

function assign31<R extends Vector3>(op:binary11, r:R, v:Vector3, n:number) : R {
	r.x = op(v.x, n);
	r.y = op(v.y, n);
	r.z = op(v.z, n);

	return r;
}


export function Mono(n:number = 1.0) : Vector3 {
	return { x : n, y : n, z : n };
}

export function mono<R extends Vector3>(r:R, n:number = 1.0) : Vector3 {
	r.x = n;
	r.y = n;
	r.z = n;

	return r;
}


export function Matte(base:Vector3, fill:Vector4) : Vector3 {
	return Lerp(base, fill, fill.w);
}

export function matte<R extends Vector3>(r:R, base:Vector3, fill:Vector4) : R {
	return lerp(r, base, fill, fill.w);
}


/**
 * floor(v⃗ )
 */
export const Floor = create3.bind(null, floorFn) as unary3;

/**
 * r⃗ = floor(v⃗ )
 */
export const floor = assign3.bind(null, floorFn) as <R extends Vector3>(r:R, v:Vector3) => R;

/**
 * round(v⃗ )
 */
export const Round = create3.bind(null, roundFn) as unary3;

/**
 * r⃗ = round(v⃗ )
 */
export const round = assign3.bind(null, roundFn) as <R extends Vector3>(r:R, v:Vector3) => R;

/**
 * ceil(v⃗ )
 */
export const Ceil = create3.bind(null, ceilFn) as unary3;

/**
 * r⃗ = ceil(v⃗ )
 */
export const ceil = assign3.bind(null, ceilFn) as <R extends Vector3>(r:R, v:Vector3) => R;

export function Align(v:Vector3, interval?:number, threshold?:number) : Vector3 {
	return align({ x : 0.0, y : 0.0, z : 0.0 }, v, interval, threshold);
}

export function align<R extends Vector3>(r:R, v:Vector3, interval:number = 1.0, threshold:number = 0.5) : R {
	const { x, y, z } = v;
	const t = interval * threshold;

	const modx = x % interval;
	const mody = y % interval;
	const modz = z % interval;

	r.x = x + (modx >= t ? interval : 0.0) - modx;
	r.y = y + (mody >= t ? interval : 0.0) - mody;
	r.z = z + (modz >= t ? interval : 0.0) - modz;

	return r;
}

/**
 * min(v⃗, n)
 */
export const Min = create31.bind(null, Math.min) as binary31;

/**
 * r⃗ = min(v⃗, n)
 */
export const min = assign31.bind(null, Math.min) as <R extends Vector3>(r:R, v:Vector3, n:number) => R;

/**
 * max(v⃗, n)
 */
export const Max = create31.bind(null, Math.max) as binary31;

/**
 * r⃗ = max(v⃗, n)
 */
export const max = assign31.bind(null, Math.max) as <R extends Vector3>(r:R, v:Vector3, n:number) => R;

export function Clamp(v:Vector3, a:number, b:number) : Vector3 {
	const minVal = minFn(a, b);
	const maxVal = maxFn(a, b);

	return {
		x : minFn(maxFn(v.x, minVal), maxVal),
		y : minFn(maxFn(v.y, minVal), maxVal),
		z : minFn(maxFn(v.z, minVal), maxVal)
	};
}

export function clamp<R extends Vector3>(r:R, v:Vector3, a:number, b:number) : R {
	const minVal = minFn(a, b);
	const maxVal = maxFn(a, b);

	r.x = minFn(maxFn(v.x, minVal), maxVal);
	r.y = minFn(maxFn(v.y, minVal), maxVal);
	r.z = minFn(maxFn(v.z, minVal), maxVal);

	return r;
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export function toString(v:Vector3, decimals:number = 3) : string {
	return `[${
		toFixed(v.x, decimals) },${
		toFixed(v.y, decimals) },${
		toFixed(v.z, decimals) }]`;
}
