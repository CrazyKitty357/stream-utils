// Encoder Function
function toneEncode(input) {
  const regex = /:t(\d+) (\d+)/g;
  const toneMap = {};
  const lengthMap = {};
  const toneList = [];
  const lengthList = [];
  let toneIndex = 0;
  let lengthIndex = 0;
  let tokens = [];
  let toneMapString = "";
  let lengthMapString = "";

  let match;
  while ((match = regex.exec(input)) !== null) {
    const tone = match[1];
    const length = match[2];

    if (!toneMap[tone]) {
      toneMap[tone] = String.fromCharCode(65 + toneIndex);
      toneList.push(tone);
      toneIndex++;
    }

    if (!lengthMap[length]) {
      lengthMap[length] = String.fromCharCode(97 + lengthIndex);
      lengthList.push(length);
      lengthIndex++;
    }

    tokens.push(`$${toneMap[tone]}${lengthMap[length]}`);
  }

  // Create the tone map string in correct order: Character -> Tone
  toneMapString = toneList.map((tone) => `${toneMap[tone]}${tone}`).join("");

  lengthMapString = lengthList
    .map((length) => `${lengthMap[length]}${length}`)
    .join("");

  return {
    compressed: `[${tokens.join("")}]%${toneMapString}!${lengthMapString}`,
    toneMap,
    lengthMap,
  };
}

// Decoder Function
function toneDecode(compressed) {
  const [compressedData, toneMapStringWithLength] = compressed.split("%");
  const [toneMapString, lengthMapString] = toneMapStringWithLength.split("!");

  const toneMap = {};
  let i = 0;
  while (i < toneMapString.length) {
    const char = toneMapString[i];
    i++;
    let tone = "";
    while (i < toneMapString.length && !isNaN(Number(toneMapString[i]))) {
      tone += toneMapString[i];
      i++;
    }
    toneMap[char] = tone;
  }

  const lengthMap = {};
  let j = 0;
  while (j < lengthMapString.length) {
    const char = lengthMapString[j];
    j++;
    let length = "";
    while (j < lengthMapString.length && !isNaN(Number(lengthMapString[j]))) {
      length += lengthMapString[j];
      j++;
    }
    lengthMap[char] = length;
  }

  const reverseToneMap = toneMap; // Character -> Tone (direct mapping)
  const reverseLengthMap = lengthMap; // Character -> Length (direct mapping)

  const regex = /\$([A-Za-z])([a-z])?/g;
  let output = [];

  let match;
  while ((match = regex.exec(compressedData)) !== null) {
    const toneChar = match[1];
    const lengthChar = match[2];

    const tone = reverseToneMap[toneChar];
    const length = reverseLengthMap[lengthChar];

    if (tone && length) {
      output.push(`:t${tone} ${length}`);
    }
  }

  return `[${output.join(" ")}]`;
}

export { toneEncode, toneDecode };

// Example Usage
// const input = `[:t932 250 :t987 250 :t1108 125 :t1108 125 :t1108 125]`;
//
// const { compressed, toneMap, lengthMap } = compactEncode(input);
// console.log("Compressed:", compressed);
//
// const decoded = compactDecode(compressed);
// console.log("Decoded:", decoded);
