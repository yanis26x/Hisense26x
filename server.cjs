const express = require("express");
const { execFile } = require("node:child_process");
const path = require("node:path");
const os = require("node:os");

const app = express();
app.use(express.json());

const home = os.homedir();
const tvCommand = path.join(home, "vidaa-test/.venv/bin/tv");

const commands = {
  youtube: ["app", "youtube"],
  netflix: ["app", "netflix"],
  prime: ["app", "amazon"],
  ps5: ["source", "hdmi3"],
  hdmi1: ["source", "hdmi1"],
  hdmi2: ["source", "hdmi2"],
};

app.post("/api/launch/:name", (req, res) => {
  const command = commands[req.params.name];

  if (!command) {
    return res.status(400).json({ error: "Application inconnue" });
  }

  execFile(
    command[0] === "source"
      ? path.join(home, "vidaa-test/.venv/bin/python")
      : tvCommand,
    [
      ...(command[0] === "source" ? [path.join(__dirname, "launch-source.py")] : []),
      "--ip", "10.0.0.122", ...command,
    ],
    {
      env: {
        ...process.env,
        PYTHONPATH: path.join(home, "vidaa-test/python-fix"),
      },
      timeout: 15000,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(stderr || error.message);
        return res.status(500).json({ error: "Commande VIDAA échouée" });
      }

      console.log(stdout);
      res.json({ success: true });
    }
  );
});

app.listen(3001, "0.0.0.0", () => {
  console.log("Serveur VIDAA actif sur le port 3001");
});
