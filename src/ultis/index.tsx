export const removeChac = (s: string) => {
  return s.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
};

export const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const formatColorText = (textColor: string) => {
  if (textColor && textColor[0] === '#') return textColor.slice(1).toUpperCase();

  return textColor?.toUpperCase();
};

export const formatTexttoColor = (text: string) => {
  if (text[0] === '#') return text;

  return `#${text}`;
};

export const percentToHex = p => {
  const intValue = Math.round((p / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
};

export const rgbToHex = rgb => {
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb
    .substr(4)
    .split(')')[0]
    .split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return '#' + r + g + b;
};

export const getBlobFromUrl = myImageUrl => {
  return new Promise((resolve, reject) => {
    fetch(myImageUrl)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        let objectURL = URL.createObjectURL(blob);
        let myImage = new Image();
        myImage.src = objectURL;
        myImage.onload = () => {
          resolve(objectURL);
        };
      });
  });
};
