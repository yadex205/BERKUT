precision highp float;
varying lowp vec2 vTextureCoord;
uniform sampler2D YTexture;
uniform sampler2D UTexture;
uniform sampler2D VTexture;
uniform float alpha;

const mat4 YUV2RGB = mat4(
    1.1643828125, 0, 1.59602734375, -.87078515625,
    1.1643828125, -.39176171875, -.81296875, .52959375,
    1.1643828125, 2.017234375, 0, -1.081390625,
    0, 0, 0, 1
);
