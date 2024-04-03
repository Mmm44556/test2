
function decodeBase64(base64Encoded) {
  const decodedData = atob(base64Encoded);
  const decoder = new TextDecoder();
  const decodedJSON = decoder.decode(new Uint8Array([...decodedData].map(char => char.charCodeAt(0))));
  const parsedData = JSON.parse(decodedJSON);
  return parsedData;
  
}

export { decodeBase64 }