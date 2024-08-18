import express from 'express';
import { createCard, getAllCards, getCardByTitle, searchCards, updateCard, deleteCard } from '../controllers/cardController.js';

const router = express.Router();

router.post('/', createCard);
router.get('/', getAllCards);
router.get('/search', searchCards);
router.get('/:title', getCardByTitle);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;