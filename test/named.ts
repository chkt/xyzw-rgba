import * as assert from 'assert';
import { describe, it } from 'mocha';
import * as vec3 from 'xyzw/dist/vector3';
import * as vec4 from 'xyzw/dist/vector4';
import { linear } from '../source/colorSpace';
import { NamedRgba64, createMap, findNameOfVec3, findNameOfVec4 } from '../source/named';
import { createColorSpace } from './mock/colorSpace';


describe('createMap', () => {
	it('should create a NamedRgba64 from css color strings', () => {
		assert.deepStrictEqual(createMap({
			white : 'rgb(255,255,255)',
			red : '#f00',
			transparent : 'rgba(0,0,0,0)'
		}), {
			profile : linear,
			namedColors : {
				white : { x : 1.0, y : 1.0, z : 1.0, w : 1.0 },
				red : { x : 1.0, y : 0.0, z : 0.0, w : 1.0 },
				transparent : { x : 0.0, y : 0.0, z : 0.0, w : 0.0 }
			}
		});
	});

	it('should apply color conversions', () => {
		const cs = createColorSpace(2.0);

		assert.deepStrictEqual(createMap({
			blue : '#6699ff',
			blueTrn : 'rgba(102,153,255,0.2)'
		}, cs), {
			profile : cs,
			namedColors : {
				blue : { x : 0.8, y : 1.2, z : 2.0, w : 1.0 },
				blueTrn : { x : 0.8, y : 1.2, z : 2.0, w : 0.2 }
			}
		});
	});
});

describe('findNameOfVec3', () => {
	it('should return the name of a matched Vector3', () => {
		const map:NamedRgba64<'red' | 'white' | 'transparent'> = {
			red : vec4.Create(1.0),
			white : vec4.Create(1.0, 1.0, 1.0),
			transparent : vec4.Create(0.0, 0.0, 0.0, 0.0)
		};

		assert.strictEqual(findNameOfVec3(map, vec3.Create(0.0, 1.0, 0.0)), undefined);
		assert.strictEqual(findNameOfVec3(map, vec3.Create(1.0, 0.0, 0.0)), 'red');
		assert.strictEqual(findNameOfVec3(map, vec3.Create(1.0, 1.0, 1.0)), 'white');
	});
});

describe('findNameOfVec4', () => {
	it('should return the name of a matched Vector4', () => {
		const map:NamedRgba64<'red' | 'white' | 'transparent'> = {
			red : vec4.Create(1.0),
			white : vec4.Create(1.0, 1.0, 1.0),
			transparent : vec4.Create(0.0, 0.0, 0.0, 0.0)
		};

		assert.strictEqual(findNameOfVec4(map, vec4.Create(0.0, 1.0, 0.0, 1.0)), undefined);
		assert.strictEqual(findNameOfVec4(map, vec4.Create(1.0, 0.0, 0.0, 1.0)), 'red');
		assert.strictEqual(findNameOfVec4(map, vec4.Create(1.0, 0.0, 0.0, 0.5)), undefined);
		assert.strictEqual(findNameOfVec4(map, vec4.Create(1.0, 1.0, 1.0, 1.0)), 'white');
		assert.strictEqual(findNameOfVec4(map, vec4.Create(1.0, 1.0, 1.0, 0.0)), 'transparent');
		assert.strictEqual(findNameOfVec4(map, vec4.Create(0.0, 0.0, 0.0, 0.0)), 'transparent');
	});
});
