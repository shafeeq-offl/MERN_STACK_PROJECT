import express from "express";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import apiRoutes from "./server/routes.js";
import { connectDB } from "./server/db.js";
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3e3;
  app.use(express.json({ limit: "2mb" }));
  await connectDB();
  app.use("/api", apiRoutes);
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.join(process.cwd(), "frontend"),
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusEvents MERN Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
