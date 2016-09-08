precision highp float;
varying lowp vec2 vTextureCoord;
uniform sampler2D rgbTexture;

void main(void) {
    gl_FragColor = texture2D(rgbTexture, vTextureCoord);
}
