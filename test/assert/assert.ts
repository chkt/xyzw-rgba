import * as assert from 'assert';
import * as vec3 from 'xyzw/dist/vector3';
import * as vec4 from 'xyzw/dist/vector4';
import { Hsl } from '../../source/hsl';
import { Hsla } from '../../source/hsla';


export function assertEquals(actual:number, expected:number, e:number, message?:string) : void {
	if (Number.isNaN(actual) !== Number.isNaN(expected) || Math.abs(expected - actual) > e) {
		throw new assert.AssertionError({
			message,
			actual,
			expected,
			operator : `!==[${ e }]`
		});
	}
}

export function assertEqualsVec3(actual:vec3.Vector3, expected:vec3.Vector3, e:number, message?:string) : void {
	if (
		Number.isNaN(actual.x) !== Number.isNaN(expected.x) || Math.abs(actual.x - expected.x) > e ||
		Number.isNaN(actual.y) !== Number.isNaN(expected.y) || Math.abs(actual.y - expected.y) > e ||
		Number.isNaN(actual.z) !== Number.isNaN(expected.z) || Math.abs(actual.z - expected.z) > e
	) {
		throw new assert.AssertionError({
			message,
			actual,
			expected,
			operator : `!==[${ e }]`
		});
	}
}

export function assertEqualsVec4(actual:vec4.Vector4, expected:vec4.Vector4, e:number, message?:string) : void {
	if (
		Number.isNaN(actual.x) !== Number.isNaN(expected.x) || Math.abs(actual.x - expected.x) > e ||
		Number.isNaN(actual.y) !== Number.isNaN(expected.y) || Math.abs(actual.y - expected.y) > e ||
		Number.isNaN(actual.z) !== Number.isNaN(expected.z) || Math.abs(actual.z - expected.z) > e ||
		Number.isNaN(actual.w) !== Number.isNaN(expected.w) || Math.abs(actual.w - expected.w) > e
	) {
		throw new assert.AssertionError({
			message,
			actual,
			expected,
			operator : `!==[${ e }]`
		});
	}
}

export function assertEqualsHsl(actual:Hsl, expected:Hsl, e:number, message?:string) : void {
	const h = expected.hue - actual.hue;
	const s = expected.saturation - actual.saturation;
	const l = expected.lightness - actual.lightness;

	if (
		Number.isNaN(actual.hue) !== Number.isNaN(expected.hue) || Math.abs(actual.saturation) > e && Math.abs(h) > e ||
		Number.isNaN(actual.saturation) !== Number.isNaN(expected.saturation) || Math.abs(s) > e ||
		Number.isNaN(actual.lightness) !== Number.isNaN(expected.lightness) || Math.abs(l) > e
	) {
		throw new assert.AssertionError({
			message,
			actual,
			expected,
			operator : `!==[${ e }]`
		});
	}
}

export function assertEqualsHsla(actual:Hsla, expected:Hsla, e:number, message?:string) : void {
	if (
		Number.isNaN(actual.hue) !== Number.isNaN(expected.hue) || Math.abs(expected.hue - actual.hue) > e ||
		Number.isNaN(actual.saturation) !== Number.isNaN(expected.saturation) || Math.abs(expected.saturation - actual.saturation) > e ||
		Number.isNaN(actual.lightness) !== Number.isNaN(expected.lightness) || Math.abs(expected.lightness - actual.lightness) > e ||
		Number.isNaN(actual.alpha) !== Number.isNaN(expected.alpha) || Math.abs(expected.alpha - actual.alpha) > e
	) {
		throw new assert.AssertionError({
			message,
			actual,
			expected,
			operator : `!==[${ e }]`
		});
	}
}
