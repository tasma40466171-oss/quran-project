// backend/modules/coach/aqmosWizard.routes.js
"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/aqmosWizard.controller");
const auth = require("../middleware/authMiddleware");

// AQMOS wizard flow endpoints (backend-only classification logic)
router.post("/aqmos/save", auth, controller.saveProfile);
router.delete("/aqmos/clear", auth, controller.clearProfile);

module.exports = router;
