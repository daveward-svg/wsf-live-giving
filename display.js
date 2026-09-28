import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { firebaseConfig, campaignPath } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const campaignRef = ref(db, campaignPath);
const els = {
  campaignName: document.getElementById("campaignName"), campaignSubtitle: document.getElementById("campaignSubtitle"),
  amountRaised: document.getElementById("amountRaised"), goalAmount: document.getElementById("goalAmount"),
  percentage: document.getElementById("percentage"), remaining: document.getElementById("remaining"),
  progressTrack: document.getElementById("progressTrack"), progressFill: document.getElementById("progressFill"),
  futureLot: document.getElementById("futureLot"), message: document.getElementById("message"), status: document.getElementById("status"),
  updated: document.getElementById("updated"), giveButton: document.getElementById("giveButton"),
  celebration: document.getElementById("goalCelebration"), canvas: document.getElementById("confetti")
};
const money = new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
let animatedAmount=0, celebrated=false;
const defaults={raised:0,goal:300000,name:"MAKE ROOM",subtitle:"Creating Space. Reaching People. Building the Future.",givingUrl:"https://app.easytithe.com/App/Giving/wsf"};

onValue(campaignRef,(snapshot)=>{
  const data=snapshot.val()||defaults; render(data);
  els.status.textContent=snapshot.exists()?"Live from Firebase":"Ready for first Make Room update";
  els.updated.textContent=snapshot.exists()?`Updated ${new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`:"Open /admin.html and save the campaign.";
},(error)=>{console.error(error);els.status.textContent="Firebase connection error";els.updated.textContent=error.message;});

function render(data){
  const raised=Math.max(0,Number(data.raised)||0), goal=Math.max(1,Number(data.goal)||300000);
  const percent=Math.min(100,(raised/goal)*100), remaining=Math.max(0,goal-raised);
  els.campaignName.innerHTML=formatCampaignName(data.name||defaults.name);
  els.campaignSubtitle.textContent=data.subtitle||defaults.subtitle;
  els.goalAmount.textContent=money.format(goal); els.percentage.textContent=`${percent.toFixed(percent<10?1:0)}%`;
  els.remaining.textContent=money.format(remaining); els.progressFill.style.width=`${percent}%`;
  els.progressTrack.setAttribute("aria-valuenow",String(Math.round(percent)));
  els.futureLot.style.opacity=String(.12+percent*.0065); els.message.textContent=impactMessage(percent);
  els.giveButton.href=data.givingUrl||defaults.givingUrl; animateAmount(raised);
  if(percent>=100&&!celebrated){celebrated=true;els.celebration.classList.add("visible");launchConfetti();}
  else if(percent<100){celebrated=false;els.celebration.classList.remove("visible");}
}
function formatCampaignName(name){const safe=String(name).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const parts=safe.trim().split(/\s+/);return parts.length>1?`${parts.slice(0,-1).join(" ")} <em>${parts.at(-1)}</em>`:safe;}
function impactMessage(p){if(p>=100)return"Goal reached! Thank you for making room for more people.";if(p>=75)return"The finish line is in sight. We're making room together.";if(p>=50)return"Halfway there—thank you for investing in the future.";if(p>=25)return"First milestone reached. More room means more opportunity to welcome people.";return"Together, we're making room for more people to encounter Jesus.";}
function animateAmount(target){const start=animatedAmount,delta=target-start,began=performance.now(),duration=1200;function frame(now){const t=Math.min(1,(now-began)/duration),e=1-Math.pow(1-t,4);animatedAmount=start+delta*e;els.amountRaised.textContent=money.format(animatedAmount);if(t<1)requestAnimationFrame(frame);else{animatedAmount=target;els.amountRaised.textContent=money.format(target)}}requestAnimationFrame(frame)}
function launchConfetti(){const c=els.canvas,ctx=c.getContext("2d"),dpr=Math.max(1,devicePixelRatio||1);c.width=innerWidth*dpr;c.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const pieces=Array.from({length:200},()=>({x:Math.random()*innerWidth,y:-30-Math.random()*innerHeight*.5,w:5+Math.random()*8,h:8+Math.random()*12,vx:-2+Math.random()*4,vy:3+Math.random()*5,r:Math.random()*Math.PI,rv:-.12+Math.random()*.24,hue:[42,45,48,210][Math.floor(Math.random()*4)]}));const began=performance.now();function draw(now){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of pieces){p.x+=p.vx;p.y+=p.vy;p.r+=p.rv;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=`hsl(${p.hue} 85% 58%)`;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()}if(now-began<8000)requestAnimationFrame(draw);else ctx.clearRect(0,0,innerWidth,innerHeight)}requestAnimationFrame(draw)}
