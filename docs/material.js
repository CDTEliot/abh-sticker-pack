export const vertex = `
uniform float lift;uniform float spread;
varying vec2 vUv;varying vec3 vPosition;varying vec3 vNormal;varying vec3 vTangent;
void main(){vUv=uv;vec3 p=position+normal*lift;p.y+=spread;
vec4 mv=modelViewMatrix*vec4(p,1.);vPosition=mv.xyz;vNormal=normalize(normalMatrix*normal);
vTangent=normalize(normalMatrix*vec3(1.,0.,0.));gl_Position=projectionMatrix*mv;}`;
export const fragment = `
uniform sampler2D art;uniform vec2 size;uniform float mode;uniform float opacity;
varying vec2 vUv;varying vec3 vPosition;varying vec3 vNormal;varying vec3 vTangent;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
vec3 spectrum(float phase){return .52+.48*cos(6.283185*(vec3(0.,.333,.667)+phase));}
float rounded(vec2 p,vec2 halfSize,float radius){vec2 q=abs(p)-halfSize+radius;return min(max(q.x,q.y),0.)+length(max(q,0.))-radius;}
float star(vec2 p,float arms){float r=length(p);float a=atan(p.y,p.x);float rays=pow(abs(cos(a*arms*.5)),26.);return exp(-r*r*200.)+rays*exp(-r*10.)*.8;}
void main(){
vec2 p=(vUv-.5)*size;float shortSide=min(size.x,size.y);
vec4 ink=texture2D(art,vUv);float alpha=ink.a*opacity;if(alpha<.015)discard;
vec3 N=normalize(vNormal);if(!gl_FrontFacing)N=-N;
vec3 V=normalize(-vPosition),L=normalize(vec3(-.35,.55,1.4));
vec3 H=normalize(V+L);vec3 T=normalize(vTangent-N*dot(vTangent,N));vec3 B=normalize(cross(N,T));
vec2 angle=vec2(dot(H,T),dot(H,B));float facing=max(dot(N,V),0.);
// Fixed grating and flake orientations live in the UV material. No clock input.
float grooves=sin(p.x*27.+sin(p.y*13.)*.35)*.015;
float phase=dot(angle,vec2(2.1,-1.55))+p.x*.15+p.y*.13+grooves;
vec3 rainbow=spectrum(phase);float silver=pow(.5+.5*sin(phase*15.),12.);
vec3 metal=mix(rainbow*.76+.19,vec3(.96,.985,1.),silver*.75);
float band=exp(-pow((angle.x*.85+angle.y*.55+p.x*.055+p.y*.025)*8.,2.));
float thin=exp(-pow((angle.x*.85+angle.y*.55+p.x*.055+p.y*.025-.055)*42.,2.));
vec3 color=ink.rgb;
float luminance=dot(color,vec3(.299,.587,.114));float whites=smoothstep(.72,.98,luminance);float blacks=1.-smoothstep(.04,.22,luminance);
float coating=(.19+.27*band)*(1.-blacks*.82)*(1.-whites*.30);
color=mix(color,color*(.7+rainbow*.5)+rainbow*.14,coating);
color+=whites*(rainbow-.5)*(.065+.1*band);

color+=vec3(1.,.985,.96)*(band*.055+thin*.17)*(1.-blacks*.85);
// Thousands of fixed, independently oriented microscopic foil flakes.
vec2 grid=p*180.;vec2 cell=floor(grid);vec2 local=fract(grid)-.5;
float seed=hash(cell);vec2 flake=vec2(hash(cell+11.3),hash(cell+47.8))-.5;
float alignment=exp(-dot(angle-flake*.95,angle-flake*.95)*210.);
float fleck=1.-smoothstep(.08,.34,length(local-flake*.45));
float micro=alignment*fleck*step(.22,seed);
float grain=(hash(cell+83.)-.5)*.10;
color+=grain*(1.-blacks)*.38;
color+=mix(spectrum(seed+phase*.2),vec3(1.),.68)*micro*1.10*(1.-blacks*.85);
// Larger occasional glints: fixed surface locations, activated by normal alignment.
vec2 sg=p*4.8;vec2 sc=floor(sg);vec2 sp=fract(sg)-.5;
float ss=hash(sc+97.);vec2 center=(vec2(hash(sc+7.),hash(sc+21.))-.5)*.65;
vec2 orient=(vec2(hash(sc+31.),hash(sc+59.))-.5)*.66;
float gate=exp(-dot(angle-orient,angle-orient)*620.)*step(.68,ss);
float flare=star((sp-center)*.85,ss>.92?6.:4.)*gate;
color+=mix(spectrum(phase+.12),vec3(1.),.87)*flare*2.6;
// Preserve the original cut and print. Physical sides remain neutral vinyl.
if(mode>3.5){float gridline=step(.975,fract(vUv.x*28.))+step(.975,fract(vUv.y*28.));color=vec3(.83,.81,.75)-gridline*.035;}
else if(mode>2.5){color=vec3(.88,.88,.83);alpha*=.54;}
else if(mode>1.5){color=vec3(.94,.94,.93);}
else if(mode>.5){color=vec3(.92,.96,1.);alpha*=.045+band*.10+thin*.16;}
if(!gl_FrontFacing&&mode<.5)color=vec3(.88,.89,.88);
color*=.91+.09*abs(dot(N,L));
gl_FragColor=vec4(clamp(color,0.,1.),alpha);
}`;
