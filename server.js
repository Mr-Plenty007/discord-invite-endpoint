const express = require("express");
const fs = require("fs");
const app = express();
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
  console.log('Incoming Invite Payload:', req.body);
  
  const { invite } = req.body;
  if (!invite) return res.status(400).send("Missing invite");
  fs.writeFileSync("invite.txt", invite);
  console.log("Invite saved:", invite);
  res.send("Invite updated");
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
