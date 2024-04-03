function getRandomHexColor() {
  // 生成六位的隨機16進制數字
  const randomHex = Math.floor(Math.random() * 16777215).toString(16);

  // 補零到六位
  const hexColor = "#" + "0".repeat(6 - randomHex.length) + randomHex;

  return hexColor;
}

export default getRandomHexColor;