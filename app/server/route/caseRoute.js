const express = require("express");
const { sidebar, caseView, allCases, aiSummary} = require("../controller/caseController");
const router = express.Router();

router.post("/", allCases);
router.post("/sidebar", sidebar)
router.post("/caseView",caseView)
router.post("/summary", aiSummary)

module.exports = router;