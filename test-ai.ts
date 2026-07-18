import { streamText } from "ai";
import { google } from "@ai-sdk/google";

async function main() {
  const result = await streamText({
    model: google("gemini-3.5-flash"),
    prompt: "Hello",
  });
  console.log(Object.keys(result));
}
main();
