// ═══ Guided tests: the app tells you what to do, measures, and judges ═══
// Each test is a list of steps. "do" = an instruction the user confirms; "watch" = the app reads the listed PIDs
// for N seconds and keeps the samples under `key`. judge(res, L) turns the samples into a verdict.
// "batt" = the adapter's own voltage reading (ATRV). PIDs the car doesn't support are simply missing.

const nums = (arr, k) => (arr||[]).map(x=>x[k]).filter(v=>typeof v==="number" && isFinite(v));
const avg = (arr, k) => { const v = nums(arr,k); return v.length ? v.reduce((a,b)=>a+b,0)/v.length : null; };
const mn = (arr, k) => { const v = nums(arr,k); return v.length ? Math.min(...v) : null; };
const mx = (arr, k) => { const v = nums(arr,k); return v.length ? Math.max(...v) : null; };
const tail = arr => (arr||[]).slice(Math.floor((arr||[]).length/2));
const f1 = v => v===null ? "—" : v.toFixed(1);
const sg = v => v===null ? "—" : (v>0?"+":"")+v.toFixed(1);
// keep numbers, arrows and ranges left-to-right inside Hebrew sentences
const ltr = x => "\u2066"+x+"\u2069";
// running voltage: the ECU's own reading (PID 42) is more accurate than the adapter's
const runV = arr => avg(arr,"42") ?? avg(arr,"batt");
const bankTrim = (arr, st, lt) => { const a = avg(arr,st), b = avg(arr,lt); return a===null && b===null ? null : (a||0)+(b||0); };
const worst = list => list.includes("bad") ? "bad" : list.includes("warn") ? "warn" : list.includes("ok") ? "ok" : "na";
const TRIMS = ["06","07","08","09","0C","05"];

