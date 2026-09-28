// Developable cylindrical peel: preserves the sheet's arc length instead of
// stretching a point through an elastic displacement field.
export class ElasticSheet {
  constructor(nx=64,ny=44){this.nx=nx;this.ny=ny;this.count=(nx+1)*(ny+1);this.rest=new Float32Array(this.count*3);this.offset=new Float32Array(this.count*3);this.pin=null;this.energy=0;this.amount=0;this.speed=0;this.direction=[1,1];this.reset(3,2);}
  reset(w,h){this.w=w;this.h=h;this.pin=null;this.amount=0;this.speed=0;this.energy=0;this.offset.fill(0);for(let y=0;y<=this.ny;y++)for(let x=0;x<=this.nx;x++){const i=(y*(this.nx+1)+x)*3;this.rest[i]=(x/this.nx-.5)*w;this.rest[i+1]=(.5-y/this.ny)*h;}}
  grab(u,v){const x=(u-.5)*2,y=(v-.5)*2;let dx=Math.abs(x)>.68?Math.sign(x):0,dy=Math.abs(y)>.68?Math.sign(y):0;if(!dx&&!dy){if(Math.abs(x)>Math.abs(y))dx=Math.sign(x);else dy=Math.sign(y);}const length=Math.hypot(dx,dy);this.direction=[dx/length,dy/length];this.pin={origin:[(u-.5)*this.w,(v-.5)*this.h,0],target:[0,0,0]};}
  release(){this.pin=null;}
  step(dt){const short=Math.min(this.w,this.h),radius=short*.115;let target=0;
    if(this.pin){const t=this.pin.target;const inward=Math.max(0,-t[0]*this.direction[0]-t[1]*this.direction[1]);target=Math.min(short*.72,inward*.72+Math.hypot(t[0],t[1])*.16);}
    // Near-critical damping: firm resistance, controlled settling, no rubber bounce.
    const steps=Math.max(1,Math.ceil(dt*180)),h=dt/steps;for(let j=0;j<steps;j++){this.speed+=(240*(target-this.amount)-32*this.speed)*h;this.amount=Math.max(0,this.amount+this.speed*h);}
    const [dx,dy]=this.direction;const edge=(Math.abs(dx)*this.w+Math.abs(dy)*this.h)*.5;const fold=edge-this.amount;let energy=0;
    for(let i=0;i<this.rest.length;i+=3){const s=this.rest[i]*dx+this.rest[i+1]*dy-fold;let shift=0,z=0;if(s>0){const arc=Math.min(s,Math.PI*radius),theta=arc/radius;shift=radius*Math.sin(theta)-Math.max(0,s-arc)-s;z=radius*(1-Math.cos(theta));}this.offset[i]=dx*shift;this.offset[i+1]=dy*shift;this.offset[i+2]=z;energy=Math.max(energy,Math.abs(shift),z);}this.energy=energy;
  }
  write(array){for(let i=0;i<array.length;i++)array[i]=this.rest[i]+this.offset[i];}
  pinError(){return 0;}
}
