import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import {
  Activity, ArrowDownToLine, ArrowLeft, ArrowRight, Award, BookOpen, Boxes, BrainCircuit,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Cloud, Compass,
  Container, Copy, ExternalLink, FileClock, Flag, Flame, GitBranch, GitPullRequest,
  GraduationCap, Layers3, Lightbulb, LockKeyhole, Menu, Network,
  RotateCcw, Search, Server, ShieldCheck, Sparkles, Target, Terminal, Trophy,
  Upload, X, Zap, Gift, Coins, CalendarDays, Crown, Star, type LucideIcon,
} from 'lucide-react';
import type { Lesson, Progress, QuizQuestion, Screen, World } from './data/types';
import { curriculum, lessons, worlds, achievementStats, buildExam, completionRate, dueCards,
  emptyProgress, labAccepts, missionUnlocked, nextLesson, playerLevel, PROGRESS_KEY,
  questionsFor, readProgress, sanitizeProgress, totalXP, updateReview } from './lib/game';
import { COSMETICS, buyCosmetic, claimQuest, chosenCosmetic, equipCosmetic, questStatus,
  recordActivity, recordArena, recordCardReview, recordMission, streakDays, todayKey } from './lib/gamification';

const worldIconMap: Record<string,LucideIcon> = {git:GitBranch,github:GitPullRequest,docker:Container,
  engineering:Boxes,kubernetes:Network,cloud:Cloud,platform:Server,security:ShieldCheck};
const badgeIconMap: Record<string,LucideIcon> = { first:Sparkles,git:GitBranch,docker:Container,
  half:Trophy,scholar:Layers3,exam:GraduationCap,boss:ShieldCheck,master:Award };
const progressPct = (done:number,total:number)=>total?Math.round(done*100/total):0;

