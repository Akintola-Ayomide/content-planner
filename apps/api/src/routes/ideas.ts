import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

let ideasData: any[] = [];

router.get('/', authenticateToken, (req, res) => {
  // @ts-ignore
  const user_id = req.user.id;
  const userIdeas = ideasData.filter(idea => idea.user_id === user_id);
  res.json(userIdeas);
});

router.post('/generate', authenticateToken, async (req, res) => {
  const { prompt, contentType, category, tone } = req.body;
  
  // @ts-ignore
  const user_id = req.user.id;

  // Mocked AI generation for now to avoid ai/zod dependency errors in our simplified backend
  const newIdea = {
    id: ideasData.length + 1,
    user_id,
    title: `Generated ${contentType}: ${prompt?.substring(0, 20)}...`,
    description: `This is a mock generated description for ${category} with tone ${tone}`,
    content_type: contentType,
    category,
    tone,
    key_points: ['Point 1', 'Point 2', 'Point 3'],
    call_to_action: 'Subscribe now!',
    status: 'draft',
    created_at: new Date().toISOString(),
  };

  ideasData.push(newIdea);

  res.status(201).json(newIdea);
});

export default router;
