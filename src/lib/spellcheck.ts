// Common misspellings → corrections
const corrections: Record<string, string> = {
  teh: "the", hte: "the", thier: "their", recieve: "receive",
  beleive: "believe", seperate: "separate", occured: "occurred",
  untill: "until", begining: "beginning", definately: "definitely",
  goverment: "government", knowlege: "knowledge", libary: "library",
  occurance: "occurrence", persue: "pursue", privelege: "privilege",
  publically: "publicly", recomend: "recommend", relevent: "relevant",
  rember: "remember", responsibilty: "responsibility", succesful: "successful",
  tommorow: "tomorrow", tomarrow: "tomorrow", truely: "truly",
  wich: "which", wont: "won't", dont: "don't", cant: "can't",
  doesnt: "doesn't", isnt: "isn't", wasnt: "wasn't", arent: "aren't",
  asignment: "assignment", assigment: "assignment", assinment: "assignment",
  chapeter: "chapter", chpater: "chapter", excercise: "exercise",
  examn: "exam", exma: "exam", lecutrer: "lecturer", lecturar: "lecturer",
  submision: "submission", submitt: "submit", dealine: "deadline",
  deaadline: "deadline", studing: "studying", studdy: "study",
  qustion: "question", questoin: "question", anwser: "answer",
  answr: "answer", infomation: "information", informaton: "information",
};

export function correctSpelling(text: string): { corrected: string; hasChanges: boolean } {
  const words = text.split(/(\s+)/);
  let hasChanges = false;

  const correctedWords = words.map((token) => {
    // preserve whitespace tokens
    if (/^\s+$/.test(token)) return token;

    const lower = token.toLowerCase().replace(/[^a-z']/g, "");
    if (corrections[lower]) {
      hasChanges = true;
      // preserve original capitalisation pattern
      const fix = corrections[lower];
      if (token[0] === token[0].toUpperCase()) {
        return fix.charAt(0).toUpperCase() + fix.slice(1);
      }
      return fix;
    }
    return token;
  });

  return { corrected: correctedWords.join(""), hasChanges };
}
