// Hebrew names for the most common maker-specific values (the source database, OBDb, is English only).
// mkHe(name) returns a Hebrew name, or "" when the name isn't covered — the UI then shows the English name.
const D = {
  "odometer":"מד מרחק (ק\"מ)", "vehicle speed":"מהירות הרכב", "engine speed":"סל\"ד מנוע", "engine rpm":"סל\"ד מנוע",
  "front right wheel speed":"מהירות גלגל קדמי ימני", "front left wheel speed":"מהירות גלגל קדמי שמאלי", "rear right wheel speed":"מהירות גלגל אחורי ימני", "rear left wheel speed":"מהירות גלגל אחורי שמאלי",
  "front left tire pressure":"לחץ אוויר, קדמי שמאלי", "front right tire pressure":"לחץ אוויר, קדמי ימני", "rear left tire pressure":"לחץ אוויר, אחורי שמאלי", "rear right tire pressure":"לחץ אוויר, אחורי ימני",
  "front left tire temperature":"חום צמיג, קדמי שמאלי", "front right tire temperature":"חום צמיג, קדמי ימני", "rear left tire temperature":"חום צמיג, אחורי שמאלי", "rear right tire temperature":"חום צמיג, אחורי ימני",
  "steering wheel angle":"זווית הגה", "steering angle":"זווית הגה", "steering shaft torque":"מומנט על ציר ההגה", "yaw rate":"קצב סבסוב", "yaw rate signal":"קצב סבסוב",
  "lateral acceleration":"תאוצה צידית", "longitudinal acceleration":"תאוצה אורכית", "lateral g":"תאוצה צידית (G)", "longitudinal g":"תאוצה אורכית (G)",
  "engine oil temperature":"חום שמן מנוע", "oil temperature":"חום שמן", "engine oil pressure":"לחץ שמן מנוע", "oil pressure":"לחץ שמן",
  "coolant temperature":"חום נוזל קירור", "engine coolant temperature":"חום נוזל קירור", "initial engine coolant temperature":"חום נוזל קירור בהתנעה", "cylinder head temperature":"חום ראש מנוע",
  "intake air temperature":"חום אוויר נכנס", "inlet air temperature":"חום אוויר נכנס", "initial intake air temperature":"חום אוויר נכנס בהתנעה", "manifold air temperature":"חום אוויר בסעפת", "charge air temperature":"חום אוויר דחוס",
  "ambient air temperature":"חום אוויר חיצוני", "ambient temperature":"חום חיצוני", "outside temperature":"חום חיצוני", "outside air temperature":"חום אוויר חיצוני", "cabin temperature":"חום בתא הנוסעים", "in car temperature":"חום בתא הנוסעים", "evaporator temperature":"חום המאייד (מזגן)",
  "12v battery voltage":"מתח מצבר 12V", "battery voltage":"מתח מצבר", "auxiliary battery voltage":"מתח מצבר עזר", "control module voltage":"מתח במחשב", "12v battery current":"זרם מצבר 12V", "battery current":"זרם מצבר", "12v battery temperature":"חום מצבר 12V", "battery temperature":"חום מצבר", "12v battery state of charge":"מצב טעינה, מצבר 12V", "generator current":"זרם אלטרנטור",
  "hv battery current":"זרם סוללת מתח גבוה", "hv battery voltage":"מתח סוללת מתח גבוה", "hv battery temperature":"חום סוללת מתח גבוה", "hv battery charge":"טעינת סוללת מתח גבוה", "hv battery charge, displayed":"טעינת סוללה (כפי שמוצג לנהג)", "hv battery energy":"אנרגיה בסוללת מתח גבוה", "hv battery state of health":"בריאות סוללת מתח גבוה",
  "high voltage battery current":"זרם סוללת מתח גבוה", "high voltage battery voltage":"מתח סוללת מתח גבוה", "high voltage battery intake air temperature":"חום אוויר קירור לסוללה", "state of charge":"מצב טעינה", "battery state of charge":"מצב טעינת הסוללה", "highest cell voltage":"מתח התא הגבוה ביותר", "lowest cell voltage":"מתח התא הנמוך ביותר",
  "motor rpm":"סל\"ד מנוע חשמלי", "motor speed":"מהירות מנוע חשמלי", "drive motor speed":"מהירות מנוע ההנעה", "motor torque":"מומנט מנוע חשמלי",
  "fuel temperature":"חום דלק", "fuel level":"מפלס דלק", "fuel level input":"מפלס דלק", "fuel level, volume":"כמות דלק במיכל", "fuel tank level":"מפלס מיכל הדלק", "fuel remaining":"דלק שנותר", "fuel tank pressure":"לחץ במיכל הדלק",
  "fuel rail pressure":"לחץ במסילת הדלק", "fuel pressure":"לחץ דלק", "fuel flow":"ספיקת דלק", "engine fuel rate":"צריכת דלק רגעית", "fuel pump duty cycle":"מחזור פעולה של משאבת הדלק",
  "fuel trim, short term":"תיקון דלק קצר", "fuel trim, long term":"תיקון דלק ארוך", "target air-fuel ratio":"יחס אוויר-דלק רצוי", "injector pulse width":"רוחב פולס מזרק", "fuel injection timing":"תזמון הזרקה",
  "transmission fluid temperature":"חום שמן תיבה", "transmission temperature":"חום תיבת הילוכים", "automatic transmission fluid temperature":"חום שמן תיבה אוטומטית", "transmission oil temperature":"חום שמן תיבה", "transmission temperature, pan":"חום שמן תיבה (אגן)", "transmission temperature, torque converter":"חום שמן תיבה (ממיר מומנט)",
  "gear":"הילוך", "current gear":"הילוך נוכחי", "transmission gear":"הילוך", "gear, engaged":"הילוך משולב", "transmission gear ratio":"יחס העברה", "turbine speed":"מהירות טורבינה (תיבה)", "input shaft speed":"מהירות ציר כניסה", "output shaft speed":"מהירות ציר יציאה", "transmission output shaft speed":"מהירות ציר יציאה של התיבה", "torque converter slip":"החלקת ממיר מומנט", "torque converter lock-up":"נעילת ממיר מומנט",
  "accelerator pedal position":"מצב דוושת גז", "accelerator position":"מצב דוושת גז", "throttle position":"מצב מצערת", "brake switch":"מתג בלם", "brake pedal":"דוושת בלם", "brake pedal position":"מצב דוושת בלם", "brake pedal stroke":"מהלך דוושת בלם", "brake pressure":"לחץ בלמים", "brake booster pressure":"לחץ במגבר הבלם", "parking brake":"בלם חניה", "stop light":"אור בלם",
  "barometric pressure":"לחץ ברומטרי", "manifold pressure":"לחץ בסעפת", "boost pressure":"לחץ טורבו", "boost pressure, actual":"לחץ טורבו בפועל", "throttle inlet pressure":"לחץ בכניסת המצערת", "mass air flow":"זרימת אוויר (MAF)",
  "calculated load":"עומס מחושב", "calculated engine load":"עומס מנוע מחושב", "engine load":"עומס מנוע", "engine load, actual":"עומס מנוע בפועל", "vehicle load":"עומס", "engine torque":"מומנט מנוע", "actual engine torque":"מומנט מנוע בפועל", "requested engine torque":"מומנט מנוע מבוקש", "engine reference torque":"מומנט ייחוס של המנוע", "actual engine percent torque":"מומנט מנוע בפועל (%)",
  "ignition advance":"הקדמת הצתה", "ignition timing advance":"הקדמת הצתה", "knock adjust":"תיקון נקישות", "knock feedback":"משוב נקישות", "knock correct learn value":"ערך נלמד לתיקון נקישות",
  "catalyst temperature":"חום ממיר קטליטי", "catalyst temperature b1s1":"חום ממיר, בנק 1 חיישן 1", "catalyst temperature b1s2":"חום ממיר, בנק 1 חיישן 2", "catalyst temperature b2s1":"חום ממיר, בנק 2 חיישן 1", "catalyst temperature b2s2":"חום ממיר, בנק 2 חיישן 2",
  "exhaust gas recirculation temperature":"חום EGR", "exhaust gas recirculation duty cycle":"מחזור פעולה של EGR", "exhaust gas recirculation step position":"מצב שסתום EGR (צעדים)", "evaporative purge":"שסתום אדי דלק (Purge)", "evap purge duty":"מחזור פעולה של ה-Purge", "evaporative purge duty":"מחזור פעולה של ה-Purge", "evaporative purge vacuum switching valve on":"שסתום ה-Purge פועל", "purge cut vacuum switching valve duty":"מחזור פעולה של שסתום ניתוק ה-Purge",
  "diesel particulate filter differential pressure":"הפרש לחצים במסנן החלקיקים", "diesel particulate filter delta pressure":"הפרש לחצים במסנן החלקיקים", "diesel particulate filter soot":"פיח במסנן החלקיקים", "diesel particulate filter accumulation level":"רמת הצטברות במסנן החלקיקים",
  "air conditioning pressure":"לחץ מזגן", "a/c compressor pressure":"לחץ מדחס מזגן", "air conditioning compressor pressure":"לחץ מדחס מזגן", "a/c refrigerant pressure":"לחץ גז מזגן", "a/c compressor":"מדחס מזגן", "air conditioning compressor":"מדחס מזגן", "a/c compressor, state":"מצב מדחס מזגן",
  "engine run time":"זמן פעולת מנוע", "time since engine start":"זמן מאז התנעה", "engine starting time":"משך ההתנעה", "cruise control speed":"מהירות בקרת שיוט", "previous trip distance":"מרחק הנסיעה הקודמת", "distance with mil":"מרחק עם נורית מנוע דולקת", "distance traveled with mil on":"מרחק עם נורית מנוע דולקת", "distance since dtc clear":"מרחק מאז מחיקת קודים", "warm-ups since dtc clear":"התחממויות מאז מחיקת קודים",
  "mil":"נורית מנוע", "number of emission dtc":"מספר קודי פליטה", "fuel cut":"ניתוק דלק", "idle control":"בקרת סרק", "misfire rpm":"סל\"ד בזמן פספוס", "misfire load":"עומס בזמן פספוס", "lock status":"מצב נעילה", "key cycle":"מחזורי התנעה",
  "short ft b1s1":"תיקון דלק קצר, בנק 1", "long ft b1s1":"תיקון דלק ארוך, בנק 1", "short ft b2s1":"תיקון דלק קצר, בנק 2", "long ft b2s1":"תיקון דלק ארוך, בנק 2", "rear o2 voltage":"מתח חיישן חמצן אחורי",
};
const P = [
  [/^cylinder #?(\d+) misfire count$/, "פספוסים בצילינדר $1"], [/^misfire count,? cylinder #?(\d+)$/, "פספוסים בצילינדר $1"],
  [/^injection volume.*cylinder #?(\d+)$/, "נפח הזרקה, צילינדר $1"], [/^injection duration for cylinder #?(\d+)$/, "זמן הזרקה, צילינדר $1"],
  [/^engine speed of cylinder #?(\d+)$/, "מהירות מנוע בצילינדר $1"], [/^ignition correction, cylinder #?(\d+)$/, "תיקון הצתה, צילינדר $1"],
  [/^total fuel trim,? bank (\d)$/, "תיקון דלק כולל, בנק $1"], [/^short[- ]term fuel trim,? bank (\d)$/, "תיקון דלק קצר, בנק $1"], [/^long[- ]term fuel trim,? bank (\d)$/, "תיקון דלק ארוך, בנק $1"],
  [/^oxygen sensor voltage, bank (\d) sensor (\d)$/, "מתח חיישן חמצן, בנק $1 חיישן $2"], [/^af lambda, bank (\d) sensor (\d)$/, "למבדה, בנק $1 חיישן $2"],
  [/^exhaust gas temperature (\d)$/, "חום גזי פליטה $1"], [/^tire pressure, wheel (\d)$/, "לחץ אוויר, גלגל $1"], [/^intake air temperature (\d)$/, "חום אוויר נכנס $1"],
  [/^hv battery block (\d+) voltage$/, "מתח בלוק $1 בסוללה"], [/^(?:hv battery )?cell (\d+) voltage$/, "מתח תא $1 בסוללה"], [/^(?:hv )?battery module (\d+) temperature$/, "חום מודול $1 בסוללה"],
  [/^variable valve timing aim angle (\d)$/, "זווית רצויה של תזמון השסתומים $1"], [/^idle spark advance control (\d)$/, "בקרת הקדמת הצתה בסרק $1"],
];
const SUF = [
  [/,? variant (\d+)$/, " (גרסה $1)"], [/,? v(\d+)$/, " (גרסה $1)"], [/, alternate$/, " (חלופי)"], [/, raw count$/, " (ערך גולמי)"], [/, raw$/, " (ערך גולמי)"],
  [/, actual$/, " (בפועל)"], [/, (?:desired|target|commanded)$/, " (רצוי)"], [/ sensor voltage$/, " — מתח החיישן"], [/, bcm$/, " (מחשב מרכב)"],
];
const cache = {};
export function mkHe(name){
  if(name in cache) return cache[name];
  let n = String(name||"").toLowerCase().replace(/_7e\d$/, "").trim(); let tail = "";
  for(let pass=0; pass<2; pass++){
    if(D[n]) return (cache[name] = D[n] + tail);
    for(const [re, he] of P){ const m = n.match(re); if(m) return (cache[name] = he.replace(/\$(\d)/g, (_, i) => m[i]) + tail); }
    let hit = false; for(const [re, he] of SUF){ const m = n.match(re); if(m){ tail = he.replace("$1", m[1]||"") + tail; n = n.replace(re, "").trim(); hit = true; break; } }
    if(!hit) break;
  }
  return (cache[name] = (D[n] ? D[n] + tail : ""));
}
