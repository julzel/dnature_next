const dataURLToBlob = (dataUrl) => {
  if (typeof dataUrl !== 'string' || !/^data:[^;,]+;base64,/.test(dataUrl)) {
    throw new TypeError('A valid base64 data URL is required.');
  }

  const parts = dataUrl.split(",");
  const mimeType = parts[0].split(":")[1].split(";")[0];
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeType });
};

const downloadScreenShot = (dataUrl, filename) => {
  const link = document.createElement("a");
  const blob = dataURLToBlob(dataUrl);
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";
  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }
};

const captureElementScreenshot = async (element) => {
  try {
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(element, { useCORS: true });

    // Convert the canvas to a data URL (Base64 encoded image)
    const screenshotDataUrl = canvas.toDataURL("image/png");

    return screenshotDataUrl;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return null;
  }
};

export { captureElementScreenshot, dataURLToBlob, downloadScreenShot };
