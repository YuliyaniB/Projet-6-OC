const express = require("express");
const router = express.Router();
const bookCtrl = require("../controller/bookCtrl");
const auth = require("../middleware/auth");
const multerConfig = require("../middleware/multer-config");
const optimizeImg = require("../middleware/sharp-config");


router.get("/bestrating", bookCtrl.getBestRatedBooks);

router.get("/", bookCtrl.getAllBooks);

router.get("/:id", bookCtrl.getBookById);

router.post("/", auth, multerConfig, optimizeImg, bookCtrl.createBook);

router.post("/:id/rating", auth, bookCtrl.rateBook);

router.put("/:id", auth, multerConfig, optimizeImg, bookCtrl.modifyBook);

router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
