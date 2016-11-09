#xyzw-rgba

Color vectors and transforms

##Install

```sh
$ npm install xyzw-rgba
```

###Use

xyzw-rgba is an extension of [xyzw](https://github.com/chkt/xyzw) providing
methods to easily work with colors and convert them from and to common color formats.

```js
import Vector3 from 'xyzw/source/Vector3';
import Vector4 from 'xyzw/source/Vector4';

import Vector3RGB from 'xyzw-rgba/source/Vector3RGB';
import Vector4RGBA from 'xyzw-rgba/source/Vector4RGBA';


Vector3RGB
	.CSS('rgb(255,127, 63)')
	.multiplyScalarEQ(0.5)
	.toCSS();   //'rgb(127,63,31)'

Vector3RGB
	.CSS('#ff00ff')
	.addEQ(new Vector3([1.0, 1.0, 1.0]))
	.toCSS();   //'rgb(255,255,255)'

Vector4RGBA
	.CSS('rgba(255,127,63,1.0)')
	.multiplyScalarEQ(0.5)
	.toCSS();  //'rgba(127,63,31,0.5)'

Vector4RGBA
	.Int(0xffff7f3f)
	.subtractEQ(new Vector4([0.5, 0.0, -0.25, 0.5]))
	.toCSS();  //'rgba(127,127,127,0.5)
```
