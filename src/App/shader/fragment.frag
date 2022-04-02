uniform sampler2D texture1;

varying vec2 vUv;
varying vec3 vEye;
varying vec3 vNormal;

vec2 matcap(vec3 eye,vec3 normal){
  vec3 reflected=reflect(eye,normal);
  float m=2.8284271247461903*sqrt(reflected.z+1.);
  return reflected.xy/m+.5;
}

void main(){
  vec2 mUv=matcap(vEye,vNormal);
  gl_FragColor=texture2D(texture1,mUv);
}