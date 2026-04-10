import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// GET Content
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { status, type } = req.query;
  const userId = req.user.id;

  try {
    const contents = await prisma.content.findMany({
      where: {
        userId,
        ...(status && { status: String(status) }),
        ...(type && { contentType: String(type) }),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(contents);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

// POST Content
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { title, excerpt, content, content_type, idea_id, tags } = req.body;
  const userId = req.user.id;

  try {
    const newContent = await prisma.content.create({
      data: {
        userId,
        title,
        excerpt,
        content,
        contentType: content_type,
        ideaId: idea_id ? parseInt(idea_id) : null,
        tags: tags || [],
        status: 'draft',
      },
    });
    res.status(201).json(newContent);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ message: 'Failed to create content' });
  }
});

// GET By ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const contentId = parseInt(req.params.id);

  try {
    const content = await prisma.content.findFirst({
      where: { id: contentId, userId },
    });
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

// PATCH Content
router.patch('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const contentId = parseInt(req.params.id);

  try {
    const updatedContent = await prisma.content.update({
      where: { id: contentId, userId },
      data: req.body,
    });
    res.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Failed to update content' });
  }
});

// DELETE Content
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const contentId = parseInt(req.params.id);

  try {
    await prisma.content.delete({
      where: { id: contentId, userId },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Failed to delete content' });
  }
});

export default router;