function App() {
  const [progress,setProgress]=useState<Progress>(readProgress);
  const [screen,setScreen]=useState<Screen>('dashboard');
  const [activeWorld,setActiveWorld]=useState('git');
  const [activeLesson,setActiveLesson]=useState(lessons[0].id);
  const [menuOpen,setMenuOpen]=useState(false);
  const [notice,setNotice]=useState('');
  const [victory,setVictory]=useState<Lesson|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));}catch{/* private mode or full quota */}},[progress]);
  useEffect(()=>{ if(!notice) return; const timer=setTimeout(()=>setNotice(''),3500); return ()=>clearTimeout(timer); },[notice]);
  useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[screen,activeLesson,activeWorld]);
  const currentLesson = lessons.find(l=>l.id===activeLesson)??lessons[0];
  const currentWorld = worlds.find(w=>w.id===activeWorld)??worlds[0];
  const next=nextLesson(progress);
  const xp=totalXP(progress);
  const playerCosmetic=chosenCosmetic(progress);
  const streak=streakDays(progress);
  const setView=(s:Screen)=>{setScreen(s);setMenuOpen(false);};
  const openWorld=(world:World)=>{setActiveWorld(world.id);setView('world');};
  const openLesson=(lesson:Lesson)=>{
    if(!missionUnlocked(lesson,progress)){setNotice('Finish the previous mission to unlock this one.');return;}
    setActiveLesson(lesson.id);setActiveWorld(lesson.world);
    setProgress(p=>({...p,lastLesson:lesson.id}));setView('lesson');
  };
  const updateSet=(field:'labs'|'passedQuizzes',id:string)=>{
    setProgress(p=>recordActivity({...p,[field]:p[field].includes(id)?p[field]:[...p[field],id]}));
  };
  const toggleBookmark=(id:string)=>setProgress(p=>({...p,bookmarks:p.bookmarks.includes(id)?p.bookmarks.filter(x=>x!==id):[...p.bookmarks,id]}));
  const advanceFrom=(lesson:Lesson)=>{
    const upcoming=lessons[lesson.order];
    if(upcoming){setActiveLesson(upcoming.id);setActiveWorld(upcoming.world);setView('lesson');}
    else setView('achievements');
  };
  const completeLesson=()=>{
    if(!progress.labs.includes(currentLesson.id)||!progress.passedQuizzes.includes(currentLesson.id)) return;
    if(!progress.completed.includes(currentLesson.id)){
      setProgress(p=>recordMission(p,currentLesson.id,currentLesson.isBoss));
      setVictory(currentLesson);
      setNotice(`Mission cleared! +${currentLesson.xp} XP · +${currentLesson.isBoss?45:15} credits`);
      return;
    }
    advanceFrom(currentLesson);
  };
  const claimReward=(id:string)=>{
    const available=questStatus(progress).find(q=>q.id===id);
    if(!available?.ready||available.claimed) return;
    setProgress(p=>claimQuest(p,id));
    setNotice(`Quest claimed! +${available.xp} XP · +${available.coins} credits`);
  };
  const purchase=(id:string)=>{
    const item=COSMETICS.find(c=>c.id===id);
    if(!item||progress.unlockedCosmetics.includes(id)||progress.coins<item.price) return;
    setProgress(p=>buyCosmetic(p,id));
    setNotice(`${item.name} unlocked! Equip it in your reward vault.`);
  };
  const equip=(id:string)=>{
    if(!progress.unlockedCosmetics.includes(id))return;
    setProgress(p=>equipCosmetic(p,id));
    setNotice('Your new explorer look is equipped.');
  };
  const saveProgress=()=>{
    const b=new Blob([JSON.stringify({app:'Ops Atlas',...progress,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='stackbound-progress.json';a.click();URL.revokeObjectURL(url);
    setNotice('Progress file exported to your downloads.');
  };
  const importProgress=async(e:ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];if(!file)return;
    try{
      if(file.size>1024*1024) throw new Error('Progress file exceeds 1 MB.');
      const data=JSON.parse(await file.text());
      if(data?.version!==1) throw new Error('This is not a version 1 Ops Atlas save.');
      setProgress(sanitizeProgress(data));setNotice('Progress loaded. Your campaign is restored.');
    }catch(err){setNotice(err instanceof Error?err.message:'Could not read progress file.');}
    e.target.value='';
  };
  const navItems:{id:Screen,label:string,icon:LucideIcon}[]=[
    {id:'dashboard',label:'Dashboard',icon:Compass},{id:'world',label:'Campaign map',icon:Flag},
    {id:'flashcards',label:'Flashcard lab',icon:BrainCircuit},{id:'arena',label:'Quiz arena',icon:Target},
    {id:'quests',label:'Daily quests',icon:CalendarDays},{id:'vault',label:'Reward vault',icon:Gift},
    {id:'achievements',label:'Achievements',icon:Trophy},{id:'resources',label:'Field manual',icon:BookOpen}];
  return <div className="app-shell">
    {menuOpen&&<button className="sidebar-scrim" aria-label="Close navigation" onClick={()=>setMenuOpen(false)}/>}
    <aside className={`sidebar ${menuOpen?'mobile-open':''}`}>
      <button className="brand" onClick={()=>setView('dashboard')} aria-label="Ops Atlas home">
        <span className="brand-emblem" aria-hidden="true"><span className="brand-glyph">S/B</span></span>
        <span><b>STACK<span>BOUND</span></b><small>FIELD MANUAL / VOL. 01</small></span>
      </button>
      <div className="sidebar-heading">01 / THE WORKBENCH</div>
      <nav aria-label="Main navigation" className="nav-list">
        {navItems.map(item=>{const Icon=item.icon;return <button key={item.id} className={`nav-item ${screen===item.id?'active':''}`} onClick={()=>{if(item.id==='world')setActiveWorld(next.world);setView(item.id);}}>
          <Icon size={18}/><span>{item.label}</span>{item.id==='flashcards'&&<span className="nav-count">{dueCards(progress).length}</span>}
        </button>;})}
      </nav>
      <div className="sidebar-heading worlds-heading">02 / THE EXPEDITIONS</div>
      <div className="world-nav">{worlds.map((w)=>{const Icon=worldIconMap[w.id];const complete=lessons.filter(l=>l.world===w.id&&progress.completed.includes(l.id)).length;
        return <button key={w.id} className={`world-nav-item ${activeWorld===w.id&&screen==='world'?'selected':''}`} onClick={()=>openWorld(w)}>
          <span className="world-dot" style={{'--accent':w.accent} as CSSProperties}><Icon size={15}/></span>
          <span>{w.title}</span><span className="world-ratio">{complete}/5</span>
        </button>})}</div>
      <div className="sidebar-bottom">
        <div className="pilot-card"><span className="pilot-avatar pilot-symbol">{playerCosmetic.symbol}</span><div className="pilot-copy"><strong>{playerCosmetic.title}</strong><small>LEVEL {playerLevel(progress)} · {xp.toLocaleString()} XP</small></div><Sparkles size={17} className="muted"/></div>
        <div className="pilot-track"><span style={{width:`${(xp%400)/4}%`}} /></div>
        <div className="sidebar-foot">Built for curious builders. <span className="online-dot"/> Offline-friendly progress</div>
      </div>
    </aside>
    <div className="content-shell">
      <header className="topbar"><div className="topbar-left"><button className="menu-toggle icon-button" aria-label="Open navigation" onClick={()=>setMenuOpen(true)}><Menu size={22}/></button><span className="breadcrumb">OPS ATLAS / FIELD OFFICE</span><ChevronRight size={14} className="muted"/><span className="breadcrumb-current">{screen==='lesson'?currentLesson.title:screen==='world'?currentWorld.title:navItems.find(n=>n.id===screen)?.label}</span></div>
        <div className="topbar-right"><button className="top-pill stat-pill" onClick={()=>setView('quests')} title="View daily quests"><Flame size={16} className="orange"/> {streak} day streak</button><button className="top-pill stat-pill" onClick={()=>setView('vault')} title="Visit reward vault"><Coins size={16} className="gold"/> {progress.coins} credits</button><div className="top-pill top-xp"><Zap size={16} className="gold" fill="currentColor"/>{xp.toLocaleString()} XP</div><button className="avatar-button" title="See achievements" onClick={()=>setView('achievements')}>{playerCosmetic.symbol}</button></div>
      </header>
      <main className="main-view">
        {screen==='dashboard'&&<Dashboard p={progress} next={next} onLesson={openLesson} onWorld={openWorld} onView={setView}/>}
        {screen==='world'&&<WorldView world={currentWorld} p={progress} onLesson={openLesson} onWorld={openWorld}/>}
        {screen==='lesson'&&<LessonView key={currentLesson.id} lesson={currentLesson} p={progress} onBack={()=>openWorld(currentWorld)} onLab={()=>updateSet('labs',currentLesson.id)} onQuiz={()=>updateSet('passedQuizzes',currentLesson.id)} onComplete={completeLesson} onBookmark={()=>toggleBookmark(currentLesson.id)}/>}
        {screen==='flashcards'&&<FlashcardLab progress={progress} onReview={(id,remembered)=>setProgress(p=>recordCardReview({...p,review:{...p.review,[id]:updateReview(p.review[id],remembered)}},id))}/>}
        {screen==='arena'&&<QuizArena progress={progress} onResult={(pct)=>setProgress(p=>recordArena(p,pct))}/>}
        {screen==='quests'&&<QuestBoard p={progress} onClaim={claimReward} onView={setView}/>}
        {screen==='vault'&&<RewardVault p={progress} onBuy={purchase} onEquip={equip}/>}
        {screen==='achievements'&&<AchievementsView p={progress} onView={setView}/>}
        {screen==='resources'&&<ResourcesView p={progress} onExport={saveProgress} onImport={()=>fileRef.current?.click()} onReset={()=>{if(window.confirm('Reset all local Ops Atlas progress? Export a backup first.')){setProgress(emptyProgress());setNotice('Campaign progress reset.');}}}/>}
      </main>
      <footer className="site-footer"><span>© 2026 Ops Atlas · Original, open-source curriculum</span><span>Learn safely. Build confidently. Ship responsibly.</span></footer>
    </div>
    <input aria-label="Import progress JSON" ref={fileRef} className="hidden-file" type="file" accept="application/json,.json" onChange={importProgress}/>

    {victory&&<VictoryOverlay key={victory.id} lesson={victory} onContinue={()=>{const cleared=victory;setVictory(null);advanceFrom(cleared);}} onMap={()=>{const cleared=victory;setVictory(null);openWorld(worlds.find(w=>w.id===cleared.world)!);}}/>}
    {notice&&<div role="status" className="toast"><CheckCircle2 size={18}/>{notice}<button aria-label="Dismiss message" onClick={()=>setNotice('')}><X size={16}/></button></div>}
  </div>;
}

function PageIntro({eyebrow,title,description}: {eyebrow:string,title:string,description:string}){
  return <div className="page-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>;
}
function ProgressBar({value,accent}: {value:number,accent?:string}){return <div className="progress-track"><div style={{width:`${value}%`,background:accent||undefined}}/></div>}
function Kpi({icon:Icon,value,label,accent}: {icon:LucideIcon,value:string,label:string,accent?:string}){
  return <div className="kpi"><span className="kpi-icon" style={{color:accent}}><Icon size={19}/></span><div><strong>{value}</strong><span>{label}</span></div></div>;
}
function FieldDiagram({completed}:{completed:number}){
  const dots=[{x:76,y:166,n:'01',label:'GIT'},{x:224,y:105,n:'03',label:'CONTAINERS'},{x:373,y:157,n:'08',label:'THE CLOUD'}];
  return <div className="field-diagram" aria-hidden="true">
    <div className="diagram-caption"><span>ROUTE / 001—040</span><span className="diagram-cross">+ + +</span></div>
    <svg className="diagram-svg" viewBox="0 0 452 296" fill="none">
      <defs><pattern id="field-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" stroke="#182725" strokeOpacity=".17" strokeWidth=".7"/></pattern></defs>
      <rect x="0" y="0" width="452" height="296" fill="url(#field-grid)"/>
      <path d="M42 203 L74 168 L132 177 L223 106 L309 127 L373 158 L417 116" stroke="#142522" strokeWidth="2.4" strokeDasharray="5 9" strokeLinecap="round"/>
      <path d="M44 232 L122 210 M285 201 L418 245 M168 54 L249 27" stroke="#142522" strokeOpacity=".36" strokeWidth="1"/>
      <circle cx="224" cy="105" r="78" stroke="#182725" strokeOpacity=".18" strokeWidth="1"/>
      <circle cx="224" cy="105" r="105" stroke="#182725" strokeOpacity=".12" strokeWidth="1"/>
      {dots.map((d,i)=><g key={d.n}>
        <rect x={d.x-29} y={d.y-29} width="58" height="58" fill={i===1?"#1b2c28":"#dd613f"} stroke="#1b2c28" strokeWidth="1.5" transform={`rotate(45 ${d.x} ${d.y})`}/>
        <circle cx={d.x} cy={d.y} r="13" stroke={i===1?"#efede3":"#1b2c28"} strokeWidth="1.2"/>
        <text x={d.x} y={d.y+4} textAnchor="middle" fill={i===1?"#efede3":"#1b2c28"} fontSize="11" fontWeight="800" fontFamily="monospace">{d.n}</text>
        <text x={d.x} y={d.y+57} textAnchor="middle" fill="#1b2c28" fontSize="10" fontWeight="800" letterSpacing="1.4" fontFamily="monospace">{d.label}</text>
      </g>)}
      <text x="24" y="35" fill="#1b2c28" fontSize="10" fontWeight="700" fontFamily="monospace">START ··········</text>
      <text x="310" y="45" fill="#1b2c28" fontSize="10" fontWeight="700" fontFamily="monospace">YOU ARE HERE ↗</text>
      <text x="24" y="283" fill="#1b2c28" fontSize="10" fontFamily="monospace">S/B — ROUTE ATLAS</text>
      <text x="385" y="283" textAnchor="end" fill="#1b2c28" fontSize="10" fontFamily="monospace">{String(completed).padStart(2,'0')} / 40</text>
    </svg>
    <div className="diagram-bottom"><span>FOUNDATIONS</span><span>→</span><span>OPERATIONS</span><span>→</span><span>PRODUCTION</span></div>
  </div>;
}

function Dashboard({p,next,onLesson,onWorld,onView}: {p:Progress,next:Lesson,onLesson:(l:Lesson)=>void,onWorld:(w:World)=>void,onView:(s:Screen)=>void}) {
  const completed=p.completed.length, xp=totalXP(p), current=worlds.find(w=>w.id===next.world)!;
  return <>
    <div className="welcome-line"><span><span className="little-star">◆</span> FIELD REPORT · NO. 001</span><span className="update-text">40 MISSIONS / 08 WORLDS</span></div>
    <section className="hero">
      <div className="hero-body">
        <div className="hero-label"><span className="hero-indicator"/> THE OPERATOR'S FIELD GUIDE <span className="hero-edition">ED. 01 — 2026</span></div>
        <h1>Build the skill.<br/><em>Ship the proof.</em></h1>
        <p>Forty practical missions. Eight disciplines. A clear route from your first commit to real infrastructure thinking.</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={()=>onLesson(next)}>{completed===0?'Begin fieldwork':'Resume fieldwork'}<ArrowRight size={17}/></button>
          <button className="btn-glass" onClick={()=>onView('world')}><Compass size={17}/> Explore the map</button>
        </div>
        <div className="hero-footnote"><span>01 / LEARN</span><i/><span>02 / PRACTICE</span><i/><span>03 / DEPLOY</span></div>
      </div>
      <FieldDiagram completed={completed}/>
    </section>
    <div className="kpi-grid"><Kpi icon={Zap} value={xp.toLocaleString()} label="Total XP earned" accent="#f8c66b"/><Kpi icon={CheckCircle2} value={`${completed} / 40`} label="Missions completed" accent="#68d9bd"/><Kpi icon={BrainCircuit} value={`${Object.keys(p.review).length} / 120`} label="Cards reviewed" accent="#a5abff"/><Kpi icon={Trophy} value={`${achievementStats(p).filter(a=>a.earned).length} / 8`} label="Badges unlocked" accent="#f497c0"/></div>
    <QuestStrip p={p} onView={onView}/>
    <div className="section-heading"><div><div className="eyebrow">UP NEXT / ACTIVE ASSIGNMENT</div><h2>Your next assignment</h2></div><button className="text-link" onClick={()=>onWorld(current)}>View world <ArrowRight size={16}/></button></div>
    <button className="continue-panel" onClick={()=>onLesson(next)}>
      <div className="continue-mark" style={{'--accent':current.accent} as CSSProperties}>{next.order.toString().padStart(2,'0')}</div>
      <div className="continue-copy"><span className="micro-label">{current.title.toUpperCase()} · MISSION {next.number}/5</span><h3>{completed===40?'Campaign complete — revisit the final boss':next.title}</h3><p>{next.summary}</p></div>
      <div className="continue-action"><span>+{next.xp} XP</span><span className="round-arrow"><ArrowRight size={21}/></span></div>
    </button>
    <div className="section-heading map-head"><div><div className="eyebrow">THE CURRICULUM / 01—08</div><h2>Your expedition map</h2></div><span className="muted small">{completionRate(p)}% journey complete</span></div>
    <div className="world-grid">{worlds.map(w=><WorldCard key={w.id} w={w} p={p} onClick={()=>onWorld(w)}/>)}</div>
    <div className="dashboard-bottom"><div className="prompt-panel"><div className="prompt-icon"><Terminal size={24}/></div><div><span className="micro-label">FROM THE FIELD</span><h3>Practice commands, safely.</h3><p>Complete simulated terminal challenges that teach syntax without executing commands on your machine. Then follow official labs when you're ready.</p></div><button className="btn-outline" onClick={()=>onLesson(next)}>Try a mission <ArrowRight size={15}/></button></div>
      <div className="review-panel"><BrainCircuit size={23}/><div><b>Knowledge check</b><p>{dueCards(p).length} flashcards are available to review today.</p></div><button className="square-btn" aria-label="Study flashcards" onClick={()=>onView('flashcards')}><ArrowRight size={20}/></button></div></div>
  </>;
}
function WorldCard({w,p,onClick}: {w:World,p:Progress,onClick:()=>void}){
  const Icon=worldIconMap[w.id];const completed=lessons.filter(l=>l.world===w.id&&p.completed.includes(l.id)).length;
  const available=lessons.some(l=>l.world===w.id && missionUnlocked(l,p));
  return <button className="world-card" data-world={w.number} onClick={onClick} style={{'--accent':w.accent} as CSSProperties}>
    <div className="world-card-top"><span className="world-card-num">WORLD {w.number}</span>{completed===5?<span className="world-status complete"><Check size={13}/> CLEAR</span>:<span className="world-status">{available?'IN PROGRESS':'LOCKED'}</span>}</div>
    <div className="world-big-icon"><Icon size={33} strokeWidth={1.7}/></div><h3>{w.title}</h3><p>{w.description}</p>
    <div className="world-card-bottom"><div className="world-progress-label"><span>{completed}/5 missions</span><span>{completed*20}%</span></div><ProgressBar value={completed*20} accent={w.accent}/></div>
  </button>;
}
function WorldView({world,p,onLesson,onWorld}: {world:World,p:Progress,onLesson:(l:Lesson)=>void,onWorld:(w:World)=>void}){
  const Icon=worldIconMap[world.id];const worldLessons=lessons.filter(l=>l.world===world.id);
  const cleared=worldLessons.filter(l=>p.completed.includes(l.id)).length;
  return <>
    <div className="eyebrow">CAMPAIGN / WORLD {world.number} OF 08</div>
    <div className="world-hero" style={{'--accent':world.accent} as CSSProperties}>
      <div className="world-hero-icon"><Icon size={47}/></div><div><span className="difficulty-label">{world.difficulty.toUpperCase()} · 5 MISSIONS</span><h1>{world.title}</h1><p>{world.description}</p><div className="world-progress-overview"><span>{cleared} / 5 completed</span><ProgressBar value={cleared*20} accent={world.accent}/><span>{cleared*20}%</span></div></div>
      <div className="world-hero-bg"><Icon size={195}/></div>
    </div>
    <div className="world-switcher" role="group" aria-label="Choose world">{worlds.map(w=><button key={w.id} className={w.id===world.id?'selected':''} title={w.title} onClick={()=>onWorld(w)}>{w.number}</button>)}</div>
    <div className="section-heading"><div><div className="eyebrow">MISSION PATH</div><h2>{world.place}</h2></div><a className="text-link" target="_blank" rel="noreferrer" href={world.source}>Official docs <ExternalLink size={15}/></a></div>
    <div className="mission-list">{worldLessons.map(l=>{
      const unlocked=missionUnlocked(l,p),done=p.completed.includes(l.id);
      return <button key={l.id} disabled={!unlocked} className={`mission-item ${l.isBoss?'boss-mission':''} ${unlocked?'':'mission-locked'} ${done?'mission-done':''}`} onClick={()=>onLesson(l)}>
        <span className="mission-number">{done?<Check size={20}/>:!unlocked?<LockKeyhole size={19}/>:l.isBoss?<Crown size={22}/>:String(l.order).padStart(2,'0')}</span>
        <span className="mission-info"><span className="micro-label">MISSION {l.number} · {l.minutes} MIN {l.isBoss?'· BOSS BATTLE':''}</span><strong>{l.title}</strong><span>{l.summary}</span></span>
        <span className="mission-end"><span>+{l.xp} XP · {l.isBoss?45:15} <Coins size={13}/></span><span className="mission-chevron">{unlocked?<ChevronRight size={22}/>:<LockKeyhole size={16}/>}</span></span>
      </button>})}</div>
    <div className="world-tip"><Lightbulb size={21}/><p><strong>How to progress:</strong> Complete the knowledge check with at least 2/3 answers correct and solve the simulated command challenge. Finish the mission to unlock the next one. Each fifth mission is a boss checkpoint.</p></div>
  </>;
}

function LessonView({lesson,p,onBack,onLab,onQuiz,onComplete,onBookmark}: {lesson:Lesson,p:Progress,onBack:()=>void,onLab:()=>void,onQuiz:()=>void,onComplete:()=>void,onBookmark:()=>void}){
  const world=worlds.find(w=>w.id===lesson.world)!;const Icon=worldIconMap[world.id];
  const solved=p.labs.includes(lesson.id),passed=p.passedQuizzes.includes(lesson.id),done=p.completed.includes(lesson.id);
  return <>
    {lesson.isBoss&&<div className="boss-brief"><Crown size={18}/> WORLD BOSS ENCOUNTER <span>Clear the lab and knowledge gate to open the victory chest.</span></div>}
    <div className="lesson-crumb"><button onClick={onBack}><ArrowLeft size={16}/> Back to {world.title}</button><span>MISSION {lesson.order.toString().padStart(2,'0')} / 40</span></div>
    <div className="lesson-header"><div className="lesson-icon" style={{color:world.accent,background:`${world.accent}18`}}><Icon size={34}/></div><div><div className="eyebrow">{world.place.toUpperCase()} {lesson.isBoss?'· BOSS MISSION':''}</div><h1>{lesson.title}</h1><p>{lesson.summary}</p><div className="lesson-metas"><span><FileClock size={15}/> {lesson.minutes} min</span><span><Zap size={15}/> {lesson.xp} XP</span><span><GraduationCap size={15}/> {world.difficulty}</span></div></div><button onClick={onBookmark} className={`bookmark-btn ${p.bookmarks.includes(lesson.id)?'bookmarked':''}`} title="Toggle bookmark"><Flag size={19} fill={p.bookmarks.includes(lesson.id)?'currentColor':'none'}/></button></div>
    <div className="lesson-layout"><div className="lesson-main">
      <section className="lesson-section"><h2><span className="section-step">01</span> Mission briefing</h2><p className="lesson-story">{lesson.questStory}</p><div className="objective-box"><Target size={20}/><div><b>Learning objective</b><p>{lesson.objective}</p></div></div></section>
      <section className="lesson-section"><h2><span className="section-step">02</span> Field intel</h2><p>Learn the important ideas before entering the terminal. These three concepts form the foundation of this mission.</p><div className="concept-list">{lesson.concepts.map((c,i)=><div className="concept-item" key={c.term}><span className="concept-index">0{i+1}</span><div><h3>{c.term}</h3><p>{c.definition}</p></div></div>)}</div>
        <div className="code-reference"><div className="code-header"><div className="traffic-dots"><i/><i/><i/></div><span><Terminal size={14}/> COMMAND EXAMPLE</span><button title="Copy example" onClick={()=>navigator.clipboard?.writeText(lesson.example)}><Copy size={15}/> Copy</button></div><pre><code>{lesson.example}</code></pre></div>
        <div className="warning-box"><Lightbulb size={19}/><span><strong>Operator note:</strong> {lesson.tip}</span></div>
      </section>
      <section className="lesson-section"><h2><span className="section-step">03</span> Terminal challenge {solved&&<span className="status-check"><CheckCircle2 size={18}/> COMPLETE</span>}</h2><p>Enter the command to solve this mission. This is a text-only simulator — it never executes commands, connects to Docker, or accesses cloud credentials.</p><TerminalChallenge key={lesson.id} lesson={lesson} solved={solved} onSolve={onLab}/></section>
      <section className="lesson-section"><h2><span className="section-step">04</span> Knowledge check {passed&&<span className="status-check"><CheckCircle2 size={18}/> PASSED</span>}</h2><p>Three questions. Get at least two right to clear the checkpoint. Each answer comes with an explanation.</p><KnowledgeCheck key={lesson.id} lesson={lesson} passed={passed} onPass={onQuiz}/></section>
      <section className="lesson-section finish-section"><div><span className="eyebrow">MISSION DEBRIEF</span><h2>{done?'Mission already cleared':solved&&passed?'Ready to claim your XP?':'Two objectives to complete'}</h2><p>{done?'Revisiting this mission is free. You earned XP only once.':'Clear the terminal challenge and pass the knowledge check to continue.'}</p><div className="finish-checks"><span className={solved?'done':''}>{solved?<CheckCircle2 size={17}/>:<LockKeyhole size={17}/>} Terminal challenge</span><span className={passed?'done':''}>{passed?<CheckCircle2 size={17}/>:<LockKeyhole size={17}/>} Knowledge check</span></div></div><button className="btn-primary" disabled={!solved||!passed} onClick={onComplete}>{done?'Continue':'Complete mission'}<ArrowRight size={18}/></button></section>
    </div><aside className="lesson-side"><div className="side-box"><div className="side-title"><Activity size={18}/> MISSION PROGRESS</div><div className="side-big">{(Number(solved)+Number(passed))*50}%</div><ProgressBar value={(Number(solved)+Number(passed))*50}/><div className="side-step">{solved?<CheckCircle2 size={16} className="mint"/>:<span className="mini-circle"/>} Complete terminal</div><div className="side-step">{passed?<CheckCircle2 size={16} className="mint"/>:<span className="mini-circle"/>} Pass knowledge check</div><div className="side-step muted"><Zap size={15}/> Reward: +{lesson.xp} XP</div></div>
      <div className="side-box"><div className="side-title"><BookOpen size={18}/> KEY TAKEAWAYS</div>{lesson.takeaways.map((t,i)=><div className="takeaway" key={i}><span>{i+1}</span><p>{t}</p></div>)}</div>
      <a href={world.source} target="_blank" rel="noreferrer" className="source-card"><ExternalLink size={18}/><span>Dig deeper in the<br/><b>official documentation</b></span><ArrowRight size={16}/></a></aside></div>
  </>;
}
function TerminalChallenge({lesson,solved,onSolve}:{lesson:Lesson,solved:boolean,onSolve:()=>void}){
  const [input,setInput]=useState(''),[history,setHistory]=useState<{command:string,ok:boolean}[]>([]),[hint,setHint]=useState(false);
  const attempt=()=>{if(!input.trim()||solved)return;
    const ok=labAccepts(lesson.lab.answer,input);
    setHistory(h=>[...h,{command:input,ok}].slice(-5));setInput('');if(ok)onSolve();};
  return <div className="terminal-window"><div className="terminal-top"><div className="traffic-dots"><i/><i/><i/></div><span>academy@stackbound:~$</span><span className="terminal-safe"><ShieldCheck size={13}/> SIMULATED</span></div>
    <div className="terminal-screen"><div className="terminal-greeting">Ops Atlas training shell v1.0<br/>No commands are executed. Practice syntax safely.</div><div className="terminal-task"><span>➜ OBJECTIVE:</span> {lesson.lab.prompt}</div>
      {history.map((h,i)=><div key={i} className="terminal-entry"><div><span className="terminal-dollar">$</span> {h.command}</div><div className={h.ok?'terminal-success':'terminal-fail'}>{h.ok?'✓ Command accepted. Challenge complete!':'✕ Not quite. Check the command and try again.'}</div></div>)}
      {solved&&history.length===0&&<div className="terminal-success">✓ Challenge cleared. Nicely done.</div>}
      {!solved&&<form className="terminal-inputline" onSubmit={e=>{e.preventDefault();attempt()}}><span>$</span><input aria-label="Type your simulated command" autoComplete="off" spellCheck={false} placeholder="type a command…" value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" title="Check command" disabled={!input.trim()}><ArrowRight size={18}/></button></form>}
    </div><div className="terminal-bottom"><button onClick={()=>setHint(!hint)}><CircleHelp size={15}/>{hint?'Hide hint':'Need a hint?'}</button><span>TEXT SIMULATOR · NO LIVE SHELL</span></div>{hint&&<div className="terminal-hint"><Lightbulb size={16}/> {lesson.lab.hint}</div>}
  </div>;
}
function KnowledgeCheck({lesson,passed,onPass}:{lesson:Lesson,passed:boolean,onPass:()=>void}) {
  const questions=useMemo(()=>questionsFor(lesson),[lesson]);
  const [index,setIndex]=useState(0),[answers,setAnswers]=useState<Record<number,number>>({}),[ended,setEnded]=useState(false);
  const q=questions[index],selected=answers[index],answered=selected!==undefined;
  const score=questions.reduce((sum,item,i)=>sum+Number(answers[i]===item.correct),0);
  const pass=score>=2;
  const next=()=>{if(index===questions.length-1){setEnded(true);if(pass)onPass();}else setIndex(index+1);};
  const restart=()=>{setIndex(0);setAnswers({});setEnded(false);};
  return <div className="quiz-box">{!ended?<>
    <div className="quiz-top"><span><BrainCircuit size={17}/> QUESTION {index+1} OF {questions.length}</span><span>{Object.keys(answers).length} answered</span></div><div className="quiz-progress">{questions.map((_,i)=><span key={i} className={i<=index?'lit':''}/>)}</div>
    <h3>{q.question}</h3><div className="quiz-options">{q.options.map((option,i)=><button key={i} disabled={answered} className={`quiz-option ${answered&&i===q.correct?'correct':''} ${answered&&selected===i&&i!==q.correct?'wrong':''}`} onClick={()=>setAnswers(a=>({...a,[index]:i}))}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{answered&&i===q.correct&&<CheckCircle2 size={19}/>}</button>)}</div>
    {answered&&<div className={`answer-explain ${selected===q.correct?'right':'not-right'}`}><strong>{selected===q.correct?'Correct! Great work.':'Not quite — here is why.'}</strong><p>{q.explanation}</p></div>}
    <div className="quiz-footer"><span>Pass: 2 of 3 correct</span><button className="btn-primary btn-small" disabled={!answered} onClick={next}>{index===2?'See results':'Next question'}<ArrowRight size={16}/></button></div>
  </>:<div className="quiz-results"><div className={`result-icon ${pass?'good':'retry'}`}>{pass?<Trophy size={34}/>:<RotateCcw size={32}/>}</div><span className="eyebrow">CHECKPOINT RESULT</span><h3>{score} / 3 correct</h3><p>{pass?'Checkpoint passed. You have demonstrated the core concepts.':'Almost there. Review the explanations and try again to earn a passing score.'}</p><div className="quiz-result-actions"><button className="btn-outline" onClick={restart}><RotateCcw size={16}/> Practice again</button>{(pass||passed)&&<span className="passed-label"><CheckCircle2 size={17}/> Passed</span>}</div></div>}</div>;
}

function FlashcardLab({progress,onReview}: {progress:Progress,onReview:(id:string,remembered:boolean)=>void}) {
  const [worldFilter,setWorldFilter]=useState('all'),[dueOnly,setDueOnly]=useState(true),[position,setPosition]=useState(0),[flipped,setFlipped]=useState(false);
  const allCards=useMemo(()=>lessons.filter(l=>worldFilter==='all'||l.world===worldFilter).flatMap(l=>l.concepts.map((c,i)=>({...c,id:l.id+':'+i,lesson:l.title,world:l.world}))),[worldFilter]);
  const cards=dueOnly?allCards.filter(c=>!progress.review[c.id]||progress.review[c.id].due<=Date.now()):allCards;
  const idx=position%Math.max(cards.length,1),card=cards[idx];
  const review=(remembered:boolean)=>{if(!card)return;onReview(card.id,remembered);setFlipped(false);setPosition(n=>dueOnly?n:n+1);};
  return <>
    <PageIntro eyebrow="THE MEMORY VAULT" title="Flashcard laboratory" description="Build recall, not just recognition. Flip a card, rate your answer, and let spaced review bring it back when it matters."/>
    <div className="feature-toolbar"><div className="select-wrap"><Layers3 size={17}/><select aria-label="Flashcard subject" value={worldFilter} onChange={e=>{setWorldFilter(e.target.value);setPosition(0);setFlipped(false)}}><option value="all">All 8 learning worlds</option>{worlds.map(w=><option value={w.id} key={w.id}>{w.title}</option>)}</select><ChevronDown size={16}/></div><label className="toggle-line"><input type="checkbox" checked={dueOnly} onChange={e=>{setDueOnly(e.target.checked);setPosition(0);setFlipped(false)}}/> Due cards only</label><div className="toolbar-stat"><BrainCircuit size={18}/>{Object.keys(progress.review).length} cards studied</div></div>
    {card?<div className="flashcard-layout"><div className="flashcard-area"><div className="card-progress-line"><span>REVIEW SESSION</span><span>{idx+1} / {cards.length}</span></div>
      <button className={`study-card ${flipped?'flipped':''}`} onClick={()=>setFlipped(v=>!v)} aria-label={flipped?'Show flashcard question':'Reveal flashcard answer'}>
        <div className="study-card-head"><span><Sparkles size={16}/> {flipped?'THE ANSWER':'RECALL THE CONCEPT'}</span><span>{card.world.toUpperCase()}</span></div>
        <div className="study-card-center"><span className="study-card-subtitle">{flipped?'How it works':'Define or explain'}</span><h2>{flipped?card.definition:card.term}</h2></div><div className="study-card-footer"><span>{card.lesson}</span><span><RotateCcw size={16}/> Tap to flip</span></div>
      </button>
      {!flipped?<button className="btn-primary reveal-btn" onClick={()=>setFlipped(true)}><BookOpen size={17}/> Reveal answer</button>:<div className="card-grades"><button className="grade-again" onClick={()=>review(false)}><RotateCcw size={18}/> Not yet <small>Review tomorrow</small></button><button className="grade-good" onClick={()=>review(true)}><CheckCircle2 size={18}/> Got it <small>Increase interval</small></button></div>}
      <div className="flashcard-note"><Lightbulb size={17}/> Try answering out loud before revealing the back.</div></div>
      <div className="flashcard-help"><div className="side-box"><h3>How review works</h3><p>Cards appear when due. “Got it” increases the review interval (1 day, 3 days, then longer). “Not yet” schedules a retry tomorrow.</p><div className="review-number">{dueCards(progress,worldFilter).length}<span>due now</span></div><ProgressBar value={progressPct(Object.keys(progress.review).length,120)}/></div><div className="side-box"><h3>Remember more, faster</h3><p>Active recall + repeated exposure beats passive rereading. Mix flashcards with labs to practice applying each idea.</p></div></div></div>:
    <div className="empty-state"><CheckCircle2 size={49}/><h2>All caught up!</h2><p>No cards are due in this selection. You can switch to all cards or explore another world.</p><button className="btn-primary" onClick={()=>{setDueOnly(false);setPosition(0)}}>Study all cards <ArrowRight size={16}/></button></div>}
  </>;
}
function QuizArena({progress,onResult}:{progress:Progress,onResult:(pct:number)=>void}){
  const [worldFilter,setWorldFilter]=useState('all');const [round,setRound]=useState(0);
  const [questions,setQuestions]=useState<QuizQuestion[]>(()=>buildExam('all'));
  const [answers,setAnswers]=useState<Record<string,number>>({}),[submitted,setSubmitted]=useState(false);
  const percentage=Math.round(questions.filter(q=>answers[q.id]===q.correct).length*100/questions.length);
  const begin=(w=worldFilter)=>{setWorldFilter(w);setQuestions(buildExam(w,15,round+1));setRound(n=>n+1);setAnswers({});setSubmitted(false);};
  const submit=()=>{if(Object.keys(answers).length!==questions.length)return;setSubmitted(true);onResult(percentage);};
  return <><PageIntro eyebrow="PROVE YOUR SKILLS" title="The quiz arena" description="15 mixed questions. A real readiness check across Git, containers, Kubernetes, cloud, and production security — with explanations and performance tracking."/>
    <div className="arena-stats"><Kpi icon={Trophy} value={`${progress.examBest}%`} label="Personal best" accent="#f9c86d"/><Kpi icon={Target} value={String(progress.examAttempts)} label="Completed exams" accent="#ad9fff"/><Kpi icon={GraduationCap} value="80%" label="Badge threshold" accent="#63dab5"/></div>
    <div className="feature-toolbar"><div className="select-wrap"><Target size={17}/><select aria-label="Quiz subject" value={worldFilter} onChange={e=>begin(e.target.value)}><option value="all">Comprehensive exam</option>{worlds.map(w=><option key={w.id} value={w.id}>{w.title}</option>)}</select><ChevronDown size={16}/></div><button className="btn-outline" onClick={()=>begin()}><RotateCcw size={16}/> New exam</button><span className="toolbar-stat">{Object.keys(answers).length} / {questions.length} answered</span></div>
    {submitted&&<div className={`exam-result ${percentage>=80?'exam-passed':''}`}><Trophy size={30}/><div><div className="eyebrow">EXAM COMPLETE</div><h2>{percentage}% · {percentage>=80?'Mission accomplished!':'Keep training'}</h2><p>{percentage>=80?'You passed the mastery threshold. Your achievement can be found in your profile.':'Review the explanations below, then retry with a new question set.'}</p></div><button className="btn-outline" onClick={()=>begin()}>Retake <ArrowRight size={16}/></button></div>}
    <div className="arena-questions">{questions.map((q,n)=><div key={q.id} className="arena-question"><div className="arena-question-top"><span>QUESTION {String(n+1).padStart(2,'0')}</span>{submitted&&<span className={answers[q.id]===q.correct?'mint':'rose'}>{answers[q.id]===q.correct?'✓ CORRECT':'✕ INCORRECT'}</span>}</div><h3>{q.question}</h3><div className="arena-option-grid">{q.options.map((option,i)=><button key={i} disabled={submitted} onClick={()=>setAnswers(a=>({...a,[q.id]:i}))} className={`arena-option ${answers[q.id]===i?'selected':''} ${submitted&&i===q.correct?'correct':''} ${submitted&&answers[q.id]===i&&i!==q.correct?'wrong':''}`}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>{submitted&&<p className="arena-explanation"><Lightbulb size={16}/>{q.explanation}</p>}</div>)}</div>
    <div className="exam-end"><span>{Object.keys(answers).length} / {questions.length} questions answered</span><button className="btn-primary" disabled={submitted||Object.keys(answers).length!==questions.length} onClick={submit}><Flag size={16}/> Submit assessment <ArrowRight size={17}/></button></div>
  </>;
}
function AchievementsView({p,onView}:{p:Progress,onView:(s:Screen)=>void}){
  const badges=achievementStats(p),earned=badges.filter(b=>b.earned).length;
  return <><PageIntro eyebrow="THE TROPHY ROOM" title="Your explorer profile" description="Your missions, practice and earned achievements in one place. Every milestone represents a concrete skill practiced."/>
    <div className="profile-banner"><div className="profile-emblem">{chosenCosmetic(p).symbol}</div><div><span className="eyebrow">OPS ATLAS EXPLORER · LEVEL {playerLevel(p)}</span><h2>{chosenCosmetic(p).title}</h2><p>{earned} badges earned · {p.completed.length} missions cleared · {totalXP(p).toLocaleString()} experience points</p></div><div className="profile-level">LVL <strong>{playerLevel(p)}</strong></div></div>
    <div className="section-heading"><div><div className="eyebrow">YOUR TROPHY CABINET</div><h2>{earned} of {badges.length} achievements</h2></div></div>
    <div className="badge-grid">{badges.map(b=>{const Icon=badgeIconMap[b.id];return <div className={`badge-card ${b.earned?'unlocked':''}`} key={b.id}><div className="badge-medallion">{b.earned?<Icon size={30}/>:<LockKeyhole size={27}/>}</div><span className="micro-label">{b.earned?'ACHIEVEMENT UNLOCKED':'NOT YET UNLOCKED'}</span><h3>{b.name}</h3><p>{b.detail}</p></div>})}</div>
    <div className="section-heading"><div><div className="eyebrow">CAMPAIGN COMPLETION</div><h2>Your mastery map</h2></div><button className="text-link" onClick={()=>onView('world')}>Continue learning <ArrowRight size={16}/></button></div>
    <div className="mastery-list">{worlds.map(w=>{const completed=lessons.filter(l=>l.world===w.id&&p.completed.includes(l.id)).length;const Icon=worldIconMap[w.id];return <div key={w.id} className="mastery-row"><span className="mastery-icon" style={{color:w.accent}}><Icon size={20}/></span><span>{w.title}</span><div><ProgressBar value={completed*20} accent={w.accent}/></div><b>{completed}/5</b></div>})}</div>
  </>;
}

function QuestStrip({p,onView}:{p:Progress,onView:(s:Screen)=>void}){
  const qs=questStatus(p),done=qs.filter(q=>q.claimed).length;
  return <section className="quest-strip" aria-label="Daily quests preview">
    <div className="quest-strip-left"><span className="quest-flame"><Flame size={25}/></span>
      <div><span className="micro-label">THE DAILY DISPATCH</span><h3>{streakDays(p)}-day learning streak</h3>
        <p>{done} of 3 rewards claimed · Keep your skills sharp today</p></div></div>
    <div className="quest-mini-tracks">{qs.map(q=><span key={q.id} className={q.claimed?'claimed':q.ready?'ready':''} title={q.title}/>)}</div>
    <button className="btn-outline" onClick={()=>onView('quests')}>Quest board <ArrowRight size={16}/></button>
  </section>;
}

function QuestBoard({p,onClaim,onView}:{p:Progress,onClaim:(id:string)=>void,onView:(s:Screen)=>void}){
  const quests=questStatus(p),claimed=quests.filter(q=>q.claimed).length;
  const questIcons=[BrainCircuit,Terminal,Trophy];
  return <>
    <PageIntro eyebrow="YOUR DAILY ADVENTURE" title="Quest board" description="Small, achievable challenges that turn practice into momentum. Progress resets each local calendar day; rewards can only be claimed once per quest."/>
    <div className="quest-banner"><div className="quest-banner-left"><span className="quest-banner-icon"><Flame size={40}/></span><div><span className="micro-label">CURRENT STREAK</span><h2>{streakDays(p)} days strong</h2><p>Best streak: {p.bestStreak} days · Only real study actions count</p></div></div>
      <div className="quest-banner-score"><strong>{claimed}/3</strong><span>QUESTS CLAIMED</span></div></div>
    <div className="quest-grid">{quests.map((q,i)=>{const Icon=questIcons[i];return <article key={q.id} className={`quest-card ${q.claimed?'quest-claimed':''}`}>
      <div className="quest-card-top"><span className="quest-icon"><Icon size={23}/></span><span className="micro-label">DAILY 0{i+1}</span></div>
      <h3>{q.title}</h3><p>{q.summary}</p>
      <div className="quest-count"><b>{q.count} / {q.goal}</b><span>{q.claimed?'REWARD CLAIMED':q.ready?'READY TO CLAIM':'IN PROGRESS'}</span></div>
      <ProgressBar value={100*q.count/q.goal}/>
      <div className="quest-rewards"><span><Zap size={15}/> +{q.xp} XP</span><span><Coins size={15}/> +{q.coins} credits</span></div>
      <button className={q.claimed?'btn-outline quest-claim':'btn-primary quest-claim'} disabled={!q.ready||q.claimed} onClick={()=>onClaim(q.id)}>{q.claimed?<><CheckCircle2 size={17}/> Claimed</>:q.ready?<><Gift size={17}/> Claim rewards</>:<><LockKeyhole size={15}/> Complete objective</>}</button>
    </article>})}</div>
    <div className="quest-next-steps"><div><h3>Need a quest to tackle?</h3><p>Practice five different flashcards, clear a mission, or test yourself in the arena.</p></div>
      <div className="quest-next-buttons"><button className="btn-outline" onClick={()=>onView('flashcards')}><BrainCircuit size={16}/> Flashcards</button><button className="btn-outline" onClick={()=>onView('arena')}><Target size={16}/> Arena</button><button className="btn-outline" onClick={()=>onView('dashboard')}><Compass size={16}/> Campaign</button></div></div>
    <p className="quest-footnote"><CalendarDays size={15}/> Quest day: {todayKey()} (your device's date). No login, leaderboards, tracking, or purchase required.</p>
  </>;
}

function RewardVault({p,onBuy,onEquip}:{p:Progress,onBuy:(id:string)=>void,onEquip:(id:string)=>void}){
  return <>
    <PageIntro eyebrow="THE EXPLORER'S MARKET" title="Reward vault" description="Earn credits through missions and daily quests. Spend them on purely cosmetic player identities — never on shortcuts or answers."/>
    <div className="vault-wallet"><div className="vault-wallet-icon"><Coins size={29}/></div><div><span className="micro-label">YOUR CREDIT BALANCE</span><h2>{p.coins.toLocaleString()} credits</h2><p>New mission +15 · Boss battle +45 · Daily quests +25 to +50</p></div><Gift className="vault-wallet-art" size={100}/></div>
    <div className="vault-grid">{COSMETICS.map(item=>{
      const owned=p.unlockedCosmetics.includes(item.id),equipped=p.equippedCosmetic===item.id;
      return <article key={item.id} className={`vault-card ${equipped?'vault-equipped':''}`}>
        <span className="micro-label">{equipped?'CURRENT IDENTITY':owned?'COLLECTED':'COSMETIC UNLOCK'}</span>
        <div className="vault-symbol" aria-hidden="true">{item.symbol}</div><h3>{item.name}</h3><strong className="vault-title">{item.title}</strong><p>{item.flavor}</p>
        <div className="vault-card-footer"><span><Coins size={15}/> {item.price===0?'FREE':item.price}</span>
          {equipped?<button className="btn-outline" disabled><CheckCircle2 size={16}/> Equipped</button>:
            owned?<button className="btn-primary btn-small" onClick={()=>onEquip(item.id)}><Check size={16}/> Equip</button>:
            <button className="btn-primary btn-small" onClick={()=>onBuy(item.id)} disabled={p.coins<item.price}><Gift size={16}/> Unlock</button>}
        </div>
      </article>})}</div>
    <div className="vault-hint"><ShieldCheck size={18}/> Credits and cosmetics are saved in your browser alongside your learning progress. They have no cash value.</div>
  </>;
}

function VictoryOverlay({lesson,onContinue,onMap}:{lesson:Lesson,onContinue:()=>void,onMap:()=>void}){
  const credits=lesson.isBoss?45:15;
  const goRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>{goRef.current?.focus();const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')onMap();};
    window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[onMap]);
  return <div className="victory-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onMap();}}>
    <section className="victory-modal" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className="victory-particles" aria-hidden="true">{Array.from({length:14},(_,i)=><span key={i} style={{'--i':i} as CSSProperties}>✦</span>)}</div>
      <div className="victory-medal">{lesson.isBoss?<Crown size={45}/>:<Star size={44} fill="currentColor"/>}</div>
      <div className="eyebrow">{lesson.isBoss?'WORLD BOSS DEFEATED':'MISSION ACCOMPLISHED'}</div>
      <h2 id="victory-title">{lesson.isBoss?'Legendary victory!':'Quest cleared!'}</h2>
      <p>{lesson.title}</p>
      <div className="victory-loot"><div><Zap size={21}/><strong>+{lesson.xp}</strong><span>EXPERIENCE</span></div><div><Coins size={21}/><strong>+{credits}</strong><span>CREDITS</span></div></div>
      <div className="victory-actions"><button className="btn-outline" onClick={onMap}>World map</button><button ref={goRef} className="btn-primary" onClick={onContinue}>Next objective <ArrowRight size={18}/></button></div>
    </section>
  </div>;
}

const resources=[
  {subject:'Git fundamentals',title:'Pro Git — official book',url:'https://git-scm.com/book/en/v2',description:'History, branching, rebasing, internals, and workflows.'},
  {subject:'GitHub workflows',title:'GitHub Skills & Docs',url:'https://skills.github.com/',description:'Interactive courses on branches, PRs, Actions, and Pages.'},
  {subject:'Docker',title:'Docker Get Started & Guided Labs',url:'https://docs.docker.com/get-started/',description:'Images, containers, volumes, Compose, BuildKit, and secure builds.'},
  {subject:'Kubernetes',title:'Official Kubernetes Tutorials',url:'https://kubernetes.io/docs/tutorials/kubernetes-basics/',description:'Deploy, scale, update, troubleshoot, and expose applications.'},
  {subject:'AWS',title:'AWS Documentation',url:'https://docs.aws.amazon.com/',description:'IAM, EC2, VPC, S3, architecture, security, and cost management.'},
  {subject:'Azure',title:'Microsoft Learn — Azure Fundamentals',url:'https://learn.microsoft.com/en-us/training/azure/',description:'Cloud concepts, networking, governance, storage, and identity.'},
  {subject:'Google Cloud',title:'Google Cloud Overview',url:'https://docs.cloud.google.com/docs/overview',description:'Regions/zones, Compute Engine, IAM, storage, and networking.'},
  {subject:'IaC',title:'Terraform Documentation',url:'https://developer.hashicorp.com/terraform/docs',description:'Versioned infrastructure, remote state, plan, and apply workflow.'},
];
function ResourcesView({p,onExport,onImport,onReset}:{p:Progress,onExport:()=>void,onImport:()=>void,onReset:()=>void}){
  const [query,setQuery]=useState('');const filtered=resources.filter(r=>(r.subject+' '+r.title+' '+r.description).toLowerCase().includes(query.toLowerCase()));
  return <><PageIntro eyebrow="THE FIELD MANUAL" title="Learn from the source" description="Curated primary documentation to take every simulated mission further into real, authorized hands-on practice. All learning content in the game is original."/>
    <div className="search-control"><Search size={18}/><input aria-label="Search resources" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search documentation…"/></div>
    <div className="resources-grid">{filtered.map(r=><a href={r.url} key={r.url} target="_blank" rel="noreferrer" className="resource-item"><div className="resource-top"><span className="micro-label">{r.subject.toUpperCase()}</span><ExternalLink size={17}/></div><h3>{r.title}</h3><p>{r.description}</p><span className="resource-visit">Visit official resource <ArrowRight size={15}/></span></a>)}</div>
    {filtered.length===0&&<p className="muted">No matching resources found.</p>}
    <div className="section-heading"><div><div className="eyebrow">HOW TO USE THE ACADEMY</div><h2>From simulation to real projects</h2></div></div>
    <div className="guide-grid"><div><span className="guide-num">01</span><h3>Understand</h3><p>Read the briefing, focus on the three core terms, and check the example command before the lab.</p></div><div><span className="guide-num">02</span><h3>Practice safely</h3><p>Type commands into the simulated terminal. It checks text only; no processes or cloud API requests are executed.</p></div><div><span className="guide-num">03</span><h3>Build for real</h3><p>Repeat validated steps in disposable local folders and isolated test clusters. Never use production credentials for training.</p></div><div><span className="guide-num">04</span><h3>Prove and review</h3><p>Pass quizzes, schedule flashcards, and apply the same concepts to your own projects and CI/CD pipelines.</p></div></div>
    <div className="cloud-warning"><ShieldCheck size={22}/><p><strong>Cloud cost and safety notice.</strong> This website creates no cloud resources and asks for no credentials. Real AWS, Azure, or Google Cloud exercises may create billable resources. Configure budgets, avoid root credentials, restrict access, and clean up test infrastructure after use.</p></div>
    <div className="section-heading"><div><div className="eyebrow">YOUR DATA, YOUR CONTROL</div><h2>Manage local progress</h2></div></div>
    <div className="data-panel"><div><h3>Private by default</h3><p>Progress is stored only in this browser's localStorage. No login, analytics SDK, hosted database, or backend is required. Export it before clearing browser data or moving devices.</p><span className="small muted">{p.completed.length} completed missions currently saved</span></div><div className="data-buttons"><button className="btn-outline" onClick={onExport}><ArrowDownToLine size={17}/> Export JSON</button><button className="btn-outline" onClick={onImport}><Upload size={17}/> Import JSON</button><button className="danger-button" onClick={onReset}><RotateCcw size={16}/> Reset progress</button></div></div>
    <div className="attribution">Course catalog v{curriculum.version} · Learning links checked October 2026 · Product and provider names belong to their respective owners.</div>
  </>;
}
export default App;
