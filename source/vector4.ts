import { Vector4 } from 'xyzw/dist/vector4';
import { toFixed } from './real';
import { binary11, unary1 } from './vector3';


type unary4 = (v:Vector4) => Vector4;
type binary41 = (v:Vector4, n:number) => Vector4;


const floorFn = Math.floor;
const roundFn = Math.round;
const ceilFn = Math.ceil;
const minFn = Math.min;
const maxFn = Math.max;


function create4(op:unary1, v:Vector4) : Vector4 {
	return {
		x : op(v.x),
		y : op(v.y),
		z : op(v.z),
		w : op(v.w)
	};
}

function assign4<R extends Vector4>(op:unary1, r:R, v:Vector4) : R {
	[ r.x, r.y, r.z, r.w ] = [ op(v.x), op(v.y), op(v.z), op(v.w) ];

	return r;
}

function create41(op:binary11, v:Vector4, n:number) : Vector4 {
	return {
		x : op(v.x, n),
		y : op(v.y, n),
		z : op(v.z, n),
		w : op(v.w, n)
	};
}

function assign41<R extends Vector4>(op:binary11, r:R, v:Vector4, n:number) : R {
	[ r.x, r.y, r.z, r.w ] = [ op(v.x, n), op(v.y, n), op(v.z, n), op(v.w, n) ];

	return r;
}

// function create44(op:binary11, v:Vector4, w:Vector4) : Vector4 {
// 	return {
// 		x : op(v.x, w.x),
// 		y : op(v.y, w.y),
// 		z : op(v.z, w.z),
// 		w : op(v.w, w.w)
// 	};
// }
//
// function assign44<R extends Vector4>(op:binary11, r:R, v:Vector4, w:Vector4) : R {
// 	r.x = op(v.x, w.x);
// 	r.y = op(v.y, w.y);
// 	r.z = op(v.z, w.z);
// 	r.w = op(v.w, w.w);
//
// 	return r;
// }


export function assignAlpha<R extends Vector4>(v:R, n:number) : R {
	v.w = n;

	return v;
}


export function MultiplyAlpha(v:Vector4) : Vector4 {
	const a = v.w;

	return { x : v.x * a, y : v.y * a, z : v.z * a, w : a };
}

export function multiplyAlpha<R extends Vector4>(r:R, v:Vector4) : R {
	const a = v.w;

	[ r.x, r.y, r.z, r.w ] = [ v.x * a, v.y * a, v.z * a, v.w ];

	return r;
}

export function multiplyAssignAlpha<R extends Vector4>(v:R) : R {
	const a = v.w;

	v.x *= a;
	v.y *= a;
	v.z *= a;

	return v;
}


export function hadamardAssignAlpha<R extends Vector4>(v:R, n:number) : R {
	v.w *= n;

	return v;
}

export function DemultiplyAlpha(v:Vector4) : Vector4 {
	const a = v.w !== 0.0 ? 1.0 / v.w : 0.0;

	return { x : v.x * a, y : v.y * a, z : v.z * a, w : v.w };
}

export function demultiplyAlpha<R extends Vector4>(r:R, v:Vector4) : R {
	const a = v.w !== 0.0 ? 1.0 / v.w : 0.0;

	[ r.x, r.y, r.z, r.w ] = [ v.x * a, v.y * a, v.z * a, v.w ];

	return r;
}

export function demultiplyAssignAlpha<R extends Vector4>(v:R) : R {
	const a = v.w !== 0.0 ? 1.0 / v.w : 0.0;

	v.x *= a;
	v.y *= a;
	v.z *= a;

	return v;
}

/**
 * floor(v⃗ )
 */
export const Floor = create4.bind(null, floorFn) as unary4;

/**
 * r⃗ = floor(v⃗ )
 */
export const floor = assign4.bind(null, floorFn) as <R extends Vector4>(r:R, v:Vector4) => R;

/**
 * round(v⃗ )
 */
export const Round = create4.bind(null, roundFn) as unary4;

