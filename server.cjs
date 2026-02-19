const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/api/alerts", (req, res) => {
  const db = router.db;
  const alerts = db.get("alerts").value() || [];
  res.json(alerts);
});

server.patch("/api/alerts/:id/resolve", (req, res) => {
  const id = req.params.id;
  const db = router.db;
  const existing = db.get("alerts").find({ id }).value();

  if (!existing) {
    return res.status(404).json({ message: "Alert not found" });
  }

  db.get("alerts").find({ id }).assign({ resolved: true }).write();
  const updated = db.get("alerts").find({ id }).value();
  return res.json(updated);
});

server.use("/api", router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Fake API running on http://127.0.0.1:${PORT}`);
});
