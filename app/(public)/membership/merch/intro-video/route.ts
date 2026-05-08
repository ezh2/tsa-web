import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

const videoPath = path.join(
  process.cwd(),
  "images",
  "merch",
  "merch logo intro.mp4",
);

export async function GET(request: Request) {
  const fileStat = await stat(videoPath);
  const range = request.headers.get("range");

  if (range) {
    const match = range.match(/bytes=(\d+)-(\d*)/);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : fileStat.size - 1;
      const chunkSize = end - start + 1;
      const stream = createReadStream(videoPath, { start, end });

      return new Response(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
          "Content-Type": "video/mp4",
        },
      });
    }
  }

  const stream = createReadStream(videoPath);

  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": String(fileStat.size),
      "Content-Type": "video/mp4",
    },
  });
}
