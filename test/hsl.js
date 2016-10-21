import assert from 'assert';
import { describe, it } from 'mocha';

import Math from 'xyzw/es5/Math';
import * as trn from '../source/hsl';



const HUE_RED = 0;
const HUE_YELLOW = Math.PI * 1.0 / 3.0;
const HUE_GREEN = Math.PI * 2.0 / 3.0;
const HUE_CYAN = Math.PI;
const HUE_BLUE = Math.PI * 4.0 / 3.0;
const HUE_MAGENTA = Math.PI * 5.0 / 3.0;
const HUE_RED_AGAIN = Math.PI * 2.0;
const SIXTH_ROT = Math.PI * 1.0 / 3.0;



function hslToRgb(hsl, rgb) {
	const color = trn.hslToRgb(hsl);

	for (let i = 0; i < 3; i += 1) assert(
		Math.abs(rgb[i] - color[i]) < 1.0e-12,
		`rgb[${ i }] for hsl(${ hsl.join(",") }) was ${ color[i] }, expected ${ rgb[i] }`
	);
}

function hslToGray(hsl) {
	const rgb = trn.hslToRgb(hsl);

	assert.strictEqual(rgb[0], rgb[1]);
	assert.strictEqual(rgb[0], rgb[2]);
	assert.strictEqual(rgb[0], hsl[2]);
}

function hslRotateSegment(hue, saturation, luminosity, from, to) {
	for (let f = 0; f <= 1; f += 0.08) {
		const h = hue + f * SIXTH_ROT, hsl = [h, saturation, luminosity];
		const color = trn.hslToRgb(hsl);

		for (let i = 0; i < 3; i += 1) assert(
			Math.abs(Math.mix(from[i], to[i], f) - color[i]) < 1.0e-12,
			`rgb[${ i }] for hsl(${ hsl.join(",") }) was ${ color[i] }, expected ${ Math.mix(from[i], to[i], f) }`
		);
	}
}

function hslTraverseSegment(hue, saturation, luminosity, from, to) {
	for (let f = 0; f <= 1; f += 0.08) {
		const l = luminosity + f * 0.5, hsl = [hue, saturation, l];
		const color = trn.hslToRgb(hsl);

		for (let i = 0; i < 3; i += 1) assert(
			Math.abs(Math.mix(from[i], to[i], f) - color[i]) < 1.0e-12,
			`rgb[${ i }] for hsl(${ hsl.join(",") }) was ${ color[i] }, expected ${ Math.mix(from[i], to[i], f)}`
		);
	}
}

function rgbTransitionLuminosity(from, to, hue, saturation, luminosity) {
	for (let f = 0.0; f <= 1.0; f += 0.08) {
		const rgb = [
			Math.mix(from[0], to[0], f),
			Math.mix(from[1], to[1], f),
			Math.mix(from[2], to[2], f)
		];

		const sum = rgb.reduce((current, next) => current + next);
		const singularity = (sum === 0.0 || sum === 3.0);
		const hsl = trn.rgbToHsl(rgb);

		assert(
			Math.abs(hsl[0] - (singularity ? 0 : hue) < 1.0e-12),
			`hue for rgb(${ rgb.join(",") }) was ${ hsl[0] }, expected ${ singularity ? 0 : hue }`
		);

		assert(
			Math.abs(hsl[1] - (singularity ? 0 : saturation)) < 1.0e-12,
			`saturation for rgb(${ rgb.join(",") }) was ${ hsl[1] }, expected ${ singularity ? 0 : saturation }`
		);

		assert(
			Math.abs(hsl[2] - (luminosity + f * 0.5)) < 1.0e-12,
			`luminosity for rgb(${ rgb.join(",") }) was ${ hsl[2] }, expected ${ luminosity + f * 0.5 }`
		);
	}
}


