// ═══ Pre-purchase inspection: turn everything the scanner collected into a checklist with a score ═══
// Pure functions — no React, no I/O. L(he,en) picks the language.
// A scanner only sees the electronics: the score is "what the car's computers say", never a full verdict on the car.

export const PP_MANUAL = [
  ["leaks", "אין נזילות שמן / מים מתחת לרכב ובתא המנוע", "No oil / coolant leaks under the car or in the engine bay"],
  ["smoke", "אין עשן מהאגזוז (כחול, לבן או שחור)", "No exhaust smoke (blue, white or black)"],
  ["noise", "אין רעשים חריגים מהמנוע בסרק ובהאצה", "No unusual engine noises at idle or under acceleration"],
  ["oil", "שמן מנוע: מפלס תקין, לא חלבי, בלי ריח דלק", "Engine oil: level OK, not milky, no fuel smell"],
  ["coolant", "נוזל קירור: מפלס וצבע תקינים, בלי שמן", "Coolant: level and colour OK, no oil in it"],
  ["gear", "העברת הילוכים חלקה בנסיעת מבחן", "Smooth gear changes on a test drive"],
  ["brakes", "בלמים: בלי רעידות, בלי משיכה לצד", "Brakes: no vibration, no pulling to one side"],
  ["tyres", "צמיגים: שחיקה אחידה", "Tyres: even wear"],
  ["body", "פח וצבע אחידים, מרווחים שווים (אין סימני תאונה)", "Even paint and panel gaps (no accident signs)"],
  ["ac", "מיזוג מקרר ומחמם", "A/C cools and heats"],
];

const n = v => (typeof v === "number" && isFinite(v)) ? v : null;