export const GUIDED_TESTS = [
  {
    id:"charge", ic:"🔋", he:"מצבר וטעינה", en:"Battery & charging",
    dhe:"מודד את המצבר כשהמנוע כבוי, ואת הטעינה בסרק, בעומס חשמלי וב-2000 סל\"ד.",
    den:"Measures the battery with the engine off, then charging at idle, under electrical load and at 2000 rpm.",
    steps:[
      { k:"do", he:"כבה את המנוע. הצתה ON בלי להתניע, וכל הצרכנים כבויים (אורות, מיזוג, רדיו).", en:"Engine off. Ignition ON without starting, everything switched off (lights, A/C, radio)." },
      { k:"watch", key:"off", pids:["batt"], secs:5, he:"מודד מתח מצבר...", en:"Measuring battery voltage..." },
      { k:"do", he:"התנע ותן למנוע לעבוד בסרק.", en:"Start the engine and let it idle." },
      { k:"watch", key:"idle", pids:["batt","42","0C"], secs:8, he:"מודד טעינה בסרק...", en:"Measuring charging at idle..." },
      { k:"do", he:"הדלק אורות גבוהים, מאוורר/מיזוג במקסימום וחימום חלון אחורי.", en:"Switch on high beams, fan/A-C at max and the rear demister." },
      { k:"watch", key:"load", pids:["batt","42","0C"], secs:8, he:"מודד טעינה בעומס...", en:"Measuring charging under load..." },
      { k:"do", he:"החזק 2000 סל\"ד יציב (הצרכנים נשארים דלוקים).", en:"Hold a steady 2000 rpm (loads stay on)." },
      { k:"watch", key:"rev", pids:["batt","42","0C"], secs:8, he:"מודד טעינה ב-2000 סל\"ד...", en:"Measuring charging at 2000 rpm..." },
    ],
    judge(r, L){
      const out = [], lv = [];
      const off = avg(r.off,"batt");
      if(off!==null){ const l = off>=12.5 ? "ok" : off>=12.2 ? "warn" : "bad"; lv.push(l);
        out.push(L(`מצבר במנוחה: ${f1(off)}V — `+(l==="ok"?"תקין":l==="warn"?"טעון חלקית":"חלש / ריק"),`Battery at rest: ${f1(off)}V — `+(l==="ok"?"good":l==="warn"?"partly charged":"weak / flat"))); }
      for(const [k,he,en,lo,hi] of [["idle","בסרק","at idle",13.4,14.9],["load","בעומס","under load",13.0,14.9],["rev","ב-2000 סל\"ד","at 2000 rpm",13.6,14.9]]){
        const v = runV(r[k]); if(v===null) continue; const rpm = avg(r[k],"0C");
        if(rpm!==null && rpm<400){ out.push(L(`${he}: המנוע לא עבד בזמן המדידה`,`${en}: the engine wasn't running`)); continue; }
        const l = v>15.0 ? "bad" : v>=lo ? "ok" : v>=lo-0.4 ? "warn" : "bad"; lv.push(l);
        out.push(L(`טעינה ${he}: ${f1(v)}V — `+(v>15?"טעינת יתר (וסת)":l==="ok"?"תקין":l==="warn"?"גבולי":"נמוך — אלטרנטור / רצועה / חיבורים"),`Charging ${en}: ${f1(v)}V — `+(v>15?"overcharging (regulator)":l==="ok"?"good":l==="warn"?"borderline":"low — alternator / belt / connections")));
      }
      const a = avg(r.idle,"batt"), e = avg(r.idle,"42");
      if(a!==null && e!==null && e-a>0.5) out.push(L(`המתאם מודד ${f1(a)}V והמחשב ${f1(e)}V — הפרש של מפל מתח בשקע; הטעינה נשפטה לפי המחשב.`,`The adapter reads ${f1(a)}V and the ECU ${f1(e)}V — a voltage drop at the socket; charging was judged by the ECU.`));
      return { lvl:worst(lv), lines:out };
    }
  },
  {
    id:"crank", ic:"⚡", he:"מתח בזמן התנעה", en:"Cranking voltage",
    dhe:"בודק כמה המתח יורד כשהמתנע עובד — הסימן הכי טוב למצבר שעומד להיגמר.",
    den:"Checks how far the voltage drops while the starter turns — the best sign of a battery about to die.",
    steps:[
      { k:"do", he:"מנוע כבוי, הצתה ON. לחץ \"המשך\" ומיד התנע (המדידה רצה 8 שניות).", en:"Engine off, ignition ON. Tap \"Continue\" and crank right away (measures for 8 seconds)." },
      { k:"watch", key:"crank", pids:["batt"], secs:8, fast:true, he:"התנע עכשיו!", en:"Crank now!" },
    ],
    judge(r, L){
      const lo = mn(r.crank,"batt"), hi = mx(r.crank,"batt");
      if(lo===null) return { lvl:"na", lines:[L("לא התקבלו מדידות מתח מהמתאם.","No voltage readings from the adapter.")] };
      if(hi!==null && hi-lo<0.6) return { lvl:"na", lines:[L(`המתח כמעט לא זז (${f1(lo)}–${f1(hi)}V) — כנראה ההתנעה לא נקלטה. נסה שוב והתנע מיד.`,`The voltage barely moved (${f1(lo)}–${f1(hi)}V) — the crank probably wasn't caught. Try again and crank right away.`)] };
      const l = lo>=10 ? "ok" : lo>=9.6 ? "warn" : "bad";
      return { lvl:l, lines:[L(`המתח הנמוך בהתנעה: ${f1(lo)}V — `+(l==="ok"?"תקין":l==="warn"?"גבולי, המצבר מתחיל להיחלש":"נמוך — מצבר חלש, או חיבורים/כבלים רופפים"),`Lowest voltage while cranking: ${f1(lo)}V — `+(l==="ok"?"good":l==="warn"?"borderline, the battery is getting weak":"low — weak battery, or loose terminals/cables")),
        L("המתאם דוגם כמה פעמים בשנייה, אז השפל האמיתי יכול להיות מעט נמוך יותר.","The adapter samples a few times a second, so the true dip can be slightly lower.")] };
    }
  },
  {
    id:"purge", ic:"💨", he:"בדיקת Purge (אדי דלק)", en:"Purge (fuel vapour) test",
    dhe:"בודק אם שסתום ה-Purge דולף ומעשיר את התערובת. צריך מנוע חם.",
    den:"Checks whether the purge valve leaks and makes the mixture rich. Needs a warm engine.",
    steps:[
      { k:"do", he:"מנוע חם (מעל 80°C) בסרק. אל תיגע בכלום.", en:"Warm engine (over 80°C) at idle. Don't touch anything." },
      { k:"watch", key:"base", pids:[...TRIMS,"2E"], secs:20, he:"מודד את התערובת הרגילה...", en:"Measuring the normal mixture..." },
      { k:"do", he:"נתק את צינור ה-Purge מהשסתום (הצד שהולך לסעפת היניקה) ופקוק אותו, או צבוט את הצינור.", en:"Disconnect the purge hose at the valve (the side going to the intake) and plug it, or pinch the hose." },
      { k:"watch", key:"block", pids:[...TRIMS,"2E"], secs:20, he:"מודד עם הצינור חסום...", en:"Measuring with the hose blocked..." },
      { k:"do", he:"החזר את הצינור למקומו.", en:"Reconnect the hose." },
    ],
    judge(r, L){
      const out = [], ect = avg(r.base,"05");
      const s0 = avg(tail(r.base),"06"), s1 = avg(tail(r.block),"06"), b0 = avg(tail(r.base),"08"), b1 = avg(tail(r.block),"08");
      if(s0===null || s1===null) return { lvl:"na", lines:[L("הרכב לא מסר STFT — אי אפשר לשפוט.","The car didn't report STFT — can't judge.")] };
      if(ect!==null && ect<75) out.push(L(`המנוע היה קר (${ect.toFixed(0)}°C) — כדאי לחזור על הבדיקה עם מנוע חם.`,`The engine was cold (${ect.toFixed(0)}°C) — better repeat with a warm engine.`));
      const d = b0!==null && b1!==null ? ((s1-s0)+(b1-b0))/2 : s1-s0;
      out.push(L(`STFT לפני: ${ltr(sg(s0)+"%"+(b0!==null?" / "+sg(b0)+"%":""))} · אחרי חסימה: ${ltr(sg(s1)+"%"+(b1!==null?" / "+sg(b1)+"%":""))} · שינוי: ${ltr(sg(d)+"%")}`,`STFT before: ${sg(s0)}%${b0!==null?" / "+sg(b0)+"%":""} · blocked: ${sg(s1)}%${b1!==null?" / "+sg(b1)+"%":""} · change: ${sg(d)}%`));
      const cmd = avg(r.base,"2E");
      if(d>=5){ out.push(L("חסימת הצינור הורידה את ההעשרה → אדי דלק נכנסו דרכו. "+(cmd!==null && cmd<5?"ה-Purge המבוקש היה ~0%, אז השסתום דולף — להחליף שסתום Purge.":"בדוק אם השסתום נפתח רק כשהמחשב מבקש."),"Blocking the hose removed the enrichment → fuel vapour was coming through it. "+(cmd!==null && cmd<5?"Commanded purge was ~0%, so the valve leaks — replace the purge valve.":"Check that the valve only opens when commanded."))); return { lvl:"bad", lines:out }; }
      if(d<=-5){ out.push(L("אחרי החסימה התערובת נהייתה עשירה יותר → דרך הצינור נכנס אוויר (דליפת ואקום), לא אדי דלק. בדוק את הצינור והחיבורים.","After blocking, the mixture got richer → air was entering through that hose (a vacuum leak), not vapour. Check the hose and joints.")); return { lvl:"warn", lines:out }; }
      out.push(L("החסימה כמעט לא שינתה כלום → שסתום ה-Purge אוטם. סיבת העשרה (אם יש) נמצאת במקום אחר.","Blocking changed almost nothing → the purge valve seals. Any enrichment comes from elsewhere."));
      return { lvl:"ok", lines:out };
    }
  },
  {
    id:"trims", ic:"📊", he:"תערובת: סרק מול 2500 סל\"ד", en:"Mixture: idle vs 2500 rpm",
    dhe:"משווה את תיקוני הדלק בסרק ובסל\"ד — מבדיל בין דליפת ואקום, בעיית דלק, ובעיה בצד אחד של המנוע.",
    den:"Compares fuel trims at idle and at 2500 rpm — tells a vacuum leak from a fuel problem or a one-bank fault.",
    steps:[
      { k:"do", he:"מנוע חם בסרק, בלי צרכנים.", en:"Warm engine at idle, no loads." },
      { k:"watch", key:"idle", pids:[...TRIMS,"10"], secs:15, he:"מודד בסרק...", en:"Measuring at idle..." },
      { k:"do", he:"החזק 2500 סל\"ד יציב.", en:"Hold a steady 2500 rpm." },
      { k:"watch", key:"rpm", pids:[...TRIMS,"10"], secs:15, he:"מודד ב-2500 סל\"ד...", en:"Measuring at 2500 rpm..." },
    ],
    judge(r, L){
      const out = [];
      const i1 = bankTrim(tail(r.idle),"06","07"), i2 = bankTrim(tail(r.idle),"08","09"), h1 = bankTrim(tail(r.rpm),"06","07"), h2 = bankTrim(tail(r.rpm),"08","09");
      if(i1===null || h1===null) return { lvl:"na", lines:[L("הרכב לא מסר תיקוני דלק.","The car didn't report fuel trims.")] };
      const rpm = avg(r.rpm,"0C"); if(rpm!==null && rpm<2000) out.push(L(`הסל"ד בשלב השני היה רק ${rpm.toFixed(0)} — התוצאה פחות מדויקת.`,`The second stage was only ${rpm.toFixed(0)} rpm — less accurate.`));
      out.push(L(`סה"כ תיקון (STFT+LTFT) — בסרק: ${ltr(`B1 ${sg(i1)}%`+(i2!==null?`, B2 ${sg(i2)}%`:""))} · ב-2500: ${ltr(`B1 ${sg(h1)}%`+(h2!==null?`, B2 ${sg(h2)}%`:""))}`,`Total trim (STFT+LTFT) — idle: B1 ${sg(i1)}%${i2!==null?", B2 "+sg(i2)+"%":""} · 2500: B1 ${sg(h1)}%${h2!==null?", B2 "+sg(h2)+"%":""}`));
      const cls = (I,H) => I>10 && H<I-6 ? "vac" : I>10 && H>10 ? "lean" : I<-10 && H<-10 ? "rich" : I<-10 ? "richIdle" : I>10 ? "leanIdle" : "ok";
      const TXT = {
        vac:["bad","רזה בסרק ומשתפר בסל\"ד → דליפת ואקום: צינורות, אטם סעפת יניקה, PCV, בוסטר בלמים.","Lean at idle, better at rpm → vacuum leak: hoses, intake gasket, PCV, brake booster."],
        lean:["bad","רזה בכל הסל\"ד → אספקת דלק (משאבה, מסנן, וסת לחץ) או MAF שמודד פחות מדי.","Lean everywhere → fuel delivery (pump, filter, regulator) or a MAF reading too low."],
        rich:["bad","עשיר בכל הסל\"ד → Purge דולף, דלק בשמן, מזרקים דולפים, לחץ דלק גבוה או MAF שמודד יותר מדי.","Rich everywhere → leaking purge, fuel in the oil, leaking injectors, high fuel pressure or a MAF reading too high."],
        richIdle:["warn","עשיר בעיקר בסרק → הכי נפוץ: Purge דולף או דלק בשמן (משפיעים יותר בסרק). עשה את בדיקת ה-Purge.","Rich mainly at idle → most common: a leaking purge valve or fuel in the oil (both matter more at idle). Run the purge test."],
        leanIdle:["warn","רזה מעט בסרק → בדוק דליפות ואקום קטנות.","Slightly lean at idle → check for small vacuum leaks."],
        ok:["ok","התערובת תקינה בסרק ובסל\"ד (בתוך ±10%).","The mixture is fine at idle and at rpm (within ±10%)."] };
      const k1 = cls(i1,h1), k2 = i2!==null && h2!==null ? cls(i2,h2) : null; const lvs = [TXT[k1][0]];
      if(!k2 || k1===k2) out.push((k2?L("בשני הבנקים: ","Both banks: "):"")+L(TXT[k1][1],TXT[k1][2]));
      else { lvs.push(TXT[k2][0]); out.push("B1: "+L(TXT[k1][1],TXT[k1][2])); out.push("B2: "+L(TXT[k2][1],TXT[k2][2])); }
      let lvl = worst(lvs);
      if(k2 && (Math.abs(i1-i2)>10 || Math.abs(h1-h2)>10)){ lvl = lvl==="ok"?"warn":lvl; out.push(L("הבדל גדול בין הבנקים → בעיה בצד אחד: מזרק, דליפת ואקום או פליטה באותו צד, או חיישן A/F.","Big difference between banks → a one-side problem: injector, vacuum or exhaust leak on that side, or an A/F sensor.")); }
      return { lvl, lines:out };
    }
  },
  {
    id:"o2", ic:"🌡️", he:"תגובת חיישני החמצן", en:"Oxygen sensor response",
    dhe:"בודק שהחיישנים הקדמיים מגיבים מהר, ושהאחוריים רגועים (קטליזטור תקין). צריך מנוע חם.",
    den:"Checks the front sensors react quickly and the rear ones stay calm (good catalyst). Needs a warm engine.",
    steps:[
      { k:"do", he:"מנוע חם. החזק 2500 סל\"ד יציב.", en:"Warm engine. Hold a steady 2500 rpm." },
      { k:"watch", key:"hold", pids:["34","24","14","38","28","18","15","19","0C"], secs:12, he:"מודד ב-2500 סל\"ד...", en:"Measuring at 2500 rpm..." },
      { k:"do", he:"לחץ \"המשך\" ומיד שחרר את הדוושה בבת אחת (ניתוק דלק בהאטה).", en:"Tap \"Continue\" and immediately let go of the pedal (fuel cut on decel)." },
      { k:"watch", key:"decel", pids:["34","24","14","38","28","18","15","19","0C"], secs:6, he:"מודד בהאטה...", en:"Measuring on decel..." },
    ],
    judge(r, L){
      const out = [], lv = [];
      const cross = (arr,k,th) => { const v = nums(arr,k); let n=0; for(let i=1;i<v.length;i++) if((v[i-1]-th)*(v[i]-th)<0) n++; return v.length ? n : null; };
      for(const [bank, wb, nb, rear] of [["B1",["34","24"],"14","15"],["B2",["38","28"],"18","19"]]){
        const w = wb.find(p=>nums(r.hold,p).length);
        if(w){ const h = avg(r.hold,w), d = mx(r.decel,w); const okH = h>=0.95 && h<=1.05, okD = d!==null && d>=1.15; const l = okH && okD ? "ok" : (!okD ? "warn" : "warn"); lv.push(l);
          out.push(L(`A/F ${bank}: ב-2500 ${ltr("λ="+h.toFixed(3))}${okH?" ✓":" (רחוק מ-1)"} · בהאטה עד ${ltr("λ="+(d===null?"—":d.toFixed(2)))}${okD?" ✓ מגיב":" — תגובה איטית/חלשה"}`,`A/F ${bank}: at 2500 λ=${h.toFixed(3)}${okH?" ✓":" (far from 1)"} · on decel up to λ=${d===null?"—":d.toFixed(2)}${okD?" ✓ responds":" — slow/weak response"}`)); }
        else if(nums(r.hold,nb).length){ const n = cross(r.hold,nb,0.45), lo = mn(r.decel,nb); const okS = n>=3, okD = lo!==null && lo<0.2; const l = okS && okD ? "ok" : "warn"; lv.push(l);
          out.push(L(`O2 ${bank} קדמי: ${n} מעברים ב-12 שניות${okS?" ✓":" — מעט מדי, חיישן איטי"} · בהאטה ירד ל-${lo===null?"—":lo.toFixed(2)}V${okD?" ✓":" — לא ירד מתחת ל-0.2V"}`,`Front O2 ${bank}: ${n} switches in 12 s${okS?" ✓":" — too few, slow sensor"} · on decel dropped to ${lo===null?"—":lo.toFixed(2)}V${okD?" ✓":" — didn't drop below 0.2V"}`)); }
        if(nums(r.hold,rear).length){ const rn = cross(r.hold,rear,0.45), ra = avg(r.hold,rear), rd = mn(r.decel,rear);
          const busy = rn>=4; lv.push(busy?"warn":"ok");
          out.push(L(`O2 ${bank} אחורי: ממוצע ${ra.toFixed(2)}V, ${rn} מעברים${busy?" — קופץ כמו הקדמי → קטליזטור חלש":" ✓ יציב (קטליזטור עובד)"}${rd!==null && rd<0.3?" · מגיב בהאטה ✓":""}`,`Rear O2 ${bank}: average ${ra.toFixed(2)}V, ${rn} switches${busy?" — switching like the front → weak catalyst":" ✓ steady (catalyst working)"}${rd!==null && rd<0.3?" · responds on decel ✓":""}`)); }
      }
      if(!out.length) return { lvl:"na", lines:[L("הרכב לא מסר נתוני חיישני חמצן.","The car didn't report oxygen sensor data.")] };
      const rpm = avg(r.hold,"0C"); if(rpm!==null && rpm<2000) out.push(L("הסל\"ד היה נמוך מ-2000 — כדאי לחזור.","The rpm was below 2000 — worth repeating."));
      out.push(L("הדגימה היא כמה פעמים בשנייה, אז זו בדיקה גסה. מעבדה (אוסילוסקופ) מדויקת יותר.","Sampling is a few times a second, so this is a rough check. A scope is more precise."));
      return { lvl:worst(lv), lines:out };
    }
  },
  {
    id:"pedal", ic:"🦶", he:"דוושת גז ומצערת", en:"Accelerator pedal & throttle",
    dhe:"בודק שחיישני הדוושה עולים חלק עד הסוף, בלי קפיצות ונפילות (סיבה נפוצה לגמגום ולמצב חירום).",
    den:"Checks the pedal sensors rise smoothly all the way, with no jumps or dropouts (a common cause of hesitation and limp mode).",
    steps:[
      { k:"do", he:"מנוע כבוי, הצתה ON. בשלב הבא לחץ לאט על הדוושה עד הסוף ושחרר לאט — פעמיים.", en:"Engine off, ignition ON. Next, press the pedal slowly to the floor and release slowly — twice." },
      { k:"watch", key:"sweep", pids:["49","4A","5A","11","45","4C"], secs:12, he:"לחץ לאט עד הסוף ושחרר לאט...", en:"Press slowly to the floor, release slowly..." },
    ],
    judge(r, L){
      const out = [], lv = [];
      for(const [p,he,en] of [["49","דוושה D","Pedal D"],["4A","דוושה E","Pedal E"],["5A","דוושה יחסית","Relative pedal"],["11","מצערת","Throttle"]]){
        const v = nums(r.sweep,p); if(v.length<4) continue; const lo = Math.min(...v), hi = Math.max(...v);
        let glitch = 0; for(let i=2;i<v.length;i++){ const a=v[i-2], b=v[i-1], c=v[i]; if(Math.abs(b-a)>25 && Math.abs(c-b)>25 && Math.sign(b-a)!==Math.sign(c-b)) glitch++; }
        const range = hi-lo; const l = glitch ? "bad" : (p!=="11" && range<40) ? "warn" : "ok"; if(p!=="11") lv.push(l);
        out.push(L(`${he}: ${ltr(lo.toFixed(0)+"% → "+hi.toFixed(0)+"%")}`+(glitch?` — ${glitch} קפיצות/נפילות באות → חיישן שחוק או מגע רופף`:(p!=="11"&&range<40)?" — טווח קטן: לחצת עד הסוף?":" ✓ חלק"),`${en}: ${lo.toFixed(0)}% → ${hi.toFixed(0)}%`+(glitch?` — ${glitch} jumps/dropouts → worn sensor or loose contact`:(p!=="11"&&range<40)?" — small range: did you press to the floor?":" ✓ smooth")));
      }
      if(!out.length) return { lvl:"na", lines:[L("הרכב לא מסר נתוני דוושה או מצערת.","The car didn't report pedal or throttle data.")] };
      out.push(L("במצערת חשמלית, המצערת זזה עם מנוע כבוי רק בחלק מהרכבים.","With electronic throttle, the throttle only moves with the engine off on some cars."));
      return { lvl:worst(lv), lines:out };
    }
  },
  {
    id:"warm", ic:"🔥", he:"התחממות ותרמוסטט", en:"Warm-up & thermostat",
    dhe:"מתחילים עם מנוע קר. האפליקציה עוקבת עד 20 דקות אחרי טמפרטורת המים ומזהה תרמוסטט תקוע פתוח או התחממות יתר.",
    den:"Start with a cold engine. The app follows coolant temperature for up to 20 minutes and spots a thermostat stuck open or overheating.",
    steps:[
      { k:"do", he:"מנוע קר (עמד כמה שעות). התנע. אפשר לעמוד בסרק או לנסוע רגיל.", en:"Cold engine (parked for a few hours). Start it. You can idle or drive normally." },
      { k:"watch", key:"warm", pids:["05","0C","0D"], secs:1200, until:v=>v["05"]>=88, he:"עוקב אחרי ההתחממות (נעצר ב-88°C)...", en:"Following the warm-up (stops at 88°C)..." },
    ],
    judge(r, L){
      const v = nums(r.warm,"05"); if(v.length<3) return { lvl:"na", lines:[L("לא התקבלה טמפרטורת מים.","No coolant temperature received.")] };
      const t0 = r.warm[0].t, start = v[0], top = Math.max(...v);
      if(start>60) return { lvl:"na", lines:[L(`המנוע התחיל חם (${start}°C) — הבדיקה צריכה מנוע קר.`,`The engine started warm (${start}°C) — the test needs a cold engine.`)] };
      const hit = r.warm.find(x=>x["05"]>=80); const mins = hit ? (hit.t-t0)/60000 : null; const total = (r.warm[r.warm.length-1].t-t0)/60000;
      const out = [L(`התחיל ב-${ltr(start+"°C")}, הגיע עד ${ltr(top+"°C")}`,`Started at ${start}°C, reached ${top}°C`)];
      if(top>105){ out.push(L("התחממות יתר! בדוק נוזל קירור, מאוורר, משאבת מים ותרמוסטט תקוע סגור.","Overheating! Check coolant level, fan, water pump and a thermostat stuck closed.")); return { lvl:"bad", lines:out }; }
      if(mins!==null){ out.push(L(`הגיע ל-80°C אחרי ${mins.toFixed(1)} דקות`,`Reached 80°C after ${mins.toFixed(1)} minutes`)); return { lvl: mins<=15 ? "ok" : "warn", lines: mins<=15 ? out : [...out, L("איטי — בסרק בחורף זה יכול להיות תקין; בנסיעה זה סימן לתרמוסטט פתוח.","Slow — at idle in winter that can be normal; while driving it hints at a thermostat stuck open.")] }; }
      if(total>=12 && top<75){ out.push(L(`אחרי ${total.toFixed(0)} דקות המנוע לא עבר 75°C → כנראה תרמוסטט תקוע פתוח (גם צריכת דלק עולה וחימום חלש).`,`After ${total.toFixed(0)} minutes the engine didn't pass 75°C → probably a thermostat stuck open (also higher fuel use and weak heater).`)); return { lvl:"bad", lines:out }; }
      out.push(L("הבדיקה נעצרה לפני שהמנוע התחמם — אין מסקנה.","The test stopped before the engine warmed up — no conclusion.")); return { lvl:"na", lines:out };
    }
  },
  {
    id:"maf", ic:"🌬️", he:"בדיקת חיישן MAF", en:"MAF sensor check",
    dhe:"בודק אם כמות האוויר שה-MAF מודד הגיונית לנפח המנוע — MAF מלוכלך או פגום מעוות את כל התערובת.",
    den:"Checks whether the air mass the MAF reports makes sense for the engine size — a dirty or faulty MAF skews the whole mixture.",
    steps:[
      { k:"ask", key:"engL", he:"נפח המנוע בליטרים (למשל 1.6 או 3.0)", en:"Engine size in litres (e.g. 1.6 or 3.0)", min:0.6, max:8 },
      { k:"do", he:"מנוע חם בסרק, מיזוג וצרכנים כבויים.", en:"Warm engine at idle, A/C and loads off." },
      { k:"watch", key:"idle", pids:["10","0C","0B","0F","05","33"], secs:10, he:"מודד בסרק...", en:"Measuring at idle..." },
      { k:"do", he:"החזק 2500 סל\"ד יציב.", en:"Hold a steady 2500 rpm." },
      { k:"watch", key:"rev", pids:["10","0C","0B","0F","05","33"], secs:10, he:"מודד ב-2500 סל\"ד...", en:"Measuring at 2500 rpm..." },
    ],
    judge(r, L){
      const Ls = r.engL, out = [], lv = [];
      if(!Ls) return { lvl:"na", lines:[L("לא הוזן נפח מנוע.","No engine size entered.")] };
      if(avg(r.idle,"10")===null) return { lvl:"na", lines:[L("הרכב לא מסר נתון MAF (יש רכבים שמודדים רק לחץ סעפת — MAP).","The car didn't report MAF (some cars only measure manifold pressure — MAP).")] };
      for(const [k,he,en,lo,hi] of [["idle","בסרק","at idle",0.8,1.8],["rev","ב-2500 סל\"ד","at 2500 rpm",2.2,5.5]]){
        const maf = avg(tail(r[k]),"10"), rpm = avg(tail(r[k]),"0C"), map = avg(tail(r[k]),"0B"), iat = avg(tail(r[k]),"0F"); if(maf===null || rpm===null) continue;
        if(k==="rev" && rpm<2000){ out.push(L(`הסל"ד היה רק ${rpm.toFixed(0)} — השלב השני לא נשפט.`,`Only ${rpm.toFixed(0)} rpm — the second stage wasn't judged.`)); continue; }
        if(map!==null && map>15){ // enough data for a real calculation: volumetric efficiency against manifold density
          const rho = 1.2*(map/101.3)*(293/((iat??20)+273)); const ve = maf/(Ls*rpm/120*rho)*100; const l = ve>=60 && ve<=105 ? "ok" : (ve>=50 && ve<=115 ? "warn" : "bad"); lv.push(l);
          out.push(L(`${he}: ${ltr(maf.toFixed(1)+" g/s")} · יעילות נפחית מחושבת ${ltr(ve.toFixed(0)+"%")} — `+(l==="ok"?"הגיוני ✓":ve<60?"נמוך: ה-MAF מודד פחות מדי (מלוכלך) או דליפת אוויר אחריו":"גבוה: ה-MAF מודד יותר מדי"),`${en}: ${maf.toFixed(1)} g/s · calculated volumetric efficiency ${ve.toFixed(0)}% — `+(l==="ok"?"plausible ✓":ve<60?"low: the MAF under-reads (dirty) or air leaks in after it":"high: the MAF over-reads")));
        } else { const per = maf/Ls; const l = per>=lo && per<=hi ? "ok" : (per>=lo*0.8 && per<=hi*1.2 ? "warn" : "bad"); lv.push(l);
          out.push(L(`${he}: ${ltr(maf.toFixed(1)+" g/s")} = ${ltr(per.toFixed(2))} לליטר (צפוי בערך ${ltr(lo+"–"+hi)}) — `+(l==="ok"?"הגיוני ✓":per<lo?"נמוך: MAF מלוכלך או דליפת אוויר אחריו":"גבוה: ה-MAF מודד יותר מדי, או עומס על המנוע"),`${en}: ${maf.toFixed(1)} g/s = ${per.toFixed(2)} per litre (roughly ${lo}–${hi} expected) — `+(l==="ok"?"plausible ✓":per<lo?"low: dirty MAF or an air leak after it":"high: the MAF over-reads, or the engine is loaded"))); }
      }
      const ect = avg(r.idle,"05"); if(ect!==null && ect<70) out.push(L("המנוע היה קר — סרק גבוה מעלה את הקריאה. חזור עם מנוע חם.","The engine was cold — fast idle raises the reading. Repeat when warm."));
      const baro = avg(r.idle,"33"); if(baro!==null && baro<92) out.push(L(`בגובה (${baro.toFixed(0)} kPa) האוויר דליל, אז קריאה מעט נמוכה היא תקינה.`,`At altitude (${baro.toFixed(0)} kPa) the air is thinner, so a slightly low reading is normal.`));
      out.push(L("זו בדיקת סבירות, לא כיול. אם התוצאה חריגה: נקה את ה-MAF בספריי ייעודי ובדוק את מסנן האוויר והצנרת.","This is a plausibility check, not a calibration. If it's off: clean the MAF with proper spray and check the air filter and ducting."));
      return { lvl:worst(lv), lines:out };
    }
  },
  {
    id:"balance", ic:"⚖️", he:"איזון צילינדרים (פספוסים)", en:"Cylinder balance (misfires)",
    dhe:"קורא את מונה הפספוסים של המחשב לפני ואחרי דקה של סרק וסל\"ד, ומראה איזה צילינדר מפספס עכשיו.",
    den:"Reads the ECU's misfire counters before and after a minute of idle and revs, and shows which cylinder is misfiring right now.",
    steps:[
      { k:"do", he:"מנוע חם בסרק.", en:"Warm engine at idle." },
      { k:"run", key:"m0", fn:"misfire", he:"קורא את מונה הפספוסים...", en:"Reading the misfire counters..." },
      { k:"watch", key:"idle", pids:["0C","05","04"], secs:40, he:"סרק — המחשב סופר פספוסים...", en:"Idle — the ECU is counting misfires..." },
      { k:"do", he:"החזק 2500 סל\"ד יציב.", en:"Hold a steady 2500 rpm." },
      { k:"watch", key:"rev", pids:["0C","05","04"], secs:20, he:"2500 סל\"ד — סופר...", en:"2500 rpm — counting..." },
      { k:"run", key:"m1", fn:"misfire", he:"קורא שוב את המונה...", en:"Reading the counters again..." },
    ],
    judge(r, L){
      const a = r.m0, b = r.m1;
      if(!Array.isArray(a) || !Array.isArray(b) || !b.length) return { lvl:"na", lines:[L("הרכב לא מדווח ספירת פספוסים לפי צילינדר (Mode 06), או שהוא לא CAN.","The car doesn't report per-cylinder misfire counts (Mode 06), or isn't CAN.")] };
      const d = b.map(x=>{ const p = a.find(y=>y.cyl===x.cyl); const now = x.cur||0, was = p ? (p.cur||0) : 0; return { cyl:x.cyl, n: now>=was ? now-was : now, avg:x.avg||0 }; });
      const tot = d.reduce((s,x)=>s+x.n,0); const out = [L(`פספוסים בזמן הבדיקה: ${ltr(d.map(x=>"#"+x.cyl+"="+x.n).join("  "))}`,`Misfires during the test: ${d.map(x=>"#"+x.cyl+"="+x.n).join("  ")}`)];
      const hist = d.filter(x=>x.avg>0); if(hist.length) out.push(L(`ממוצע 10 נסיעות אחרונות: ${ltr(hist.map(x=>"#"+x.cyl+"="+x.avg).join("  "))}`,`10-drive average: ${hist.map(x=>"#"+x.cyl+"="+x.avg).join("  ")}`));
      if(tot===0){ out.push(L("אין פספוסים — כל הצילינדרים עובדים שווה.","No misfires — all cylinders are pulling evenly.")); return { lvl: hist.length ? "warn" : "ok", lines: hist.length ? [...out, L("אבל בנסיעות קודמות נספרו פספוסים — התקלה מופיעה רק בתנאים מסוימים (קור, עומס).","But earlier drives did count misfires — the fault only shows in certain conditions (cold, load).")] : out }; }
      const top = [...d].sort((x,y)=>y.n-x.n)[0]; const single = top.n >= tot*0.7;
      if(single) out.push(L(`רוב הפספוסים בצילינדר ${top.cyl} → החלף מקום בין הסליל/המצת שלו לבין צילינדר אחר ועשה שוב את הבדיקה. אם הפספוס עבר איתו — מצאת את החלק. אם נשאר — מזרק או דחיסה.`,`Most misfires are on cylinder ${top.cyl} → swap its coil/plug with another cylinder and rerun the test. If the misfire moves with it — that's the part. If it stays — injector or compression.`));
      else out.push(L("הפספוסים מפוזרים בין כמה צילינדרים → סיבה משותפת: תערובת (דליפת ואקום, לחץ דלק), מצתים שחוקים או דלק גרוע.","Misfires are spread over several cylinders → a shared cause: mixture (vacuum leak, fuel pressure), worn plugs or bad fuel."));
      return { lvl: tot<=3 ? "warn" : "bad", lines:out };
    }
  },
];
