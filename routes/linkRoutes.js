const express = require("express");
const router = express.Router();

const {
    createLink, 
    getAllLinks,
    getLinkByShort
} = require("../controllers/linkController");

router.post("/", createLink);
router.get("/", getAllLinks);
router.get("/:short", getLinkByShort);

module.exports = router;