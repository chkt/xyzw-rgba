import { Vector3 } from 'xyzw/dist/vector3';
import { Create, Vector4, copy, equals, vector3 } from 'xyzw/dist/vector4';
import { multiplyAssignAlpha } from './vector4';
import { CssHslString, CssHslaString, CssRgbString, CssRgbaString } from './parse';
import { ColorSpace, linear } from './colorSpace';
import { CssCommonOptions, toRgba } from './css';


export type HashString = `#${ string }`;
export type CssColor = HashString | CssRgbString | CssRgbaString | CssHslString | CssHslaString;
export type NamedCssColors = Readonly<Record<string, CssColor | undefined>>;
export type NamedRgba64<K extends string> = Readonly<Record<K, Vector4>>;


const v = Create();


export function createMap<
	T extends NamedCssColors,
	K extends Extract<keyof T, string>
>(named:T, profile?:ColorSpace) : CssCommonOptions<K> {
	const res:Partial<Record<K, Vector4>> = {};

	for (const key in named) {
		if (!Object.prototype.hasOwnProperty.call(named, key)) continue;

		res[key as K] = toRgba(named[key] as string, { profile });
	}

	return {
		profile : profile ?? linear,
		namedColors : res as NamedRgba64<K>
	};
}

export function findNameOfVec3(map:NamedRgba64<string>, rgb64:Vector3) : string | undefined {
	vector3(v, rgb64);

	for (const key in map) {
		if (Object.prototype.hasOwnProperty.call(map, key) && equals(v, map[key])) return key;
	}

	return undefined;
}

export function findNameOfVec4(map:NamedRgba64<string>, rgba64:Vector4) : string | undefined {
	copy(v, rgba64);

	if (v.w < 1e-10) multiplyAssignAlpha(v);

	for (const key in map) {
		if (Object.prototype.hasOwnProperty.call(map, key) && equals(v, map[key])) return key;
	}

	return undefined;
}
