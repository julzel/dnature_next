import html2canvas from "html2canvas";

const downloadScreenShot = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

export { captureElementScreenshot, downloadScreenShot };