describe('hslToRgb', () => {
	it("should return [0,0,0] when luminosity is 0", () => {
		hslToRgb([0,0,0], [0,0,0]);
		hslToRgb([HUE_GREEN,0,0], [0,0,0]);
		hslToRgb([HUE_BLUE,0,0], [0,0,0]);
		hslToRgb([HUE_RED_AGAIN,0,0], [0,0,0]);
		hslToRgb([0,0.5,0], [0,0,0]);
		hslToRgb([0,1,0], [0,0,0]);
	});

	it("should return [1,1,1] when luminosity is 1", () => {
		hslToRgb([0,0,1], [1,1,1]);
		hslToRgb([HUE_GREEN,0,1], [1,1,1]);
		hslToRgb([HUE_BLUE,0,1], [1,1,1]);
		hslToRgb([HUE_RED_AGAIN,0,1], [1,1,1]);
		hslToRgb([0,0.5,1], [1,1,1]);
		hslToRgb([0,0.5,1], [1,1,1]);
	});

	it("should return [l,l,l] when saturation is 0", () => {
		for (let l = 0; l <= 100; l += 8) hslToGray([Math.PI * l / 10.0, 0, l]);
	});

	it("should return pure colors for equivalent h's, s = 1 and l = 0.5", () => {
		hslRotateSegment(HUE_RED, 1, 0.5, [1,0,0], [1,1,0]);
		hslRotateSegment(HUE_YELLOW, 1, 0.5, [1,1,0], [0,1,0]);
		hslRotateSegment(HUE_GREEN, 1, 0.5, [0,1,0], [0,1,1]);
		hslRotateSegment(HUE_CYAN, 1, 0.5, [0,1,1], [0,0,1]);
		hslRotateSegment(HUE_BLUE, 1, 0.5, [0,0,1], [1,0,1]);
		hslRotateSegment(HUE_MAGENTA, 1, 0.5, [1,0,1], [1,0,0]);
	});

	it("should return muted colors for equivalent h's, s = 1 and l = 0.25", () => {
		hslRotateSegment(HUE_RED, 1, 0.25, [0.5,0,0], [0.5,0.5,0]);
		hslRotateSegment(HUE_YELLOW, 1, 0.25, [0.5,0.5,0], [0,0.5,0]);
		hslRotateSegment(HUE_GREEN, 1, 0.25, [0,0.5,0], [0,0.5,0.5]);
		hslRotateSegment(HUE_CYAN, 1, 0.25, [0,0.5,0.5], [0,0,0.5]);
		hslRotateSegment(HUE_BLUE, 1, 0.25, [0,0,0.5], [0.5,0,0.5]);
		hslRotateSegment(HUE_MAGENTA, 1, 0.25, [0.5,0,0.5], [0.5,0,0]);
	});

	it("should return washed colors for equivalent h's s = 1 and l = 0.75", () => {
		hslRotateSegment(HUE_RED, 1, 0.75, [1,0.5,0.5], [1,1,0.5]);
		hslRotateSegment(HUE_YELLOW, 1, 0.75, [1,1,0.5], [0.5,1,0.5]);
		hslRotateSegment(HUE_GREEN, 1, 0.75, [0.5,1,0.5], [0.5,1,1]);
		hslRotateSegment(HUE_CYAN, 1, 0.75, [0.5,1,1], [0.5,0.5,1]);
		hslRotateSegment(HUE_BLUE, 1, 0.75, [0.5,0.5,1], [1,0.5,1]);
		hslRotateSegment(HUE_MAGENTA, 1, 0.75, [1,0.5,1], [1,0.5,0.5]);
	});

	it("should return a color gradient for saturated colors", () => {
		hslTraverseSegment(HUE_RED, 1, 0, [0,0,0], [1,0,0]);
		hslTraverseSegment(HUE_RED, 1, 0.5, [1,0,0], [1,1,1]);
		hslTraverseSegment(HUE_YELLOW, 1, 0, [0,0,0], [1,1,0]);
		hslTraverseSegment(HUE_YELLOW, 1, 0.5, [1,1,0], [1,1,1]);
		hslTraverseSegment(HUE_GREEN, 1, 0, [0,0,0], [0,1,0]);
		hslTraverseSegment(HUE_GREEN, 1, 0.5, [0,1,0], [1,1,1]);
		hslTraverseSegment(HUE_CYAN, 1, 0, [0,0,0], [0,1,1]);
		hslTraverseSegment(HUE_CYAN, 1, 0.5, [0,1,1], [1,1,1]);
		hslTraverseSegment(HUE_BLUE, 1, 0, [0,0,0], [0,0,1]);
		hslTraverseSegment(HUE_BLUE, 1, 0.5, [0,0,1], [1,1,1]);
		hslTraverseSegment(HUE_MAGENTA, 1, 0, [0,0,0], [1,0,1]);
		hslTraverseSegment(HUE_MAGENTA, 1, 0.5, [1,0,1], [1,1,1]);
	});
});

describe('rgbToHsl', () => {
	it("should return [0,0,r=g=b] for grays", () => {
		for (let f = 0; f <= 1.0; f += 0.08) assert.deepStrictEqual(trn.rgbToHsl([f,f,f]), [0,0,f]);
	});

	it("should return [h,1,l] for saturated colors", () => {
		rgbTransitionLuminosity([0,0,0], [1,0,0], HUE_RED, 1, 0);
		rgbTransitionLuminosity([1,0,0], [1,1,1], HUE_RED, 1, 0.5);
		rgbTransitionLuminosity([0,0,0], [1,1,0], HUE_YELLOW, 1, 0);
		rgbTransitionLuminosity([1,1,0], [1,1,1], HUE_YELLOW, 1, 0.5);
		rgbTransitionLuminosity([0,0,0], [0,1,0], HUE_GREEN, 1, 0);
		rgbTransitionLuminosity([0,1,0], [1,1,1], HUE_GREEN, 1, 0.5);
		rgbTransitionLuminosity([0,0,0], [0,1,1], HUE_CYAN, 1, 0);
		rgbTransitionLuminosity([0,1,1], [1,1,1], HUE_CYAN, 1, 0.5);
		rgbTransitionLuminosity([0,0,0], [0,0,1], HUE_BLUE, 1, 0);
		rgbTransitionLuminosity([0,0,1], [1,1,1], HUE_BLUE, 1, 0.5);
		rgbTransitionLuminosity([0,0,0], [1,0,1], HUE_MAGENTA, 1, 0);
		rgbTransitionLuminosity([1,0,1], [1,1,1], HUE_MAGENTA, 1, 0.5);
	});
});
