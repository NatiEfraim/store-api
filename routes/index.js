const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

  try {

    res.json({ msg: "Hello from HomePage endpoint" });

  } catch (err) {
    console.error("Error from HomePage :", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports = router;