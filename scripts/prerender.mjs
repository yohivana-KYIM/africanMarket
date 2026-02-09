import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import { join, extname } from "path";
import puppeteer from "puppeteer";

const DIST = join(process.cwd(), "dist");
const PORT = 4173;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const ROUTES = [
  "/",
  "/collections",

  // Main categories
  "/categorie/africa-market-bags",
  "/categorie/accessoires",
  "/categorie/achat-programme",
  "/categorie/services",
  "/categorie/cadeaux",

  // Subcategories: Africa Market Bags
  "/categorie/africa-market-bags/sac-monsieur",
  "/categorie/africa-market-bags/sac-dos-sport",
  "/categorie/africa-market-bags/sac-dos-lv",
  "/categorie/africa-market-bags/sac-dos-incognito",
  "/categorie/africa-market-bags/sac-a-main",
  "/categorie/africa-market-bags/sac-bandouliere",
  "/categorie/africa-market-bags/pochette",
  "/categorie/africa-market-bags/colis-leger",
  "/categorie/africa-market-bags/personnalise",
  "/categorie/africa-market-bags/valise-trio",
  "/categorie/africa-market-bags/valise-unique",
  "/categorie/africa-market-bags/couplet-voyage",

  // Subcategories: Accessoires
  "/categorie/accessoires/cadeau-petits",
  "/categorie/accessoires/cadeau-grands",
  "/categorie/accessoires/chaussures-hommes",
  "/categorie/accessoires/ceinture-hommes",
  "/categorie/accessoires/vetements-hommes",
  "/categorie/accessoires/babouches-hommes",
  "/categorie/accessoires/montres-hommes",
  "/categorie/accessoires/lunettes-hommes",
  "/categorie/accessoires/foulard-hommes",
  "/categorie/accessoires/chaussures-femmes",
  "/categorie/accessoires/ceinture-femmes",
  "/categorie/accessoires/babouches-femmes",
  "/categorie/accessoires/montres-femmes",
  "/categorie/accessoires/lunettes-femmes",
  "/categorie/accessoires/foulard-femmes",
  "/categorie/accessoires/ballerines-femmes",
  "/categorie/accessoires/portefeuille-hommes",
  "/categorie/accessoires/portefeuille-femmes",

  // Subcategories: Achat Programme
  "/categorie/achat-programme/cotisations-sacs",

  // Subcategories: Services
  "/categorie/services/reparation",

  // Subcategories: Cadeaux
  "/categorie/cadeaux/cadeau-pour-elle",
  "/categorie/cadeaux/cadeau-pour-lui",

  // Products
  "/product/default-1",
  "/product/default-2",
  "/product/default-3",
  "/product/default-4",
  "/product/default-5",
  "/product/default-6",
  "/product/default-7",
  "/product/default-8",
  "/product/default-9",
  "/product/default-10",
  "/product/default-11",
  "/product/default-12",
];

function serveStatic(req, res) {
  let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

  try {
    // Try the exact path first
    let data;
    try {
      data = readFileSync(filePath);
    } catch {
      // For SPA routes, serve index.html
      filePath = join(DIST, "index.html");
      data = readFileSync(filePath);
    }

    const ext = extname(filePath);
    const mime = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not Found");
  }
}

async function prerender() {
  console.log("🚀 Prerendering started...\n");

  // Step 1: Copy index.html → 200.html (SPA fallback shell)
  copyFileSync(join(DIST, "index.html"), join(DIST, "200.html"));
  console.log("✅ Copied index.html → 200.html (SPA fallback)\n");

  // Step 2: Start static server
  const server = createServer(serveStatic);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Static server running on http://localhost:${PORT}\n`);

  // Step 3: Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let success = 0;
  let failed = 0;

  // Step 4: Visit each route and capture HTML
  for (const route of ROUTES) {
    try {
      const page = await browser.newPage();
      const url = `http://localhost:${PORT}${route}`;

      await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

      // Wait for React to render content inside #root
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          return root && root.children.length > 0;
        },
        { timeout: 10000 }
      );

      // Small extra delay to let any animations/transitions settle
      await new Promise((r) => setTimeout(r, 500));

      const html = await page.content();
      await page.close();

      // Determine output path
      const outDir =
        route === "/"
          ? DIST
          : join(DIST, ...route.split("/").filter(Boolean));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, "index.html"), html, "utf-8");

      success++;
      console.log(`  ✅ ${route}`);
    } catch (err) {
      failed++;
      console.error(`  ❌ ${route} — ${err.message}`);
    }
  }

  // Step 5: Cleanup
  await browser.close();
  server.close();

  console.log(
    `\n🏁 Prerendering complete: ${success} succeeded, ${failed} failed out of ${ROUTES.length} routes.\n`
  );

  if (failed > 0) {
    process.exit(1);
  }
}

prerender();
