import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const getPdfInfo = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: canvas.getContext("2d"),
    viewport,
  }).promise;

  const previewBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  const previewFile = new File([previewBlob], `${file.name}_preview.png`, {
    type: "image/png",
  });
  const previewLocalUrl = URL.createObjectURL(previewBlob);

  return { pageCount, previewFile, previewLocalUrl };
};
