import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const output = new URL("../dist-static/", import.meta.url);
const expectedBase = process.env.VITE_BASE_PATH || "/";

test("static build is complete and base-aware", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  const assetFiles = await readdir(new URL("assets/", output));

  assert.match(html, /Умная прихожая в подарок/);
  assert.match(html, new RegExp(`${expectedBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}assets/`));
  assert.ok(assetFiles.some((file) => file.endsWith(".js")), "JavaScript bundle is missing");
  assert.ok(assetFiles.some((file) => file.endsWith(".css")), "CSS bundle is missing");

  for (const name of ["image1.png", "image2.png", "image3.png", "image4.png", "image5.png", "image6.png"]) {
    await access(new URL(`assets/docx/${name}`, output));
  }
});
