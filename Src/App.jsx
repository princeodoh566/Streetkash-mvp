import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── GLOBAL STYLES ────────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#F5C842;--g2:#E8A820;--dark:#06080F;--text:#EFF3FF;
  --m:#3A4560;--m2:#68768F;--green:#0CFFAA;--or:#FF6535;
  --bl:#4DAAFF;--pu:#B06FFF;--pk:#FF5090;--card:#0D1220;
}
html,body{background:var(--dark);font-family:'Space Grotesk',sans-serif;color:var(--text);overflow-x:hidden}
.grain{position:fixed;inset:0;z-index:998;pointer-events:none;opacity:.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px}
.dotgrid{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:radial-gradient(circle,rgba(255,255,255,.07) 1px,transparent 1px);
  background-size:28px 28px}
.aurora{position:fixed;inset:0;overflow:hidden;z-index:1;pointer-events:none}
.orb{position:absolute;border-radius:50%;filter:blur(100px)}
@keyframes d1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(45px,-55px) scale(1.1)}80%{transform:translate(-35px,25px) scale(.95)}}
@keyframes d2{0%,100%{transform:translate(0,0)}35%{transform:translate(-55px,35px)}70%{transform:translate(30px,-45px)}}
@keyframes d3{0%,100%{transform:translate(0,0)}50%{transform:translate(35px,45px) scale(1.08)}}
.glass{background:rgba(255,255,255,.038);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);border:1px solid rgba(255,255,255,.08);border-radius:20px;position:relative;overflow:hidden}
.glass::before{content:'';position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.05) 0%,transparent 100%);pointer-events:none;border-radius:20px 20px 0 0}
@keyframes holo{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.holo{background:linear-gradient(90deg,#F5C842,#FF6535,#FF5090,#B06FFF,#4DAAFF,#0CFFAA,#F5C842);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:holo 5s linear infinite}
.holo-ring{position:absolute;inset:-2px;border-radius:inherit;background:linear-gradient(90deg,#F5C842,#FF6535,#FF5090,#B06FFF,#4DAAFF,#0CFFAA,#F5C842);background-size:300% 100%;animation:holo 3s linear infinite;z-index:0}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ring{0%{transform:scale(1);opacity:.65}100%{transform:scale(2.4);opacity:0}}
@keyframes slideR{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
@keyframes countIn{from{opacity:0;transform:scale(.6) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes prog-shine{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}
@keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes fall{from{transform:translateY(-16px) rotate(0);opacity:1}to{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes glow-pulse{0%,100%{opacity:.5}50%{opacity:1}}
.au{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) forwards;opacity:0}
.as{animation:scaleIn .5s cubic-bezier(.34,1.56,.64,1) forwards;opacity:0}
.btn{width:100%;padding:16px 28px;border:none;border-radius:16px;font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700;cursor:pointer;position:relative;overflow:hidden;background:linear-gradient(135deg,#F5C842,#E8A820);color:#07090E;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;letter-spacing:.2px}
.btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.28),transparent);pointer-events:none}
.btn:hover:not(:disabled){transform:translateY(-3px) scale(1.015);box-shadow:0 16px 48px rgba(245,200,66,.5),0 4px 16px rgba(0,0,0,.3)}
.btn:active:not(:disabled){transform:scale(.98)}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none}
.btn-gr{background:linear-gradient(135deg,#0CFFAA,#07D088);color:#040C18}
.btn-gr:hover:not(:disabled){box-shadow:0 16px 48px rgba(12,255,170,.42)}
.btn-pu{background:linear-gradient(135deg,#B06FFF,#7B3FCC);color:#fff}
.btn-pu:hover:not(:disabled){box-shadow:0 16px 48px rgba(176,111,255,.42)}
.ghost{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);color:var(--m2);border-radius:12px;padding:9px 16px;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;backdrop-filter:blur(12px)}
.ghost:hover{border-color:rgba(245,200,66,.4);color:var(--gold);background:rgba(245,200,66,.06)}
.pt{height:5px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden;position:relative}
.pf{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold),var(--or));transition:width .1s linear;position:relative;overflow:hidden}
.pf::after{content:'';position:absolute;top:0;bottom:0;width:35%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);animation:prog-shine 1.4s linear infinite}
.tab{padding:8px 16px;border-radius:99px;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;transition:all .25s cubic-bezier(.16,1,.3,1)}
.ton{background:rgba(245,200,66,.11);color:var(--gold);border:1px solid rgba(245,200,66,.28)}
.toff{background:transparent;color:var(--m2);border:1px solid transparent}
.toff:hover{color:var(--text);background:rgba(255,255,255,.04)}
input,select{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:var(--text);font-family:'Space Grotesk',sans-serif;font-size:14px;padding:12px 16px;width:100%;outline:none;transition:border-color .2s}
input:focus,select:focus{border-color:rgba(245,200,66,.4)}
select option{background:#0D1220;color:var(--text)}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:99px}
`;

// ── DATA ─────────────────────────────────────────────────────────────────
const ADS = [
  {id:1,brand:"GTBank Nigeria",line:"Open an account in 5 minutes",c:"#FF6000",bg:"rgba(255,96,0,.07)",e:"🏦",tag:"Banking",views:1420,spent:142000},
  {id:2,brand:"Airtel Nigeria",line:"Unlimited data for all Nigerians",c:"#FF0000",bg:"rgba(255,0,0,.07)",e:"📶",tag:"Telecom",views:2100,spent:210000},
  {id:3,brand:"Dangote Sugar",line:"Made in Nigeria, for Nigeria",c:"#FF3C3C",bg:"rgba(255,60,60,.07)",e:"🏭",tag:"FMCG",views:980,spent:98000},
  {id:4,brand:"Konga.com",line:"Shop smarter, deliver faster",c:"#FF8C00",bg:"rgba(255,140,0,.07)",e:"📦",tag:"E-Commerce",views:1750,spent:175000},
];
const HIST = [
  {d:"Today, 8:42 AM",ad:"GTBank Nigeria",c:"#FF6000",e:"🏦"},
  {d:"Yesterday, 7:15 PM",ad:"Airtel Nigeria",c:"#FF0000",e:"📶"},
  {d:"Mar 5, 6:30 PM",ad:"Konga.com",c:"#FF8C00",e:"📦"},
  {d:"Mar 4, 9:00 AM",ad:"Dangote Sugar",c:"#FF3C3C",e:"🏭"},
  {d:"Mar 3, 5:45 PM",ad:"GTBank Nigeria",c:"#FF6000",e:"🏦"},
];
const POLES = [
  {id:"#007",loc:"Owerri Road Jct",users:340,status:"live",uptime:"99.2%"},
  {id:"#012",loc:"Umuahia Market",users:410,status:"live",uptime:"98.7%"},
  {id:"#003",loc:"Aba Road Bus Stop",users:290,status:"live",uptime:"97.1%"},
  {id:"#019",loc:"Abia State Univ Gate",users:520,status:"live",uptime:"99.8%"},
];
const ANALYTICS = [
  {day:"Mon",users:280,revenue:28000,data:560},
  {day:"Tue",users:310,revenue:31000,data:620},
  {day:"Wed",users:295,revenue:29500,data:590},
  {day:"Thu",users:340,revenue:34000,data:680},
  {day:"Fri",users:410,revenue:41000,data:820},
  {day:"Sat",users:390,revenue:39000,data:780},
  {day:"Sun",users:360,revenue:36000,data:720},
];

// ── SHARED COMPONENTS ────────────────────────────────────────────────────
function Aurora() {
  return (
    <div className="aurora">
      {[
        {w:520,h:520,t:"-8%",l:"-6%",bg:"radial-gradient(circle,rgba(245,200,66,.22) 0%,transparent 65%)",a:"d1 15s ease-in-out infinite"},
        {w:580,h:420,t:"32%",r:"-12%",bg:"radial-gradient(circle,rgba(176,111,255,.18) 0%,transparent 65%)",a:"d2 12s ease-in-out infinite"},
        {w:440,h:440,b:"-8%",l:"22%",bg:"radial-gradient(circle,rgba(12,255,170,.14) 0%,transparent 65%)",a:"d3 14s ease-in-out infinite"},
      ].map((o,i) => (
        <div key={i} className="orb" style={{width:o.w,height:o.h,top:o.t,left:o.l,right:o.r,bottom:o.b,background:o.bg,animation:o.a}}/>
      ))}
    </div>
  );
}
const Grain = () => <div className="grain"/>;
const DotGrid = () => <div className="dotgrid"/>;
function Spin({s=22,c="var(--gold)"}) {
  return <div style={{width:s,height:s,borderRadius:"50%",border:`2.5px solid rgba(255,255,255,.08)`,borderTopColor:c,animation:"spin .75s linear infinite",flexShrink:0}}/>;
}
function GlowDot({c="var(--green)"}) {
  return <span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block",boxShadow:`0 0 10px ${c}`,animation:"glow-pulse 2s ease-in-out infinite"}}/>;
}
function HoloBorder({children,r=22,innerBg="#0C1220"}) {
  return (
    <div style={{position:"relative",borderRadius:r}}>
      <div className="holo-ring" style={{borderRadius:r+2}}/>
      <div style={{position:"relative",zIndex:1,background:innerBg,borderRadius:r-1}}>
        {children}
      </div>
    </div>
  );
}
function Confetti() {
  const ps = useRef([...Array(36)].map((_,i) => ({
    x:Math.random()*100,dur:1.6+Math.random()*2.2,del:Math.random()*.9,
    c:["#F5C842","#FF6535","#FF5090","#B06FFF","#4DAAFF","#0CFFAA"][i%6],
    sz:3+Math.random()*7,sh:Math.random()>.5?"50%":"4px"
  })));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:100,overflow:"hidden"}}>
      {ps.current.map((p,i) => (
        <div key={i} style={{position:"absolute",top:-20,left:`${p.x}%`,width:p.sz,height:p.sz,background:p.c,borderRadius:p.sh,animation:`fall ${p.dur}s ${p.del}s ease-in forwards`}}/>
      ))}
    </div>
  );
}
const CustomTooltip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:"#0D1220",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"10px 14px"}}>
      <p style={{fontSize:11,color:"#68768F",marginBottom:5}}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{fontSize:12,color:p.color,fontWeight:600}}>{p.name}: {p.name==="Revenue"?"₦"+p.value.toLocaleString():p.value}</p>
      ))}
    </div>
  );
};

// ── MODE SELECTOR ────────────────────────────────────────────────────────
function ModeSelector({onSelect}) {
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",zIndex:2}}>
      <style>{G}</style>
      <Aurora/><Grain/><DotGrid/>
      <div className="as" style={{textAlign:"center",marginBottom:52}}>
        <div style={{position:"relative",width:90,height:90,margin:"0 auto 22px"}}>
          <div style={{position:"absolute",inset:-16,borderRadius:"50%",border:"1px solid rgba(245,200,66,.22)",animation:"ring 2.8s ease-out infinite"}}/>
          <div style={{position:"absolute",inset:-8,borderRadius:"50%",border:"1px solid rgba(245,200,66,.12)",animation:"ring 2.8s .8s ease-out infinite"}}/>
          <div style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#F5C842,#FF6535)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,boxShadow:"0 0 80px rgba(245,200,66,.5),inset 0 2px 6px rgba(255,255,255,.35)",animation:"float 3.8s ease-in-out infinite"}}>💡</div>
          <div style={{position:"absolute",bottom:-5,right:-5,width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#0CFFAA,#07D088)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:"0 0 14px rgba(12,255,170,.75)",border:"3px solid var(--dark)"}}>📶</div>
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:42,letterSpacing:"-1.5px",lineHeight:1}}><span className="holo">StreetKash</span></h1>
        <p style={{fontSize:11,color:"var(--m2)",marginTop:8,letterSpacing:"3px",textTransform:"uppercase"}}>Choose your experience</p>
      </div>
      <div style={{width:"100%",maxWidth:400,display:"flex",flexDirection:"column",gap:14}}>
        {[
          {mode:"user",icon:"👤",title:"I'm a User",desc:"Connect to free WiFi, watch ads, earn ₦20 cash + 100MB to SIM daily",c:"var(--gold)",bg:"rgba(245,200,66,.08)",border:"rgba(245,200,66,.2)"},
          {mode:"brand",icon:"🏢",title:"I'm a Brand",desc:"Run hyperlocal ads on StreetKash poles. Pay per 100% view.",c:"var(--pu)",bg:"rgba(176,111,255,.08)",border:"rgba(176,111,255,.2)"},
          {mode:"admin",icon:"⚙️",title:"Operator Dashboard",desc:"Monitor all poles, revenue, uptime and network health",c:"var(--green)",bg:"rgba(12,255,170,.08)",border:"rgba(12,255,170,.2)"},
        ].map(({mode,icon,title,desc,c,bg,border}) => (
          <div key={mode} className="glass" style={{padding:"26px",cursor:"pointer",transition:"transform .2s,border-color .2s"}}
            onClick={() => onSelect(mode)}
            onMouseEnter={e => {e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=border;}}
            onMouseLeave={e => {e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(255,255,255,.08)";}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:54,height:54,borderRadius:16,background:bg,border:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{icon}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,marginBottom:5}}>{title}</div>
                <div style={{fontSize:12,color:"var(--m2)",lineHeight:1.6}}>{desc}</div>
              </div>
              <span style={{fontSize:20,color:c}}>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CONNECT SCREEN ───────────────────────────────────────────────────────
function ConnectScreen({onConnect,onBack}) {
  const [ph,setPh] = useState("idle");
  const [phone,setPhone] = useState("");
  useEffect(() => {
    if (ph==="conn") {const t=setTimeout(() => onConnect(),2900);return () => clearTimeout(t);}
  },[ph]);
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",zIndex:2}}>
      <Aurora/><Grain/><DotGrid/>
      <div style={{position:"absolute",top:20,left:20}}><button className="ghost" onClick={onBack}>← Back</button></div>
      <div className="as" style={{marginBottom:36,textAlign:"center"}}>
        <div style={{position:"relative",width:84,height:84,margin:"0 auto 18px"}}>
          <div style={{position:"absolute",inset:-14,borderRadius:"50%",border:"1px solid rgba(245,200,66,.22)",animation:"ring 2.8s ease-out infinite"}}/>
          <div style={{width:84,height:84,borderRadius:"50%",background:"linear-gradient(135deg,#F5C842,#FF6535)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,boxShadow:"0 0 60px rgba(245,200,66,.5)",animation:"float 3.8s ease-in-out infinite"}}>💡</div>
          <div style={{position:"absolute",bottom:-4,right:-4,width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#0CFFAA,#07D088)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:"0 0 14px rgba(12,255,170,.75)",border:"3px solid var(--dark)"}}>📶</div>
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:34,letterSpacing:"-1px"}}><span className="holo">StreetKash</span></h1>
        <p style={{fontSize:10,color:"var(--m2)",marginTop:6,letterSpacing:"3px",textTransform:"uppercase"}}>Free WiFi · Solar Powered</p>
      </div>
      <div className="glass au" style={{width:"100%",maxWidth:380,padding:"24px",marginBottom:16,animationDelay:".15s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:46,height:46,borderRadius:13,background:"rgba(12,255,170,.06)",border:"1px solid rgba(12,255,170,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📡</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,marginBottom:3}}>StreetKash-Free</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><GlowDot c="var(--green)"/><span style={{fontSize:11,color:"var(--green)",fontWeight:500}}>Live · Umuahia Pole #007</span></div>
          </div>
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontSize:11,color:"var(--m2)",display:"block",marginBottom:8,letterSpacing:1}}>YOUR PHONE NUMBER</label>
          <input placeholder="080XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} maxLength={11}/>
          <p style={{fontSize:10,color:"var(--m2)",marginTop:6}}>Used to send your daily ₦20 reward</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
          {[["₦20","Cash Reward","var(--gold)"],["100MB","To Your SIM","var(--green)"]].map(([v,l,c]) => (
            <div key={l} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"11px 6px",textAlign:"center"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,color:c}}>{v}</div>
              <div style={{fontSize:10,color:"var(--m2)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        {ph==="idle" && <button className="btn" onClick={() => setPh("conn")} disabled={phone.length<10}>Connect & Earn →</button>}
        {ph==="conn" && (
          <div style={{background:"rgba(245,200,66,.05)",border:"1px solid rgba(245,200,66,.14)",borderRadius:14,padding:"16px",textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:6}}><Spin/><span style={{fontWeight:600,fontSize:14}}>Connecting to pole...</span></div>
            <div style={{fontSize:11,color:"var(--m2)"}}>Verifying your device identity</div>
          </div>
        )}
      </div>
      <p className="au" style={{animationDelay:".3s",fontSize:11,color:"var(--m)",textAlign:"center",maxWidth:300,lineHeight:1.85}}>Watch one 10-second ad to claim your daily reward. Free. Every day.</p>
    </div>
  );
}

// ── AD SCREEN ────────────────────────────────────────────────────────────
function AdScreen({onComplete}) {
  const [prog,setProg] = useState(0);
  const [started,setStarted] = useState(false);
  const [done,setDone] = useState(false);
  const [ad] = useState(() => ADS[Math.floor(Math.random()*ADS.length)]);
  const iv = useRef(null);
  const start = () => {
    setStarted(true);
    iv.current = setInterval(() => setProg(p => {
      if (p>=100){clearInterval(iv.current);setDone(true);return 100;}
      return p+1;
    }),100);
  };
  useEffect(() => () => clearInterval(iv.current),[]);
  const sec = Math.ceil((100-prog)/10);
  return (
    <div style={{position:"relative",display:"flex",flexDirection:"column",minHeight:"100vh",padding:"24px",zIndex:2}}>
      <Aurora/><Grain/><DotGrid/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20}}><span className="holo">StreetKash</span></span>
        <span style={{fontSize:12,fontWeight:600,borderRadius:99,padding:"6px 16px",background:done?"rgba(12,255,170,.1)":"rgba(255,255,255,.05)",border:`1px solid ${done?"rgba(12,255,170,.28)":"rgba(255,255,255,.09)"}`,color:done?"var(--green)":"var(--m2)",transition:"all .4s"}}>{started?done?"✓ Complete":`${sec}s left`:"Sponsored"}</span>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",maxWidth:400,margin:"0 auto",width:"100%"}}>
        <p style={{fontSize:10,color:"var(--m2)",letterSpacing:"2.5px",textTransform:"uppercase",marginBottom:16,textAlign:"center"}}>Sponsored Content</p>
        <div className="au glass" style={{background:ad.bg,border:`1px solid ${ad.c}30`,borderRadius:26,padding:"40px 28px",textAlign:"center",marginBottom:16,boxShadow:`0 0 80px ${ad.c}18`}}>
          <div style={{fontSize:72,marginBottom:20,display:"inline-block",animation:started&&!done?`pop 1.4s ease-in-out infinite`:"float 3.5s ease-in-out infinite",filter:`drop-shadow(0 0 22px ${ad.c}60)`}}>{ad.e}</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:900,color:ad.c,marginBottom:10}}>{ad.brand}</h2>
          <p style={{fontSize:14,color:"rgba(255,255,255,.55)",lineHeight:1.65,marginBottom:20}}>{ad.line}</p>
          <span style={{display:"inline-block",background:`${ad.c}15`,color:ad.c,borderRadius:99,padding:"5px 18px",fontSize:11,fontWeight:700,letterSpacing:1,border:`1px solid ${ad.c}30`}}>{ad.tag}</span>
        </div>
        {started && (
          <div className="glass" style={{padding:"14px 18px",marginBottom:14}}>
            <div className="pt"><div className="pf" style={{width:`${prog}%`}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:7,fontSize:11,color:"var(--m2)"}}>
              <span style={{color:done?"var(--green)":"var(--m2)"}}>{done?"Complete ✓":"Watching..."}</span><span>{prog}%</span>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:22}}>
          {[["₦20","Cash","var(--gold)"],["100MB","To SIM","var(--green)"]].map(([v,l,c]) => (
            <div key={l} style={{flex:1,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:"10px 6px",textAlign:"center"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:c}}>{v}</div>
              <div style={{fontSize:10,color:"var(--m2)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        {!started && <button className="btn" onClick={start}>▶ Watch Ad (10 sec)</button>}
        {started && !done && <button className="btn" disabled>Watching... {sec}s remaining</button>}
        {done && <button className="btn btn-gr" onClick={onComplete} style={{animation:"scaleIn .45s cubic-bezier(.34,1.56,.64,1)"}}>🎉 Claim Your Reward →</button>}
      </div>
    </div>
  );
}

// ── REWARD SCREEN ────────────────────────────────────────────────────────
function RewardScreen({onContinue}) {
  const [vis,setVis] = useState(false);
  useEffect(() => {const t=setTimeout(() => setVis(true),80);return () => clearTimeout(t);},[]);
  return (
    <div style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"32px 20px",textAlign:"center",zIndex:2}}>
      <Aurora/><Grain/><DotGrid/>
      {vis && <Confetti/>}
      {vis && <>
        <div className="as" style={{fontSize:78,marginBottom:16,filter:"drop-shadow(0 0 30px rgba(245,200,66,.5))"}}>🏆</div>
        <h2 className="au" style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:900,animationDelay:".08s"}}><span className="holo">Reward Claimed!</span></h2>
        <p className="au" style={{color:"var(--m2)",fontSize:13,margin:"10px 0 32px",animationDelay:".18s"}}>Instantly credited to your wallet.</p>
        <div className="au" style={{width:"100%",maxWidth:368,marginBottom:24,animationDelay:".26s"}}>
          <HoloBorder r={22} innerBg="#0C1220">
            <div style={{padding:"24px 20px"}}>
              {[{ic:"💰",l:"Cash Credited",v:"₦20.00",c:"var(--gold)"},{ic:"📲",l:"Data Sent to SIM",v:"100MB",c:"var(--green)"}].map((r,i) => (
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:i<2?"1px solid rgba(255,255,255,.06)":"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:22,filter:`drop-shadow(0 0 10px ${r.c}50)`}}>{r.ic}</span><span style={{fontSize:13,color:"var(--m2)"}}>{r.l}</span></div>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:19,color:r.c,animation:`countIn .55s ${i*.12}s ease both`}}>{r.v}</span>
                </div>
              ))}
              <div style={{marginTop:16,background:"rgba(245,200,66,.07)",border:"1px solid rgba(245,200,66,.17)",borderRadius:12,padding:"12px 14px",display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:"var(--m2)"}}>Today's Reward</span>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:"var(--green)"}}>₦20 + 100MB</span>
              </div>
            </div>
          </HoloBorder>
        </div>
        <div className="au" style={{width:"100%",maxWidth:368,animationDelay:".4s"}}>
          <p style={{fontSize:12,color:"var(--m2)",marginBottom:16,lineHeight:1.9}}>Same pole. Same reward. Tomorrow, again.</p>
          <button className="btn" onClick={onContinue}>Browse the Web for Free →</button>
        </div>
      </>}
    </div>
  );
}

// ── USER DASHBOARD ───────────────────────────────────────────────────────
function UserDashboard({onReset}) {
  const [tab,setTab] = useState("home");
  const total = HIST.length*20;
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:500,margin:"0 auto",zIndex:2}}>
      <Aurora/><Grain/><DotGrid/>
      <div style={{padding:"18px 18px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10,background:"rgba(6,8,15,.75)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,lineHeight:1}}><span className="holo">StreetKash</span></h1>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><GlowDot c="var(--green)"/><span style={{fontSize:11,color:"var(--green)",fontWeight:500}}>Umuahia Pole #007</span></div>
        </div>
        <button className="ghost" onClick={onReset}>← Exit</button>
      </div>
      <div style={{padding:"12px 16px 10px",display:"flex",gap:6,background:"rgba(6,8,15,.6)",backdropFilter:"blur(12px)"}}>
        {[["home","🏠 Home"],["wallet","💳 Wallet"],["impact","🌿 Impact"]].map(([k,l]) => (<button key={k} className={`tab ${tab===k?"ton":"toff"}`} onClick={() => setTab(k)}>{l}</button>))}
      </div>
      <div style={{flex:1,padding:"14px 14px 100px",overflowY:"auto"}}>
        {tab==="home" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div className="glass" style={{gridColumn:"1/-1",padding:"20px",background:"rgba(12,255,170,.03)",border:"1px solid rgba(12,255,170,.11)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><p style={{fontSize:10,color:"var(--green)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>Today's Reward</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:34,color:"var(--green)",lineHeight:1}}>₦20 + 100MB</div><p style={{fontSize:12,color:"var(--m2)",marginTop:7}}>Claimed 8:42 AM · GTBank ad</p></div>
                  <div style={{fontSize:46,filter:"drop-shadow(0 0 18px rgba(12,255,170,.5))"}}>✅</div>
                </div>
                <div style={{marginTop:16}}><div className="pt"><div className="pf" style={{width:"100%",background:"linear-gradient(90deg,var(--green),#07D080)"}}/></div><p style={{fontSize:10,color:"var(--m2)",marginTop:5}}>Daily goal complete</p></div>
              </div>
              <div className="glass" style={{padding:"16px"}}><p style={{fontSize:10,color:"var(--m2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Total Earned</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:"var(--gold)"}}>₦{total}</div><p style={{fontSize:11,color:"var(--m2)",marginTop:4}}>{HIST.length} sessions</p></div>
              <div className="glass" style={{padding:"16px"}}><p style={{fontSize:10,color:"var(--m2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Data Earned</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:"var(--green)"}}>500MB</div><p style={{fontSize:11,color:"var(--m2)",marginTop:4}}>total to SIM</p></div>
              <div className="glass" style={{gridColumn:"1/-1",padding:"16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:13,fontWeight:600}}>🔥 Daily Streak</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,color:"var(--or)",fontSize:20}}>5 Days</span></div>
                <div style={{display:"flex",gap:5}}>{["M","T","W","T","F","S","S"].map((d,i) => (<div key={i} style={{flex:1,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:i<5?"linear-gradient(135deg,var(--or),#C04000)":"rgba(255,255,255,.04)",color:i<5?"#fff":"var(--m)",boxShadow:i<5?"0 4px 14px rgba(255,101,53,.35)":"none"}}>{d}</div>))}</div>
              </div>
            </div>
            <div className="glass" style={{padding:"16px",textAlign:"center"}}><p style={{fontSize:11,color:"var(--m2)",marginBottom:4}}>Next Reward Available</p><p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18}}>Tomorrow, 6:00 AM</p></div>
          </div>
        )}
        {tab==="wallet" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{marginBottom:18}}><HoloBorder r={22} innerBg="#0C1220"><div style={{padding:"26px 22px",textAlign:"center"}}><p style={{fontSize:11,color:"rgba(245,200,66,.65)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>Wallet Balance</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:46,color:"var(--gold)",lineHeight:1}}>₦{total}.00</div><p style={{fontSize:12,color:"var(--m2)",marginTop:7,marginBottom:20}}>Transferable to any Nigerian bank</p><button className="btn" style={{maxWidth:200,margin:"0 auto"}}>Withdraw to Bank</button></div></HoloBorder></div>
            <p style={{fontSize:10,color:"var(--m2)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10,paddingLeft:2}}>Transaction History</p>
            <div className="glass" style={{padding:"0 16px"}}>
              {HIST.map((h,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:i<HIST.length-1?"1px solid rgba(255,255,255,.05)":"none",animation:`slideR .3s ${i*.08}s ease both`,opacity:0}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:40,height:40,borderRadius:12,background:`${h.c}15`,border:`1px solid ${h.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{h.e}</div><div><p style={{fontSize:13,fontWeight:600}}>{h.ad}</p><p style={{fontSize:11,color:"var(--m2)",marginTop:2}}>{h.d}</p></div></div>
                  <div style={{textAlign:"right"}}><p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:"var(--green)",fontSize:15}}>+₦20</p><p style={{fontSize:10,color:"var(--m2)",marginTop:2}}>+100MB to SIM</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="impact" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <p style={{fontSize:13,color:"var(--m2)",marginBottom:18,lineHeight:1.85}}>Every connection contributes to a cleaner, smarter Abia State.</p>
            {[{ic:"☀️",t:"Solar Energy Saved",v:"12.4 kWh",s:"Your pole's contribution this month",c:"var(--gold)"},{ic:"🌱",t:"Carbon Offset",v:"8.2 kg CO₂",s:"Equivalent to planting 1 tree per pole",c:"var(--green)"},{ic:"👥",t:"People Connected",v:"340+",s:"Users on your pole this week",c:"var(--bl)"},{ic:"💡",t:"Hours Lit",v:"420 hrs",s:"This pole's lighting contribution",c:"var(--or)"}].map(s => (
              <div key={s.t} className="glass" style={{marginBottom:10,padding:"16px",display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:50,height:50,borderRadius:15,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,filter:`drop-shadow(0 0 12px ${s.c}50)`,flexShrink:0}}>{s.ic}</div>
                <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600}}>{s.t}</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:15,color:s.c}}>{s.v}</span></div><p style={{fontSize:11,color:"var(--m2)",marginTop:4}}>{s.s}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── BRAND DASHBOARD ──────────────────────────────────────────────────────
function BrandDashboard({onBack}) {
  const [tab,setTab] = useState("overview");
  const [selAd,setSelAd] = useState(ADS[0]);
  const [budget,setBudget] = useState("50000");
  const [booked,setBooked] = useState(false);
  const totalViews = ADS.reduce((a,b) => a+b.views,0);
  const totalSpent = ADS.reduce((a,b) => a+b.spent,0);
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:500,margin:"0 auto",zIndex:2}}>
      <Aurora/><Grain/><DotGrid/>
      <div style={{padding:"18px 18px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10,background:"rgba(6,8,15,.75)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,lineHeight:1}}><span style={{color:"var(--pu)"}}>Brand</span> <span className="holo">Portal</span></h1>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><GlowDot c="var(--pu)"/><span style={{fontSize:11,color:"var(--pu)",fontWeight:500}}>GTBank Nigeria · Advertiser</span></div>
        </div>
        <button className="ghost" onClick={onBack}>← Exit</button>
      </div>
      <div style={{padding:"12px 16px 10px",display:"flex",gap:6,background:"rgba(6,8,15,.6)",backdropFilter:"blur(12px)"}}>
        {[["overview","📊 Overview"],["book","📋 Book Ad"],["poles","📍 Poles"]].map(([k,l]) => (<button key={k} className={`tab ${tab===k?"ton":"toff"}`} style={tab===k?{background:"rgba(176,111,255,.11)",color:"var(--pu)",border:"1px solid rgba(176,111,255,.28)"}:{}} onClick={() => setTab(k)}>{l}</button>))}
      </div>
      <div style={{flex:1,padding:"14px 14px 100px",overflowY:"auto"}}>
        {tab==="overview" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div className="glass" style={{gridColumn:"1/-1",padding:"20px",background:"rgba(176,111,255,.03)",border:"1px solid rgba(176,111,255,.11)"}}>
                <p style={{fontSize:10,color:"var(--pu)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>This Month's Reach</p>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:38,color:"var(--pu)",lineHeight:1}}>{totalViews.toLocaleString()}</div>
                <p style={{fontSize:12,color:"var(--m2)",marginTop:7}}>Verified ad views · 100% completion rate</p>
                <div style={{marginTop:14}}><div className="pt"><div className="pf" style={{width:"78%",background:"linear-gradient(90deg,var(--pu),#7B3FCC)"}}/></div><p style={{fontSize:10,color:"var(--m2)",marginTop:5}}>78% of monthly target reached</p></div>
              </div>
              <div className="glass" style={{padding:"16px"}}><p style={{fontSize:10,color:"var(--m2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Total Spent</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:"var(--gold)"}}>₦{(totalSpent/1000).toFixed(0)}k</div><p style={{fontSize:11,color:"var(--m2)",marginTop:4}}>this month</p></div>
              <div className="glass" style={{padding:"16px"}}><p style={{fontSize:10,color:"var(--m2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Cost Per View</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:"var(--green)"}}>₦100</div><p style={{fontSize:11,color:"var(--m2)",marginTop:4}}>flat rate · no skip</p></div>
            </div>
            <p style={{fontSize:10,color:"var(--m2)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10,paddingLeft:2}}>Ad Performance</p>
            <div className="glass" style={{padding:"16px"}}>
              {ADS.map((a,i) => (
                <div key={a.id} style={{marginBottom:i<ADS.length-1?18:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20,filter:`drop-shadow(0 0 8px ${a.c}50)`}}>{a.e}</span><span style={{fontSize:13,fontWeight:600}}>{a.brand}</span></div>
                    <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:a.c}}>{a.views.toLocaleString()} views</span>
                  </div>
                  <div className="pt"><div className="pf" style={{width:`${(a.views/2500)*100}%`,background:`linear-gradient(90deg,${a.c},${a.c}88)`}}/></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="book" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            {!booked ? (
              <>
                <p style={{fontSize:13,color:"var(--m2)",marginBottom:18,lineHeight:1.8}}>Book your ad slot. Pay only for <span style={{color:"var(--green)",fontWeight:600}}>100% completed views</span> — no skips, no waste.</p>
                <div className="glass" style={{padding:"20px",marginBottom:14}}>
                  <p style={{fontSize:11,color:"var(--m2)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>Select Your Brand</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {ADS.map(a => (
                      <div key={a.id} onClick={() => setSelAd(a)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:14,cursor:"pointer",background:selAd.id===a.id?`${a.c}12`:"rgba(255,255,255,.03)",border:`1px solid ${selAd.id===a.id?a.c+"50":"rgba(255,255,255,.07)"}`,transition:"all .2s"}}>
                        <span style={{fontSize:22}}>{a.e}</span>
                        <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600}}>{a.brand}</p><p style={{fontSize:11,color:"var(--m2)",marginTop:2}}>{a.tag}</p></div>
                        {selAd.id===a.id && <span style={{color:a.c,fontSize:16}}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass" style={{padding:"20px",marginBottom:14}}>
                  <p style={{fontSize:11,color:"var(--m2)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>Campaign Budget</p>
                  <input placeholder="Enter budget in ₦" value={budget} onChange={e => setBudget(e.target.value.replace(/\D/,""))} style={{marginBottom:12}}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {["20000","50000","100000","250000"].map(v => (<button key={v} onClick={() => setBudget(v)} style={{padding:"10px",background:budget===v?"rgba(245,200,66,.1)":"rgba(255,255,255,.04)",border:`1px solid ${budget===v?"rgba(245,200,66,.3)":"rgba(255,255,255,.07)"}`,borderRadius:11,color:budget===v?"var(--gold)":"var(--m2)",fontFamily:"'Space Grotesk',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>₦{parseInt(v).toLocaleString()}</button>))}
                  </div>
                </div>
                {budget && (
                  <div className="glass" style={{padding:"16px",marginBottom:18,background:"rgba(12,255,170,.03)",border:"1px solid rgba(12,255,170,.1)"}}>
                    <p style={{fontSize:11,color:"var(--m2)",marginBottom:10}}>Campaign Estimate</p>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"var(--m2)"}}>Budget</span><span style={{fontWeight:600}}>₦{parseInt(budget||0).toLocaleString()}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"var(--m2)"}}>Est. Views</span><span style={{fontWeight:600,color:"var(--green)"}}>{Math.floor(parseInt(budget||0)/100).toLocaleString()} views</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"var(--m2)"}}>Est. Duration</span><span style={{fontWeight:600}}>{Math.ceil(Math.floor(parseInt(budget||0)/100)/1560)} days</span></div>
                  </div>
                )}
                <button className="btn btn-pu" onClick={() => setBooked(true)} disabled={!budget||parseInt(budget)<5000}>Book Campaign →</button>
              </>
            ) : (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div className="as" style={{fontSize:72,marginBottom:16,filter:"drop-shadow(0 0 24px rgba(176,111,255,.5))"}}>🎯</div>
                <h2 className="au" style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:900,color:"var(--pu)",marginBottom:10,animationDelay:".1s"}}>Campaign Booked!</h2>
                <p className="au" style={{color:"var(--m2)",fontSize:13,lineHeight:1.8,marginBottom:28,animationDelay:".2s"}}>Your {selAd.brand} ad is now live across all active StreetKash poles.</p>
                <div className="au glass" style={{padding:"18px",marginBottom:20,animationDelay:".3s"}}>
                  {[["Brand",selAd.brand],["Budget",`₦${parseInt(budget).toLocaleString()}`],["Est. Views",`${Math.floor(parseInt(budget)/100).toLocaleString()}`],["Status","🟢 Live"]].map(([l,v]) => (<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}><span style={{fontSize:12,color:"var(--m2)"}}>{l}</span><span style={{fontWeight:600,fontSize:13}}>{v}</span></div>))}
                </div>
                <button className="btn btn-pu au" style={{animationDelay:".4s"}} onClick={() => {setBooked(false);setTab("overview");}}>View Dashboard →</button>
              </div>
            )}
          </div>
        )}
        {tab==="poles" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <p style={{fontSize:13,color:"var(--m2)",marginBottom:16,lineHeight:1.8}}>Your ad is running on <span style={{color:"var(--pu)",fontWeight:600}}>4 active poles</span> across Umuahia & Aba.</p>
            {POLES.map((p,i) => (
              <div key={p.id} className="glass" style={{padding:"18px",marginBottom:10,animation:`slideR .3s ${i*.08}s ease both`,opacity:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:44,height:44,borderRadius:13,background:"rgba(12,255,170,.06)",border:"1px solid rgba(12,255,170,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💡</div>
                    <div><p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15}}>Pole {p.id}</p><p style={{fontSize:12,color:"var(--m2)",marginTop:2}}>{p.loc}</p></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(12,255,170,.08)",border:"1px solid rgba(12,255,170,.2)",borderRadius:99,padding:"4px 12px"}}><GlowDot/><span style={{fontSize:11,color:"var(--green)",fontWeight:600}}>Live</span></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[["👥","Users/Day",p.users],["⚡","Uptime",p.uptime],["📺","Ad Views",Math.floor(p.users*0.9)]].map(([ic,l,v]) => (
                    <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                      <div style={{fontSize:16,marginBottom:4}}>{ic}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>{v}</div>
                      <div style={{fontSize:10,color:"var(--m2)",marginTop:2}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── OPERATOR DASHBOARD ───────────────────────────────────────────────────
function OperatorDashboard({onBack}) {
  const [tab,setTab] = useState("network");
  const totalUsers = POLES.reduce((a,b) => a+b.users,0);
  const totalRevenue = ANALYTICS.reduce((a,b) => a+b.revenue,0);
  return (
    <div style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:500,margin:"0 auto",zIndex:2}}>
      <Aurora/><Grain/><DotGrid/>
      <div style={{padding:"18px 18px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10,background:"rgba(6,8,15,.75)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,lineHeight:1}}><span style={{color:"var(--green)"}}>Operator</span> <span className="holo">Dashboard</span></h1>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><GlowDot c="var(--green)"/><span style={{fontSize:11,color:"var(--green)",fontWeight:500}}>Abia State Network · 4 Poles Live</span></div>
        </div>
        <button className="ghost" onClick={onBack}>← Exit</button>
      </div>
      <div style={{padding:"12px 16px 10px",display:"flex",gap:6,background:"rgba(6,8,15,.6)",backdropFilter:"blur(12px)"}}>
        {[["network","🗺 Network"],["analytics","📈 Analytics"],["revenue","💰 Revenue"]].map(([k,l]) => (<button key={k} className={`tab ${tab===k?"ton":"toff"}`} style={tab===k?{background:"rgba(12,255,170,.11)",color:"var(--green)",border:"1px solid rgba(12,255,170,.28)"}:{}} onClick={() => setTab(k)}>{l}</button>))}
      </div>
      <div style={{flex:1,padding:"14px 14px 100px",overflowY:"auto"}}>
        {tab==="network" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div className="glass" style={{gridColumn:"1/-1",padding:"20px",background:"rgba(12,255,170,.03)",border:"1px solid rgba(12,255,170,.11)"}}>
                <p style={{fontSize:10,color:"var(--green)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>Total Active Users Today</p>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:38,color:"var(--green)",lineHeight:1}}>{totalUsers.toLocaleString()}</div>
                <p style={{fontSize:12,color:"var(--m2)",marginTop:7}}>Across 4 poles · Abia State</p>
              </div>
              <div className="glass" style={{padding:"16px"}}><p style={{fontSize:10,color:"var(--m2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Poles Online</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:"var(--green)"}}>4 / 4</div><p style={{fontSize:11,color:"var(--m2)",marginTop:4}}>100% uptime</p></div>
              <div className="glass" style={{padding:"16px"}}><p style={{fontSize:10,color:"var(--m2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Avg Uptime</p><div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:"var(--gold)"}}>98.7%</div><p style={{fontSize:11,color:"var(--m2)",marginTop:4}}>this month</p></div>
            </div>
            <p style={{fontSize:10,color:"var(--m2)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10,paddingLeft:2}}>Pole Status</p>
            {POLES.map((p,i) => (
              <div key={p.id} className="glass" style={{padding:"16px",marginBottom:10,animation:`slideR .3s ${i*.08}s ease both`,opacity:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:40,height:40,borderRadius:12,background:"rgba(12,255,170,.06)",border:"1px solid rgba(12,255,170,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💡</div>
                    <div><p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14}}>Pole {p.id}</p><p style={{fontSize:11,color:"var(--m2)"}}>{p.loc}</p></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(12,255,170,.08)",border:"1px solid rgba(12,255,170,.2)",borderRadius:99,padding:"4px 10px"}}><GlowDot/><span style={{fontSize:10,color:"var(--green)",fontWeight:600}}>Live</span></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                  {[["👥",p.users,"Users"],["⚡",p.uptime,"Uptime"],["📺",Math.floor(p.users*0.9),"Ad Views"]].map(([ic,v,l]) => (
                    <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:9,padding:"8px",textAlign:"center"}}>
                      <div style={{fontSize:14}}>{ic}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,marginTop:3}}>{v}</div>
                      <div style={{fontSize:10,color:"var(--m2)"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="analytics" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <p style={{fontSize:13,color:"var(--m2)",marginBottom:16,lineHeight:1.8}}>Weekly performance across all Abia State poles.</p>
            <div className="glass" style={{padding:"16px",marginBottom:14}}>
              <p style={{fontSize:11,color:"var(--m2)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:14}}>Daily Users (This Week)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={ANALYTICS} margin={{top:0,right:0,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                  <XAxis dataKey="day" tick={{fill:"#68768F",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#68768F",fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="users" name="Users" fill="#0CFFAA" radius={[6,6,0,0]} fillOpacity={0.85}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass" style={{padding:"16px"}}>
              <p style={{fontSize:11,color:"var(--m2)",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:14}}>Revenue Trend (₦)</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={ANALYTICS} margin={{top:0,right:0,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                  <XAxis dataKey="day" tick={{fill:"#68768F",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#68768F",fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#F5C842" strokeWidth={2.5} dot={{fill:"#F5C842",r:3}} activeDot={{r:5}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {tab==="revenue" && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{marginBottom:18}}>
              <HoloBorder r={22} innerBg="#0C1220">
                <div style={{padding:"26px 22px",textAlign:"center"}}>
                  <p style={{fontSize:11,color:"rgba(245,200,66,.65)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>Total Revenue This Week</p>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:42,color:"var(--gold)",lineHeight:1}}>₦{totalRevenue.toLocaleString()}</div>
                  <p style={{fontSize:12,color:"var(--m2)",marginTop:8}}>From {ANALYTICS.reduce((a,b)=>a+b.users,0).toLocaleString()} verified ad views</p>
                </div>
              </HoloBorder>
            </div>
            {[{l:"Ad Revenue",v:`₦${totalRevenue.toLocaleString()}`,c:"var(--gold)",ic:"📺"},{l:"Brand Partnerships",v:"₦85,000",c:"var(--pu)",ic:"🤝"},{l:"Data Sales (ISP)",v:"₦42,500",c:"var(--bl)",ic:"📡"},{l:"Solar Surplus",v:"₦12,000",c:"var(--green)",ic:"☀️"}].map(r => (
              <div key={r.l} className="glass" style={{padding:"16px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{r.ic}</div>
                  <span style={{fontSize:13,fontWeight:600}}>{r.l}</span>
                </div>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,color:r.c}}>{r.v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [mode,setMode] = useState(null);
  const [userScreen,setUserScreen] = useState("connect");

  if (!mode) return <ModeSelector onSelect={setMode}/>;
  if (mode==="brand") return <><style>{G}</style><BrandDashboard onBack={() => setMode(null)}/></>;
  if (mode==="admin") return <><style>{G}</style><OperatorDashboard onBack={() => setMode(null)}/></>;
  return (
    <div style={{background:"var(--dark)",minHeight:"100vh"}}>
      <style>{G}</style>
      {userScreen==="connect" && <ConnectScreen onConnect={() => setUserScreen("ad")} onBack={() => setMode(null)}/>}
      {userScreen==="ad" && <AdScreen onComplete={() => setUserScreen("reward")}/>}
      {userScreen==="reward" && <RewardScreen onContinue={() => setUserScreen("dashboard")}/>}
      {userScreen==="dashboard" && <UserDashboard onReset={() => setMode(null)}/>}
    </div>
  );
}
