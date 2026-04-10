import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const ideas = await prisma.idea.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ message: 'Failed to fetch ideas' });
  }
});

router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { prompt, contentType, category, tone } = req.body;
  const userId = req.user.id;

  try {
    // Mocked AI generation for now, but saving to real DB
    const newIdea = await prisma.idea.create({
      data: {
        userId,
        title: `Generated ${contentType}: ${prompt?.substring(0, 20)}...`,
        description: `This is a mock generated description for ${category} with tone ${tone}`,
        contentType,
        category: category || 'general',
        tone: tone || 'informative',
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        callToAction: 'Subscribe now!',
        status: 'draft',
      },
    });

    res.status(201).json(newIdea);
  } catch (error) {
    console.error('Error generating idea:', error);
    res.status(500).json({ message: 'Failed to generate and save idea' });
  }
});

export default router;
