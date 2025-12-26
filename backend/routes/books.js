const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.get('/:isbn', bookController.getBookByISBN);
router.post('/', bookController.addBook);
router.put('/:isbn', bookController.updateBook);

module.exports = router;
