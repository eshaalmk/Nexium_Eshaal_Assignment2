export const urduDictionary: Record<string, string> = {
  // Common Verbs & Connectors
  "the": "یہ",
  "is": "ہے",
  "was": "تھا",
  "are": "ہیں",
  "be": "ہونا",
  "to": "کرنے",
  "a": "ایک",
  "an": "ایک",
  "and": "اور",
  "or": "یا",
  "of": "کا",
  "in": "میں",
  "on": "پر",
  "with": "کے ساتھ",
  "for": "کے لیے",
  "by": "کی طرف سے",
  "from": "سے",
  "as": "کے طور پر",
  "that": "کہ",
  "this": "یہ",
  "it": "یہ",
  "at": "پر",
  "about": "کے بارے میں",
  "but": "لیکن",
  "not": "نہیں",
  "can": "سکتا ہے",
  "will": "کرے گا",
  "has": "ہے",
  "have": "ہیں",
  "more": "زیادہ",
  "less": "کم",
  "all": "تمام",
  "most": "زیادہ تر",
  "some": "کچھ",
  "such": "ایسا",
  "very": "بہت",
  "also": "بھی",

  // Technical Terms
  "javascript": "جاوا اسکرپٹ",
  "programming": "پروگرامنگ",
  "language": "زبان",
  "function": "فنکشن",
  "variable": "ویری ایبل",
  "framework": "فریم ورک",
  "developer": "ڈیولپر",
  "application": "ایپلیکیشن",
  "web": "ویب",
  "frontend": "فرنٹ اینڈ",
  "backend": "بیک اینڈ",
  "code": "کوڈ",
  "coding": "کوڈنگ",
  "software": "سافٹ ویئر",
  "engineer": "انجینئر",
  "stack": "اسٹیک",
  "fullstack": "فل اسٹیک",
  "script": "سکرپٹ",
  "json": "جیسن",
  "api": "اے پی آئی",
  "database": "ڈیٹا بیس",
  "mongodb": "مونگو ڈی بی",
  "nodejs": "نوڈ جے ایس",
  "react": "ری ایکٹ",
  "component": "کمپوننٹ",
  "server": "سرور",
  "client": "کلائنٹ",
  "request": "درخواست",
  "response": "جواب",
  "fetch": "لانا",
  "parse": "تجزیہ کرنا",

  // Educational & Contextual
  "learn": "سیکھیں",
  "start": "شروع کریں",
  "course": "کورس",
  "tutorial": "سبق",
  "guide": "رہنما",
  "example": "مثال",
  "introduction": "تعارف",
  "summary": "خلاصہ",
  "explanation": "وضاحت",

  // Misc
  "free": "مفت",
  "tools": "اوزار",
  "easy": "آسان",
  "powerful": "طاقتور",
  "popular": "مقبول",
  "open": "کھلا",
  "source": "ذریعہ",
  "community": "کمیونٹی",
  "platform": "پلیٹ فارم",

  // Extra fallback
  "you": "آپ",
  "we": "ہم",
  "they": "وہ",
  "your": "آپ کا",
  "our": "ہمارا",
  "their": "ان کا",
};


export function translateToUrdu(text: string): string {
  return text.split(" ").map(word => {
    const match = word.match(/^(\w+)([.,!?:;]*)$/i); // separate punctuation
    if (!match) return word;

    const [ , rawWord, punctuation ] = match;
    const translated = urduDictionary[rawWord.toLowerCase()];
    return translated ? translated + punctuation : word;
  }).join(" ");
}
