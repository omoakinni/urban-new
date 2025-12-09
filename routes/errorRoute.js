const express = require("express");
const router = express.Router();

// Route to trigger intentional error
router.get("/trigger", async (req, res, next) => {
  try {
    // Intentionally throw an error to test error handling
    throw new Error("Intentional 500 error triggered from footer link");
  } catch (error) {
    next(error);
  }
});

module.exports = router;