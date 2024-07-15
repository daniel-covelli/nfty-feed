import nodeFetch from "node-fetch";
import * as Bytescale from "@bytescale/sdk";

const uploadManager = new Bytescale.UploadManager({
  fetchApi: nodeFetch as any, // import nodeFetch from "node-fetch"; // Only required for Node.js. TypeScript: 'nodeFetch as any' may be necessary.
  apiKey: process.env.BYTE_SCALE_API_KEY ?? "",
  debug: true,
});
console.log("process.env.BYTE_SCALE_API_KEY", process.env.BYTE_SCALE_API_KEY);
const base64toBuffer = (media: string) => {
  const base64Data = media.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64Data, "base64");
};

export const uploadMedia = async (media: string) => {
  return uploadManager.upload({
    data: base64toBuffer(media),
    mime: "image/jpeg",
    originalFileName: "image.png",
  });
};
