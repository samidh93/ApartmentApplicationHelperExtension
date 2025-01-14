// extractText.js
'use strict';

const { createWorker } = require('tesseract.js');

export async function extractTextImg(imagePath) {
  const worker = await createWorker("eng", 1, {
    logger: m => console.log(m),
  });  
  const { data: { text } } = await worker.recognize(imagePath);
  console.log("result: ", text);
  await worker.terminate();
}