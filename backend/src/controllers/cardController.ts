import { Request, Response } from 'express';
import { Card } from '../entities/Card.js';
import { AppDataSource } from '../config/database.js';
import { Like } from 'typeorm';


const cardRepository = AppDataSource.getRepository(Card)

export const createCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const card = cardRepository.create({ title, description });
    await cardRepository.save(card);
    console.log(card);
    
    res.status(201).json(card);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const cards = await cardRepository.find();
    res.status(200).json(cards);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCardByTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    const card = await cardRepository.findOne({ where: { title: req.params.title } });
    if (card) {
      res.status(200).json(card);
    } else {
      res.status(404).json({ message: 'Card not found' });
    }
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchCards = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.query as string;
      if (!query) {
        const cards = await cardRepository.find();
        res.status(200).json(cards);
        return;
      }
  
      const cards = await cardRepository.find({
        where: [
          { title: Like(`%${query}%`) },
          { description: Like(`%${query}%`) }
        ]
      });
  
      res.status(200).json(cards);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  export const updateCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const card = await cardRepository.findOne({ where: { id } });
      
      if (!card) {
        res.status(404).json({ message: 'Card not found' });
        return;
      }
  
      card.title = title;
      card.description = description;
      await cardRepository.save(card);
  
      res.status(200).json(card);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const card = await cardRepository.findOne({ where: { id } });
  
      if (!card) {
        res.status(404).json({ message: 'Card not found' });
        return;
      }
  
      await cardRepository.remove(card);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };