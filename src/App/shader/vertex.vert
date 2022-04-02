uniform float uTime;

varying vec2 vUv;
varying vec3 vEye;
varying vec3 vNormal;

float PI=3.141592653589793238;

vec3 rotate(vec3 pos,float angle){
  vec4 p=vec4(pos,1.);
  vec3 axis=vec3(0.,1.,0.);
  float s=sin(angle);
  float c=cos(angle);
  float oc=1.-c;
  mat4 matrix=mat4(
    oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
    oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
    oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
  0.,0.,0.,1.);
  return(matrix*p).xyz;
}

float qinticInOut(float t){
  return t<.5
  ?+16.*pow(t,5.)
  :-.5*abs(pow(2.*t-2.,5.))+1.;
}

void main(){
  vUv=uv;
  float speed=.5;
  vec3 axis=normalize(vec3(1.,1.,0.));
  // float norm=.5;
  float offset=position.y*2.;//(dot(axis,position)+norm/2.)/norm;
  float distortion=3.;
  float localprogress=clamp((fract(uTime*speed)-.01*distortion*offset)/(1.-.01*distortion),0.,1.);
  float angle=qinticInOut(localprogress)*PI;
  vec3 newPos=rotate(position,angle);
  vNormal=rotate(normal,angle);
  vec3 wPos=(modelMatrix*vec4(newPos,1.)).xyz;
  vEye=normalize(wPos-cameraPosition);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(newPos,1.);
}