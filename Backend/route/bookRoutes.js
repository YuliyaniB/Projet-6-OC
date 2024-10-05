const express = require("express");
const router = express.Router();
const bookCtrl = require("../controller/bookCtrl");
const auth = require("../middleware/auth");
const multerConfig = require("../middleware/multer-config");

router.get("/bestrating", bookCtrl.getBestRatedBooks);

router.get("/", bookCtrl.getAllBooks);

router.get("/:id", bookCtrl.getBookById);

router.post("/", auth, multerConfig, bookCtrl.createBook);

router.put("/:id", auth, multerConfig, bookCtrl.modifyBook);

router.delete("/:id", auth, bookCtrl.deleteBook);

router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