/**
 * r⃗ = round(v⃗ )
 */
export const round = assign4.bind(null, roundFn) as <R extends Vector4>(r:R, v:Vector4) => R;

/**
 * ceil(v⃗ )
 */
export const Ceil = create4.bind(null, ceilFn) as unary4;
/**
 * r⃗ = ceil(v⃗ )
 */
export const ceil = assign4.bind(null, ceilFn) as <R extends Vector4>(r:R, v:Vector4) => R;

export function Align(v:Vector4, interval?:number, threshold?:number) : Vector4 {
	return align({ x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, v, interval, threshold);
}

export function align<R extends Vector4>(r:R, v:Vector4, interval:number = 1.0, threshold:number = 0.5) : R {
	const { x, y, z, w } = v;
	const t = interval * threshold;

	const [ modx, mody, modz, modw ] = [
		x % interval,
		y % interval,
		z % interval,
		w % interval
	];

	[ r.x, r.y, r.z, r.w ] = [
		x + (modx >= t ? interval : 0.0) - modx,
		y + (mody >= t ? interval : 0.0) - mody,
		z + (modz >= t ? interval : 0.0) - modz,
		w + (modw >= t ? interval : 0.0) - modw
	];

	return r;
}

export function alignAssignAlpha<R extends Vector4>(v:R, interval:number = 1.0, threshold:number = 0.5) : R {
	const modw = v.w % interval;

	v.w += (modw >= interval * threshold ? interval : 0.0) - modw;

	return v;
}

/**
 * min(v⃗, n)
 */
export const Min = create41.bind(null, minFn) as binary41;

/**
 * r⃗ = min(v⃗, n)
 */
export const min = assign41.bind(null, minFn) as <R extends Vector4>(r:R, v:Vector4, n:number) => R;

// export const MinEntry = create44.bind(null, minfn) as (v:Vector4, w:Vector4) => Vector4;
// export const minEntry = assign44.bind(null, minfn) as <R extends Vector4>(r:R, v:Vector4, w:Vector4) => R;

/**
 * max(v⃗, n)
 */
export const Max = create41.bind(null, maxFn) as binary41;

/**
 * r⃗ = max(v⃗, n)
 */
export const max = assign41.bind(null, maxFn) as <R extends Vector4>(r:R, v:Vector4, n:number) => R;

// export const MaxEntry = create44.bind(null, maxfn) as (v:Vector4, w:Vector4) => Vector4;
// export const maxEntry = assign44.bind(null, maxfn) as <R extends Vector4>(r:R, v:Vector4, w:Vector4) => R;

/**
 * min(max(v⃗, min(a, b)), max(a, b))
 */
export function Clamp(v:Vector4, a:number, b:number) : Vector4 {
	return clamp({ x : 0.0, y : 0.0, z : 0.0, w : 1.0 }, v, a, b);
}

/**
 * r⃗ = min(max(v⃗, min(a, b)), max(a, b))
 */
export function clamp<R extends Vector4>(r:R, v:Vector4, a:number, b:number) : R {
	const minVal = minFn(a, b);
	const maxVal = maxFn(a, b);

	[ r.x, r.y, r.z, r.w ] = [
		minFn(maxFn(v.x, minVal), maxVal),
		minFn(maxFn(v.y, minVal), maxVal),
		minFn(maxFn(v.z, minVal), maxVal),
		minFn(maxFn(v.w, minVal), maxVal)
	];

	return r;
}

export function clampAssignAlpha<R extends Vector4>(v:R, a:number, b:number) : R {
	v.w = minFn(maxFn(v.w, minFn(a, b)), maxFn(a, b));

	return v;
}

// eslint-disable-next-line @typescript-eslint/no-shadow
export function toString(v:Vector4, decimals:number = 3) : string {
	return `[${
		toFixed(v.x, decimals) },${
		toFixed(v.y, decimals) },${
		toFixed(v.z, decimals) },${
		toFixed(v.w, decimals) }]`;
}