export function ppScore(d, L){
  const items = []; const add = (lvl, title, detail, pts=0) => items.push({ lvl, title, detail, pts });
  const live = d.live || {}; const rpm = n(live["0C"]), ect = n(live["05"]); const running = rpm !== null && rpm > 400;

  // 1. identity: VIN on the registration vs the VIN the engine computer reports
  if(d.vin && d.regVin && d.regVin.length === 17){ const same = d.vin.toUpperCase() === d.regVin.toUpperCase();
    same ? add("ok", L("מספר שילדה תואם לרישוי","VIN matches the registration"), d.vin)
         : add("flag", L("מספר השילדה במחשב שונה מהרישוי","VIN in the ECU differs from the registration"), L(`במחשב: ${d.vin} · ברישוי: ${d.regVin}. ייתכן שמחשב המנוע הוחלף — או שזה לא הרכב שברישיון.`,`ECU: ${d.vin} · registration: ${d.regVin}. The engine computer may have been replaced — or this isn't the registered car.`), 30); }
  else add("na", L("השוואת מספר שילדה","VIN comparison"), d.vin ? L("לא נבחר רכב לפי מספר רישוי, אז אין למה להשוות. השווה ידנית לרישיון: ","No vehicle chosen by plate, so nothing to compare with. Compare by hand with the licence: ")+d.vin : L("הרכב לא מסר VIN (בחלק מהרכבים רק עם מנוע כבוי).","The car didn't give a VIN (on some cars only with the engine off)."));

  // 2. fault codes + warning light
  if(d.codes){ const st = d.codes.stored.length, pe = d.codes.pending.filter(c=>!d.codes.stored.includes(c)).length, pm = d.codes.permanent.filter(c=>!d.codes.stored.includes(c)).length;
    if(st+pe+pm === 0) add("ok", L("אין קודי תקלה במחשב המנוע","No fault codes in the engine computer"), "");
    else add(st ? "bad" : "warn", L(`קודי תקלה: ${st} שמורים, ${pe} ממתינים, ${pm} קבועים`,`Fault codes: ${st} stored, ${pe} pending, ${pm} permanent`), [...new Set([...d.codes.stored, ...d.codes.pending, ...d.codes.permanent])].map(c=>c+(d.codeTitle?" "+d.codeTitle(c):"")).join(" · "), Math.min(30, st*8 + pe*4 + pm*6)); }
  else add("na", L("קודי תקלה","Fault codes"), L("לא נקראו.","Not read."));
  if(d.ready){ d.ready.mil ? add("bad", L("נורית המנוע דולקת","The engine warning light is on"), "", 10) : add("ok", L("נורית המנוע כבויה","Engine warning light is off"), ""); }

  // 3. were the codes cleared just before the sale?
  const km = n(live["31"]), wu = n(live["30"]), mins = n(live["4E"]); const undone = d.ready ? d.ready.monitors.filter(m=>!m.done).length : null;
  if(km !== null || wu !== null){ const recent = (km !== null && km < 150) || (wu !== null && wu < 8);
    const txt = [km!==null ? L(`${km} ק"מ`,`${km} km`) : "", wu!==null ? L(`${wu} התחממויות`,`${wu} warm-ups`) : "", mins!==null ? L(`${Math.round(mins/60)} שעות מנוע`,`${Math.round(mins/60)} engine hours`) : ""].filter(Boolean).join(" · ");
    recent ? add("flag", L("הקודים נמחקו לאחרונה","Codes were cleared recently"), L(`מאז המחיקה: ${txt}. מחיקה ממש לפני מכירה מסתירה תקלות — הנורית נדלקת שוב רק אחרי עשרות ק"מ. שאל את המוכר למה, או בדוק שוב אחרי נסיעה של 100 ק"מ.`,`Since clearing: ${txt}. Clearing right before a sale hides faults — the light only returns after tens of km. Ask the seller why, or re-check after a 100 km drive.`), 15)
           : add("ok", L("הקודים לא נמחקו לאחרונה","Codes were not cleared recently"), L(`מאז המחיקה האחרונה: ${txt}`,`Since the last clear: ${txt}`)); }
  else add("na", L("מתי נמחקו הקודים","When codes were last cleared"), L("הרכב לא מדווח את הנתון הזה.","The car doesn't report this."));
  if(undone !== null){ undone ? add("warn", L(`${undone} בדיקות מוכנות לא הושלמו`,`${undone} readiness monitors not complete`), L("המחשב עוד לא סיים לבדוק את עצמו — סימן נוסף למחיקת קודים או לניתוק מצבר.","The computer hasn't finished testing itself — another sign of cleared codes or a disconnected battery."), 8) : add("ok", L("כל בדיקות המוכנות הושלמו","All readiness monitors complete"), ""); }
  const milKm = n(live["21"]); if(milKm) add("warn", L(`הרכב נסע ${milKm} ק"מ עם נורית דולקת`,`The car drove ${milKm} km with the warning light on`), "", 4);

  // 4. mixture (only meaningful warm and running)
  const t1 = n(live["06"]) !== null || n(live["07"]) !== null ? (n(live["06"])||0)+(n(live["07"])||0) : null, t2 = n(live["08"]) !== null || n(live["09"]) !== null ? (n(live["08"])||0)+(n(live["09"])||0) : null;
  if(t1 === null) add("na", L("תערובת דלק","Fuel mixture"), L("לא נקראו תיקוני דלק.","Fuel trims weren't read."));
  else if(!running || (ect !== null && ect < 70)) add("na", L("תערובת דלק","Fuel mixture"), L(`לא נשפט — צריך מנוע חם ועובד${ect!==null?` (עכשיו ${ect}°C)`:""}.`,`Not judged — needs a warm, running engine${ect!==null?` (now ${ect}°C)`:""}.`));
  else { const w = Math.max(Math.abs(t1), t2===null?0:Math.abs(t2)); const s = v => (v>0?"+":"")+v.toFixed(0)+"%"; const txt = "B1 "+s(t1)+(t2!==null?" · B2 "+s(t2):"");
    w > 20 ? add("bad", L("תערובת הדלק רחוקה מהתקין","Fuel mixture is far off"), txt+L(" — המחשב מתקן הרבה. תיקון עלול להיות יקר (מזרקים, MAF, דליפות)."," — the ECU is correcting heavily. The repair can be costly (injectors, MAF, leaks)."), 12)
    : w > 10 ? add("warn", L("תערובת הדלק לא מדויקת","Fuel mixture is a bit off"), txt, 5) : add("ok", L("תערובת הדלק תקינה","Fuel mixture is fine"), txt); }

  // 5. charging / battery, temperature
  const ev = n(live["42"]), bv = n(live.batt);
  if(running && (ev ?? bv) !== null){ const v = ev ?? bv; const src = ev !== null ? "" : L(" (נמדד במתאם, פחות מדויק)"," (measured at the adapter, less accurate)");
    (v < 13.2 || v > 15) ? add("warn", L("מתח הטעינה לא תקין","Charging voltage is off"), v.toFixed(1)+"V"+src, ev !== null ? 8 : 3) : add("ok", L("הטעינה תקינה","Charging is fine"), v.toFixed(1)+"V"+src); }
  else if(bv !== null) (bv < 12.2 ? add("warn", L("מצבר חלש","Weak battery"), bv.toFixed(1)+"V", 4) : add("ok", L("מתח המצבר תקין","Battery voltage is fine"), bv.toFixed(1)+"V"));
  if(ect !== null && running && ect > 105) add("bad", L("המנוע חם מדי","The engine is running too hot"), ect+"°C", 15);

  // 6. misfires
  if(Array.isArray(d.mis) && d.mis.length){ const cur = d.mis.reduce((a,m)=>a+(m.cur||0),0), av = d.mis.reduce((a,m)=>a+(m.avg||0),0); const list = d.mis.filter(m=>(m.cur||0)+(m.avg||0)>0).map(m=>"#"+m.cyl+"="+((m.cur||0)+(m.avg||0))).join(" ");
    cur+av === 0 ? add("ok", L("אין פספוסי הצתה","No misfires"), "") : (cur+av) <= 5 ? add("warn", L("מעט פספוסי הצתה","A few misfires"), list, 3) : add("bad", L("פספוסי הצתה","Misfires"), list, 10); }
  else add("na", L("פספוסי הצתה","Misfires"), L("הרכב לא מדווח ספירה לפי צילינדר.","The car doesn't report per-cylinder counts."));

  // 7. the computer's own tests
  if(Array.isArray(d.m06) && d.m06.length){ const f = d.m06.filter(r=>!r.pass).length, w = d.m06.filter(r=>r.near).length, nr = d.m06.filter(r=>r.norun).length;
    f ? add("bad", L(`${f} בדיקות עצמיות של המחשב נכשלו`,`${f} of the computer's own tests failed`), "", Math.min(20, f*8)) : w ? add("warn", L(`${w} בדיקות עצמיות עברו בקושי`,`${w} self-tests only just passed`), L("סימן מוקדם לחלק שמתקרב לסוף דרכו (חיישן חמצן, קטליזטור).","An early sign of a part nearing the end of its life (O2 sensor, catalyst)."), Math.min(8, w*2)) : add("ok", L("הבדיקות העצמיות של המחשב עברו","The computer's own tests passed"), "");
    if(nr > d.m06.length/3) add("warn", L(`${nr} בדיקות עצמיות עוד לא רצו`,`${nr} self-tests haven't run yet`), L("מתאים לקודים שנמחקו לא מזמן.","Fits codes that were cleared not long ago."), 0); }
  else add("na", L("בדיקות עצמיות של המחשב","The computer's own tests"), L("לא זמין ברכב הזה.","Not available on this car."));

  // 8. the other computers
  const ecus = d.ecus || [];
  if(ecus.length){ const read = ecus.filter(e=>Array.isArray(e.dtcs)); const codes = read.flatMap(e=>e.dtcs.map(x=>e.name+": "+x.code));
    if(!read.length) add("na", L("קודים בשאר המחשבים","Codes in the other computers"), L(`${ecus.length} מחשבים ענו, אבל אף אחד לא מסר קודים בשיטות שהאפליקציה מכירה.`,`${ecus.length} computers answered, but none gave codes by the methods the app knows.`));
    else if(codes.length) add("bad", L(`${codes.length} קודים במחשבים אחרים (ABS, כריות, מרכב...)`,`${codes.length} codes in other computers (ABS, airbags, body...)`), codes.join(" · "), Math.min(15, codes.length*4));
    else add("ok", L(`אין קודים ב-${read.length} מחשבים נוספים שנקראו`,`No codes in ${read.length} other computers that were read`), read.length < ecus.length ? L(`${ecus.length-read.length} מחשבים לא מסרו קודים.`,`${ecus.length-read.length} computers gave no code data.`) : "");
    const bad = ecus.filter(e=>e.vin && d.vin && e.vin.length>=11 && e.vin !== d.vin);
    if(bad.length) add("flag", L("מספר שילדה שונה באחד המחשבים","A different VIN in one of the computers"), bad.map(e=>e.name+": "+e.vin).join(" · ")+L(" — מחשב שהוחלף או הגיע מרכב אחר."," — a unit that was replaced or came from another car."), 20); }
  else add("na", L("שאר מחשבי הרכב","The car's other computers"), L("לא נמצאו או לא נסרקו.","Not found or not scanned."));

  // 9. odometer
  const dash = parseInt(String(d.dash||"").replace(/\D/g,""),10);
  if(Array.isArray(d.odo) && d.odo.length){ const spread = Math.max(...d.odo)-Math.min(...d.odo);
    if(spread > 1000) add("flag", L("המחשבים לא מסכימים על הק\"מ","The computers disagree on mileage"), d.odo.map(x=>x.toLocaleString()).join(" / ")+" km", 20);
    if(dash > 0){ const diff = Math.max(...d.odo.map(x=>Math.abs(x-dash))); diff > 1000 ? add("flag", L("הק\"מ בלוח השעונים שונה ממה שהמחשבים זוכרים","Dashboard mileage differs from what the computers remember"), L(`לוח: ${dash.toLocaleString()} · מחשבים: ${d.odo.map(x=>x.toLocaleString()).join(" / ")} — חשד להחזרת מונה.`,`Dash: ${dash.toLocaleString()} · computers: ${d.odo.map(x=>x.toLocaleString()).join(" / ")} — possible rollback.`), 25) : add("ok", L("הק\"מ בלוח תואם למחשבים","Dashboard mileage matches the computers"), dash.toLocaleString()+" km"); }
    else if(spread <= 1000) add("ok", L("המחשבים מסכימים על הק\"מ","The computers agree on mileage"), d.odo[0].toLocaleString()+" km"+L(" — הקלד את הק\"מ שבלוח כדי להשוות."," — type the dashboard mileage to compare.")); }
  else add("na", L("אימות ק\"מ","Mileage check"), L("הרכב לא מוסר ק\"מ דרך OBD (רוב הרכבים שלפני 2019). השווה מול היסטוריית הטיפולים ורישומי הטסט.","The car doesn't report mileage over OBD (most cars before 2019). Compare with service history and inspection records."));

  // 10. what the eyes and ears found
  const man = d.manual || {}; const badM = PP_MANUAL.filter(([id])=>man[id]==="bad"), okM = PP_MANUAL.filter(([id])=>man[id]==="ok");
  if(badM.length) add("bad", L(`${badM.length} בעיות בבדיקה הידנית`,`${badM.length} problems in the hands-on check`), badM.map(x=>L(x[1],x[2])).join(" · "), Math.min(24, badM.length*6));
  if(okM.length && !badM.length) add("ok", L(`הבדיקה הידנית: ${okM.length} מתוך ${PP_MANUAL.length} תקינים`,`Hands-on check: ${okM.length} of ${PP_MANUAL.length} OK`), "");

  const lost = items.reduce((a,i)=>a+i.pts,0); const score = Math.max(0, Math.min(100, 100-lost));
  const flags = items.filter(i=>i.lvl==="flag").length, checked = items.filter(i=>i.lvl!=="na").length;
  const grade = flags ? "flag" : score >= 85 ? "good" : score >= 65 ? "mid" : "low";
  return { score, items, flags, checked, total:items.length, grade };
}

export const ppGradeText = (g, L) => ({ flag:L("יש דגלים אדומים — לא לקנות לפני בירור","Red flags — don't buy before clearing them up"), good:L("לפי הסורק: מצב טוב","By the scanner: good condition"), mid:L("לפי הסורק: יש דברים לבדוק","By the scanner: some things to check"), low:L("לפי הסורק: בעיות משמעותיות — לבדוק במוסך","By the scanner: significant problems — have a garage check") })[g];
