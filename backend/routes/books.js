const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.get('/bestsellers', bookController.getBestSellers);
router.get('/random', bookController.getRandomBooks);
router.get('/:isbn', bookController.getBookByISBN);
router.post('/', bookController.addBook);
router.put('/:isbn', bookController.updateBook);
router.delete('/:isbn', bookController.deleteBook);

module.exports = router;
