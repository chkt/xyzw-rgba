export type AngleUnit = 'turn' | 'rad' | 'deg' | 'grad';

type AngleConversionMap = { readonly [K in AngleUnit] : number };


export const enum angleUnit {
	turn = 'turn',
	rad = 'rad',
	deg = 'deg',
	grad = 'grad'
}


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


export function clamp(n:number, a:number, b:number) : number {
	return minFn(maxFn(n, minFn(a, b)), maxFn(a, b));
}

export function interval(n:number, a:number, b:number) : number {
	const minVal = minFn(a, b);
	const maxVal = maxFn(a, b);
	const diff = maxVal - minVal;
	const rem = (n - minVal) % diff;

	return rem + (rem < 0.0 ? diff : 0.0) + minVal;
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
