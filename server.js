const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your Carrd site can access this server
app.use(cors());
app.use(express.json());

// Basic home route
app.get("/", (req, res) => {
  res.send("This endpoint serves the latest Discord invite.");
});

// Return the current invite
app.get("/latest-invite", (req, res) => {
  try {
    const invite = fs.readFileSync("invite.txt", "utf-8").trim();
    res.json({ invite });
  } catch (err) {
    console.error("❌ Failed to read invite.txt:", err);
    res.status(500).json({ error: "No invite available yet." });
  }
});

// Accept and store a new invite via POST
app.post("/update-invite", (req, res) => {
  console.log("📥 Incoming Invite Payload:", req.body);

  const { invite } = req.body;
  if (!invite || invite.includes("{invitelink}")) {
    console.error("❌ Invalid or missing invite.");
    return res.status(400).send("Missing or invalid invite.");
  }

  try {
    fs.writeFileSync("invite.txt", invite);
    console.log(`✅ Invite updated: ${invite}`);
    res.send("Invite updated.");
  } catch (err) {
    console.error("❌ Failed to write invite.txt:", err);
    res.status(500).send("Failed to save invite.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

