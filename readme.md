[![Tests](https://github.com/chkt/xyzw-rgba/workflows/tests/badge.svg)](https://github.com/chkt/xyzw-rgba/actions)
[![Version](https://img.shields.io/npm/v/xyzw-rgba)](https://www.npmjs.com/package/@chkt/xyzw-rgba)
![Node](https://img.shields.io/node/v/xyzw-rgba)
![Dependencies](https://img.shields.io/librariesio/release/npm/xyzw-rgba)
![Licence](https://img.shields.io/npm/l/xyzw-rgba)
![Language](https://img.shields.io/github/languages/top/chkt/xyzw-rgba)
![Size](https://img.shields.io/bundlephobia/min/xyzw-rgba)

# xyzw-rgba

Color vectors and transforms

## Install

```sh
yarn add xyzw-rgba
```

## Use

xyzw-rgba is an extension of [xyzw](https://github.com/chkt/xyzw) providing
methods to easily work with colors and convert them from and to common color formats.
# Modules
## colorSpace
[`./source/colorSpace.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/colorSpace.ts#L1)
### Interfaces
```ts
interface ColorSpace {
  readonly compress : Transfer;
  readonly expand : Transfer;
}
```
### Type Aliases
```ts
type Transfer = <R extends vec3.Vector3>(target:R, source:vec3.Vector3) => R;
```
### Variables
```ts
const linear:ColorSpace;
const srgb:ColorSpace;
```
### Functions
```ts
function compressGamma<R extends Vector3>(inverse:number, res:R, rgb:Vector3) : R;
function compressSrgb<R extends Vector3>(res:R, rgb:Vector3) : R;
function expandGamma<R extends Vector3>(factor:number, res:R, source:Vector3) : R;
function expandSrgb<R extends Vector3>(res:R, source:Vector3) : R;
function gamma(factor:number = 2.2) : ColorSpace;
function identity<R extends Vector3>(r:R, v:Vector3) : R;
```
## css
[`./source/css.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/css.ts#L1)
### Enumerations
```ts
const enum cssStringifyMode {
  fast = "fast",
  short = "short"
}
```
### Interfaces
```ts
interface CssCommonOptions<K extends string = string> {
  readonly namedColors : Readonly<Record<K, Vector4>>;
  readonly profile : ColorSpace;
}
interface CssParseOptions<K extends string = string> extends CssCommonOptions<K> {
  readonly matte : Vector3;
}
interface CssStringifyOptions<K extends string = string> extends CssCommonOptions<K> {
  readonly format : CssFormat;
  readonly mode : CssStringifyMode;
}
```
### Type Aliases
```ts
type CssStringifyMode = "fast" | "short";
```
### Functions
```ts
function assignRgb<R extends Vector3>(res:R, expr:string, opts?:Partial<CssParseOptions<string>>) : vec3.Vector3;
function assignRgba<R extends Vector4>(res:R, expr:string, opts?:Partial<Omit<CssParseOptions<string>, "matte">>) : R;
function fromRgb(rgb64:Vector3, opts?:Partial<CssStringifyOptions<string>>) : string;
function fromRgba(rgba64:Vector4, opts?:Partial<CssStringifyOptions<string>>) : string;
function toRgb(expr:string, opts?:Partial<CssParseOptions<string>>) : vec3.Vector3;
function toRgba(expr:string, opts?:Partial<Omit<CssParseOptions<string>, "matte">>) : vec4.Vector4;
```
## cssColors
[`./source/cssColors.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/cssColors.ts#L1)
### Variables
```ts
const css1Colors:NamedCssColors;
const css2Colors:NamedCssColors;
const css3Colors:NamedCssColors;
const css4Colors:NamedCssColors;
```
## hsl
[`./source/hsl.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/hsl.ts#L1)
### Interfaces
```ts
interface Hsl {
  hue : number;
  lightness : number;
  saturation : number;
}
```
### Functions
```ts
function Copy(hsl:Hsl) : Hsl;
function Create(hue:number = 0.0, saturation:number = 0.0, lightness:number = 1.0) : Hsl;
function CssHsl(expr:`hsl(${ string })`, profile?:ColorSpace) : Hsl;
function CssHslToRgb(expr:`hsl(${ string })`, profile?:ColorSpace) : vec3.Vector3;
function Hsla(hsla64:Hsla, matte:Hsl = white) : Hsl;
function Rgb(rgb64:Vector3, transfer?:Transfer) : Hsl;
function assign<R extends Hsl>(res:R, hue:number = 0.0, saturation:number = 1.0, lightness:number = 1.0) : R;
function assignRgb<R extends Vector3>(res:R, hsl:Hsl, transfer:Transfer = identity) : R;
function chroma(hsl:Hsl) : number;
function copy<R extends Hsl>(res:R, hsl:Hsl) : R;
function cssHsl<R extends Hsl>(res:R, expr:`hsl(${ string })`, profile?:ColorSpace) : R;
function cssHslAssignRgb<R extends Vector3>(res:R, expr:`hsl(${ string })`, profile:ColorSpace = linear) : R;
function equals(a:Hsl, b:Hsl, e:number = epsilon) : boolean;
function hsla<R extends Hsl>(res:R, hsla64:Hsla, matte:Hsl = white) : R;
function normalizeHue(hsl:Hsl) : number;  // H mod 2π ((H % 2π + 2π) % 2π)
function rgb<R extends Hsl>(res:R, rgb64:Vector3, transfer:Transfer = identity) : R;
function rgbToCss(rgb64:Vector3, profile:ColorSpace = linear, opts?:Partial<CssOptions>) : CssHslString;
function toCss(hsl:Hsl, profile?:ColorSpace, opts?:Partial<CssOptions>) : CssHslString;
function toRgb(hsl:Hsl, transfer?:Transfer) : vec3.Vector3;
```
## hsla
[`./source/hsla.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/hsla.ts#L1)
### Interfaces
```ts
interface Hsla extends Hsl {
  alpha : number;
}
```
### Functions
```ts
function Copy(hsla:Hsla) : Hsla;
function Create(hue:number = 0.0, saturation:number = 0.0, lightness:number = 1.0, alpha:number = 1.0) : Hsla;
function CssHsla(expr:CssHslaString, profile?:ColorSpace) : Hsla;
function CssHslaToRgba(expr:CssHslaString, profile?:ColorSpace) : vec4.Vector4;
function Hsl(hsl64:Hsl, alpha:number = 1.0) : Hsla;
function Rgba(rgba64:Vector4, transfer?:Transfer) : Hsla;
function assign<R extends Hsla>(res:R, hue:number = 0.0, saturation:number = 1.0, lightness:number = 1.0, alpha:number = 1.0) : Hsla;
function assignRgba<R extends Vector4>(res:R, hsla:Hsla, transfer?:Transfer) : R;
function copy<R extends Hsla>(res:R, hsla:Hsla) : R;
function cssHsla<R extends Hsla>(res:R, expr:CssHslaString, profile?:ColorSpace) : Hsla;
function cssHslaAssignRgba<R extends Vector4>(res:R, expr:CssHslaString, profile:ColorSpace = linear) : R;
function equals(a:Hsla, b:Hsla, e:number = epsilon) : boolean;
function hsl<R extends Hsla>(res:R, hsl64:Hsl, alpha:number = 1.0) : Hsla;
function rgba<R extends Hsla>(res:R, rgba64:Vector4, transfer?:Transfer) : R;
function rgbaToCss(rgba64:Vector4, profile:ColorSpace = linear, opts?:Partial<CssOptions>) : CssHslString | CssHslaString;
function toCss(hsla:Hsla, profile?:ColorSpace, opts?:Partial<CssOptions>) : CssHslString | CssHslaString;
function toRgba(hsla:Hsla, transfer?:Transfer) : vec4.Vector4;
```
## index
[`./source/index.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/index.ts#L1)
### References
```ts
export * as conversion from "./colorSpace";
export * as css from "./css";
export * as hsl from "./hsl";
export * as hsla from "./hsla";
export * as lab from "./lab";
export {
  CssFormat,
  CssHslString,
  CssHslaString,
  CssOptions,
  CssPrecision,
  CssRgbString,
  CssRgbaString,
  HexOptions,
  cssFormat,
  cssPrecision,
  isCssHslString,
  isCssHslaString,
  isCssRgbString,
  isCssRgbaString
} from "./parse";
export * as rgb from "./rgb";
export * as rgba from "./rgba";
export * as vector3 from "./vector3";
export * as vector4 from "./vector4";
```
## lab
[`./source/lab.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/lab.ts#L1)
### Interfaces
```ts
interface Lab {
  a : number;
  alpha : number;
  b : number;
  lightness : number;
}
```
### Variables
```ts
const d50:Vector3;
const d65:Vector3;
```
### Functions
```ts
function Copy(lab:Lab) : Lab;
function Create(lightness:number = 100.0, a:number = 0.0, b:number = 0.0, alpha:number = 1.0) : Lab;
function CssLab(expr:`lab(${ string })`) : Lab;
function Rgba(rgba64:Vector4, illuminant?:Vector3, expand?:Transfer) : Lab;
function assign<R extends Lab>(res:R, lightness:number = 100.0, a:number = 0.0, b:number = 0.0, alpha:number = 1.0) : R;
function assignRgba<R extends Vector4>(res:R, lab:Lab, illuminant:Vector3 = d50, compress:Transfer = identity) : R;
function copy<R extends Lab>(res:R, lab:Lab) : R;
function cssLab<R extends Lab>(res:R, expr:`lab(${ string })`) : Lab;
function equals(a:Lab, b:Lab, e:number = epsilon) : boolean;
function rgba<R extends Lab>(res:R, rgba64:Vector4, illuminant:Vector3 = d50, expand:Transfer = identity) : R;
function toCss(lab:Lab, opts?:Partial<CssOptions>) : CssLabString;
function toRgba(lab:Lab, illuminant?:Vector3, compress?:Transfer) : vec4.Vector4;
```
## named
[`./source/named.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/named.ts#L1)
### Type Aliases
```ts
type CssColor = HashString | CssRgbString | CssRgbaString | CssHslString | CssHslaString;
type HashString = `#${ string }`;
type NamedCssColors = Readonly<Record<string, CssColor | undefined>>;
type NamedRgba64 = Readonly<Record<K, Vector4>>;
```
### Functions
```ts
function createMap<T extends Readonly<Record<string, undefined | CssColor>>, K extends string>(named:T, profile?:ColorSpace) : CssCommonOptions<K>;
function findNameOfVec3(map:Readonly<Record<string, Vector4>>, rgb64:Vector3) : string | undefined;
function findNameOfVec4(map:Readonly<Record<string, Vector4>>, rgba64:Vector4) : string | undefined;
```
## parse
[`./source/parse.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/parse.ts#L1)
### Enumerations
```ts
const enum cssFormat {
  css2 = 2,
  css4 = 4
}
const enum cssPrecision {
  float64 = 64,
  uint8 = 8
}
```
### Interfaces
```ts
interface CssOptions {
  readonly angleUnit : AngleUnit;
  readonly decimals : number;
  readonly format : CssFormat;
  readonly percent : boolean;
  readonly precision : CssPrecision;
}
interface HexOptions {
  readonly hash : boolean;
  readonly short : boolean;
  readonly uppercase : boolean;
}
```
### Type Aliases
```ts
type CssFormat = 2 | 4;
type CssHslString = `hsl(${ string })`;
type CssHslaString = CssHslString | `hsla(${ string })`;
type CssLabString = `lab(${ string })`;
type CssPrecision = 8 | 64;
type CssRgbString = `rgb(${ string })`;
type CssRgbaString = CssRgbString | `rgba(${ string })`;
```
### Variables
```ts
const CSS2_DELIM:",";
const CSS4_ALPHA:"/";
const CSS4_DELIM:" ";
const CSS_MAX_DECIMALS:10;
const CSS_PCT:"%";
const DEG_TO_RAD:number;
const PCT_TO_UINT8:2.55;
const PCT_TO_UNIT:0.01;
const RAD_TO_DEG:number;
const TURN_TO_RAD:number;
const UINT8_TO_PCT:number;
const UINT8_TO_UNIT:number;
const UNIT_TO_PCT:100;
const UNIT_TO_UINT8:255;
const cssDefaults:CssOptions;
const hexDefaults:HexOptions;
```
### Functions
```ts
function compressUint24<R extends Vector3>(res:R, rgb64:Vector3, profile:ColorSpace = linear) : R;
function expandUint24<R extends Vector3>(res:R, rgb8:Vector3, profile:ColorSpace = linear) : R;
function isCssHslString(expr:string) : expr is `hsl(${ string })`;
function isCssHslaString(expr:string) : expr is CssHslaString;
function isCssLabString(expr:string) : expr is `lab(${ string })`;
function isCssRgbString(expr:string) : expr is `rgb(${ string })`;
function isCssRgbaString(expr:string) : expr is CssRgbaString;
function parseCssAngle(value:string) : number;
function parseCssNumberOrPercent(value:string, percentScale:number = 0.01) : number;
function parseCssPercent(value:string) : number;
function parseCssUint8(value:string) : number;
function parseCssUnitInterval(value:string) : number;
```
## real
[`./source/real.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/real.ts#L1)
### Enumerations
```ts
const enum angleUnit {
  deg = "deg",
  grad = "grad",
  rad = "rad",
  turn = "turn"
}
```
### Type Aliases
```ts
type AngleUnit = "turn" | "rad" | "deg" | "grad";
```
### Functions
```ts
function align(n:number, step:number = 1.0, threshold:number = 0.5) : number;
function angle(n:number, from:AngleUnit, to:AngleUnit = angleUnit.rad) : number;
function clamp(n:number, a:number, b:number) : number;
function interval(n:number, a:number, b:number) : number;
function toFixed(n:number, max:number = 0) : string;
```
## rgb
[`./source/rgb.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/rgb.ts#L1)
### Functions
```ts
function CssRgb(expr:`rgb(${ string })`, profile?:ColorSpace) : Vector3;
function Hex24(value:string, profile?:ColorSpace) : Vector3;
function Uint24(value:number, profile?:ColorSpace) : Vector3;
function cssRgb<R extends Vector3>(res:R, expr:`rgb(${ string })`, profile?:ColorSpace) : R;
function hex24<R extends Vector3>(res:R, value:string, profile?:ColorSpace) : R;
function toCss(rgb64:Vector3, profile:ColorSpace = linear, opts?:Partial<CssOptions>) : CssRgbString;
function toHex24(rgb64:Vector3, profile?:ColorSpace, opts?:Partial<HexOptions>) : string;
function toUint24(rgb64:Vector3, profile?:ColorSpace) : number;
function uint24<R extends Vector3>(res:R, value:number, profile?:ColorSpace) : R;
```
## rgba
[`./source/rgba.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/rgba.ts#L1)
### Functions
```ts
function CssRgba(expr:CssRgbaString, profile?:ColorSpace) : vec4.Vector4;
function Hex32(value:string, profile?:ColorSpace) : vec4.Vector4;
function cssRgba<R extends Vector4>(res:R, expr:CssRgbaString, profile:ColorSpace = linear) : R;
function hex32<R extends Vector4>(res:R, value:string, profile:ColorSpace = linear) : R;
function toCss(rgba64:Vector4, profile:ColorSpace = linear, opts?:Partial<CssOptions>) : CssRgbString | CssRgbaString;
function toHex32(rgba64:Vector4, profile:ColorSpace = linear, opts?:Partial<HexOptions>) : string;
```
## vector3
[`./source/vector3.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/vector3.ts#L1)
### Type Aliases
```ts
type binary11 = (a:number, b:number) => number;
type unary1 = (n:number) => number;
```
### Functions
```ts
function Align(v:Vector3, interval?:number, threshold?:number) : Vector3;
function Ceil(v:Vector3) : Vector3;
function Clamp(v:Vector3, a:number, b:number) : Vector3;
function Floor(v:Vector3) : Vector3;
function Matte(base:Vector3, fill:Vector4) : Vector3;
function Max(v:Vector3, n:number) : Vector3;
function Min(v:Vector3, n:number) : Vector3;
function Mono(n:number = 1.0) : Vector3;
function Round(v:Vector3) : Vector3;
function align<R extends Vector3>(r:R, v:Vector3, interval:number = 1.0, threshold:number = 0.5) : R;
function ceil<R extends Vector3>(r:R, v:Vector3) : R;
function clamp<R extends Vector3>(r:R, v:Vector3, a:number, b:number) : R;
function floor<R extends Vector3>(r:R, v:Vector3) : R;
function matte<R extends Vector3>(r:R, base:Vector3, fill:Vector4) : R;
function max<R extends Vector3>(r:R, v:Vector3, n:number) : R;
function min<R extends Vector3>(r:R, v:Vector3, n:number) : R;
function mono<R extends Vector3>(r:R, n:number = 1.0) : Vector3;
function round<R extends Vector3>(r:R, v:Vector3) : R;
function toString(v:Vector3, decimals:number = 3) : string;
```
## vector4
[`./source/vector4.ts`](https://github.com/chkt/xyzw-rgba/blob/ab8f0a1/source/vector4.ts#L1)
### Functions
```ts
function Align(v:Vector4, interval?:number, threshold?:number) : Vector4;
function Ceil(v:Vector4) : Vector4;
function Clamp(v:Vector4, a:number, b:number) : Vector4;  // min(max(v⃗, min(a, b)), max(a, b))
function DemultiplyAlpha(v:Vector4) : Vector4;
function Floor(v:Vector4) : Vector4;
function Max(v:Vector4, n:number) : Vector4;
function Min(v:Vector4, n:number) : Vector4;
function MultiplyAlpha(v:Vector4) : Vector4;
function Round(v:Vector4) : Vector4;
function align<R extends Vector4>(r:R, v:Vector4, interval:number = 1.0, threshold:number = 0.5) : R;
function alignAssignAlpha<R extends Vector4>(v:R, interval:number = 1.0, threshold:number = 0.5) : R;
function assignAlpha<R extends Vector4>(v:R, n:number) : R;
function ceil<R extends Vector4>(r:R, v:Vector4) : R;
function clamp<R extends Vector4>(r:R, v:Vector4, a:number, b:number) : R;  // r⃗ = min(max(v⃗, min(a, b)), max(a, b))
function clampAssignAlpha<R extends Vector4>(v:R, a:number, b:number) : R;
function demultiplyAlpha<R extends Vector4>(r:R, v:Vector4) : R;
function demultiplyAssignAlpha<R extends Vector4>(v:R) : R;
function floor<R extends Vector4>(r:R, v:Vector4) : R;
function hadamardAssignAlpha<R extends Vector4>(v:R, n:number) : R;
function max<R extends Vector4>(r:R, v:Vector4, n:number) : R;
function min<R extends Vector4>(r:R, v:Vector4, n:number) : R;
function multiplyAlpha<R extends Vector4>(r:R, v:Vector4) : R;
function multiplyAssignAlpha<R extends Vector4>(v:R) : R;
function round<R extends Vector4>(r:R, v:Vector4) : R;
function toString(v:Vector4, decimals:number = 3) : string;
```
