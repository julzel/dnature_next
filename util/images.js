import html2canvas from "html2canvas";

const dataURLToBlob = (dataUrl) => {
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
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href); // release the URL resource
};

const captureElementScreenshot = async (element) => {
  try {
    // Capture the screenshot as a canvas
    const canvas = await html2canvas(element, { useCORS: true });

    // Convert the canvas to a data URL (Base64 encoded image)
    const screenshotDataUrl = canvas.toDataURL("image/png");

    return screenshotDataUrl;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return null;
  }
};

export { downloadScreenShot, captureElementScreenshot };
