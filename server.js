const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This endpoint serves the latest Discord invite.");
});

app.get("/latest-invite", (req, res) => {
  try {
    const invite = fs.readFileSync("invite.txt", "utf-8").trim();
    res.json({ invite });
  } catch (err) {
    res.status(500).json({ error: "No invite available yet." });
  }
});

app.post("/update-invite", (req, res) => {
  console.log("🔥 POST request received at /update-invite");

  console.log("📦 Payload Body:", req.body); // This line helps us debug
  const { invite } = req.body;

  if (!invite) {
    console.error("❌ Invite is missing or malformed.");
    return res.status(400).send("Missing invite");
  }

  fs.writeFileSync("invite.txt", invite);
  console.log("✅ Invite written:", invite);
  res.send("Invite updated");
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
