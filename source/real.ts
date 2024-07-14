export type AngleUnit = 'turn' | 'rad' | 'deg' | 'grad';

type AngleConversionMap = { readonly [K in AngleUnit] : number };


export const enum angleUnit {
	turn = 'turn',
	rad = 'rad',
	deg = 'deg',
	grad = 'grad'
}


const nan = Number.NaN;
const minFn = Math.min;
const maxFn = Math.max;

const angleToTurn:AngleConversionMap = {
	[angleUnit.turn] : 1.0,
	[angleUnit.rad] : 0.5 / Math.PI,
	[angleUnit.deg] : 1.0 / 360.0,
	[angleUnit.grad] : 1.0 / 400.0
};
const turnToAngle:AngleConversionMap = {
	[angleUnit.turn] : 1.0,
	[angleUnit.rad] : 2.0 * Math.PI,
	[angleUnit.deg] : 360.0,
	[angleUnit.grad] : 400.0
};


export function angle(n:number, from:AngleUnit, to:AngleUnit = angleUnit.rad) : number {
	return n * (angleToTurn[from] * turnToAngle[to]);
}

export function align(n:number, step:number = 1.0, threshold:number = 0.5) : number {
	const rem = n % step;

	return n + (rem >= step * threshold ? step : 0.0) - rem;
}

/**
 * |a| = |b|
 */
export function isAbsEq(a:number, b:number) : boolean {
	return a ** 2 === b ** 2;
}

/**
 * |a| < |b|
 */
export function isAbsLt(a:number, b:number) : boolean {
	return a ** 2 < b ** 2;
}

/**
 * |a| ≤ |b|
 */
export function isAbsLtEq(a:number, b:number) : boolean {
	return a ** 2 <= b ** 2;
}

/**
 * |a| > |b|
 */
export function isAbsGt(a:number, b:number) : boolean {
	return a ** 2 > b ** 2;
}

/**
 * |a| ≥ |b|
 */
export function isAbsGtEq(a:number, b:number) : boolean {
	return a ** 2 >= b ** 2;
}

export function clamp(n:number, a:number, b:number) : number {
	const min = minFn(a, b);

	return minFn(maxFn(n, min), a + b - min);
}

export function interval(n:number, a:number, b:number) : number {
	const minVal = minFn(a, b);
	const maxVal = maxFn(a, b);
	const diff = maxVal - minVal;
	const rem = (n - minVal) % diff;

	return rem + (rem < 0.0 ? diff : 0.0) + minVal;
}


export function range(values:readonly number[]) : number {
	if (values.length > 0) return maxFn(...values) - minFn(...values);
	else return nan;
}

export function mean(values:readonly number[], weights:readonly number[] = []) : number {
	let sum = 0.0;
	let div = 0.0;

	for (let i = values.length - 1; i > -1; i -= 1) {
		const w = weights[i] ?? 1.0;

		sum += values[i] * w;
		div += w;
	}

	return sum / div;
}

export function mid(values:readonly number[], t:number = 0.5) : number {
	if (values.length !== 0) return minFn(...values) * (1.0 - t) + maxFn(...values) * t;
	else return nan;
}

export function relative(values:readonly number[], n:number) : number {
	const minVal = minFn(...values);
	const maxVal = maxFn(...values);

	if (!Number.isFinite(minVal)) return 1.0 - (maxVal - n) / (maxVal - minVal);
	else if (!Number.isFinite(maxVal)) return Math.abs((n - minVal) / (maxVal - minVal));
	else return (n - minVal) / (maxVal - minVal);
}

export function toFixed(n:number, max:number = 0) : string {
	const s = n.toFixed(max);

	const last = s.indexOf('.') - 1;

	if (last < 0) return s;

	let index:number;

	for (index = s.length - 1; index > last; index -= 1) {
		if (s[index] !== '0' && s[index] !== '.') break;
	}

	return s.slice(0, index + 1);
}
