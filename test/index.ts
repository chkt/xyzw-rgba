import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as vector3 from '../source/vector3';
import * as vector4 from '../source/vector4';
import * as parse from '../source/parse';
import * as colorConvert from '../source/colorSpace';
import * as rgb from '../source/rgb';
import * as rgba from '../source/rgba';
import * as hsl from '../source/hsl';
import * as hsla from '../source/hsla';
import * as lab from '../source/lab';
import * as lch from '../source/lch';
import * as css from '../source/css';
import * as xyzwRgba from '../source';


describe('xyzw-rgba', () => {
	it('should include its fully exposed modules', () => {
		assert.deepStrictEqual(xyzwRgba.vector3, vector3);
		assert.deepStrictEqual(xyzwRgba.vector4, vector4);
		assert.deepStrictEqual(xyzwRgba.conversion, colorConvert);
		assert.deepStrictEqual(xyzwRgba.rgb, rgb);
		assert.deepStrictEqual(xyzwRgba.rgba, rgba);
		assert.deepStrictEqual(xyzwRgba.hsl, hsl);
		assert.deepStrictEqual(xyzwRgba.hsla, hsla);
		assert.deepStrictEqual(xyzwRgba.lab, lab);
		assert.deepStrictEqual(xyzwRgba.lch, lch);
		assert.deepStrictEqual(xyzwRgba.css, css);
	});
});

describe('parse', () => {
	it("should include the module's exposed methods", () => {
		assert.deepStrictEqual(xyzwRgba.isCssRgbString, parse.isCssRgbString);
		assert.deepStrictEqual(xyzwRgba.isCssRgbaString, parse.isCssRgbaString);
		assert.deepStrictEqual(xyzwRgba.isCssHslString, parse.isCssHslString);
		assert.deepStrictEqual(xyzwRgba.isCssHslaString, parse.isCssHslaString);
	});
});
