const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const { sassPlugin } = require("esbuild-sass-plugin");

const PORT = 3000;
const BUILD_DIR = "dist";
const BUILD_PATH = path.resolve(BUILD_DIR);
const PUBLIC_PATH = path.resolve("public");

// Log colors
// https://stackoverflow.com/a/46705010
const { r, g, b, w, c, m, y, k } = [
  ["r", 1], // Red
  ["g", 2], // Green
  ["b", 4], // Blue
  ["w", 7], // White
  ["c", 6], // Cyan
  ["m", 5], // Magenta
  ["y", 3], // Yellow
  ["k", 0], // Black
].reduce(
  (cols, col) => ({
    ...cols,
    [col[0]]: (f) => `\x1b[3${col[1]}m${f}\x1b[0m`,
  }),
  {}
);

// Clean build directory
if (!fs.existsSync(BUILD_PATH)) {
  fs.mkdirSync(BUILD_PATH, { recursive: true });
}
fs.readdirSync(BUILD_PATH).forEach((f) => fs.rmSync(`${BUILD_PATH}/${f}`));

(async () => {
  await fs.promises.copyFile(
    PUBLIC_PATH + "/index.html",
    BUILD_PATH + "/index.html"
  );
})().catch((err) => console.error(r(err)));

// Defaults to build if no argument flag is provided
let config = "--build";

if (process.argv.length > 2) {
  config = process.argv[2];
}

switch (config) {
  case "--build":
    esbuild
      .build({
        logLevel: "info",
        entryPoints: ["src/index.ts"],
        outdir: BUILD_DIR,
        bundle: true,
        define: { "process.env.NODE_ENV": '"production"' },
        minify: true,
        loader: {
          ".png": "dataurl",
          ".jpg": "dataurl",
          ".mp4": "dataurl",
          ".woff": "file",
          ".woff2": "file",
        },
        plugins: [sassPlugin()],
      })
      .catch(() => process.exit(1));
    break;
  case "--watch":
    esbuild
      .build({
        logLevel: "info",
        entryPoints: ["src/index.ts"],
        outdir: BUILD_DIR,
        bundle: true,
        define: { "process.env.NODE_ENV": '"production"' },
        sourcemap: true,
        minify: false,
        watch: true,
        loader: {
          ".png": "dataurl",
          ".jpg": "dataurl",
          ".mp4": "dataurl",
          ".woff": "file",
          ".woff2": "file",
        },
        plugins: [sassPlugin()],
      })
      .catch(() => process.exit(1));
    // Run local dev server with live reload
    serve();
    break;
}

async function serve() {
  console.clear();
  console.log(
    `\n${g(
      "ready"
    )} - started server on 0.0.0.0:${PORT}, url: http://localhost:${PORT}/\n`
  );
  const servor = require("servor");
  await servor({
    root: BUILD_DIR,
    port: PORT,
  });
}
