import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Mock Data
let contents: any[] = [];

// GET Content
router.get('/', authenticateToken, (req, res) => {
  const { status, type } = req.query;
  
  let result = [...contents];
  // @ts-ignore
  if (req.user && req.user.id) {
    // @ts-ignore
    result = result.filter(c => c.user_id === req.user.id);
  }

  if (status) result = result.filter(c => c.status === status);
  if (type) result = result.filter(c => c.content_type === type);

  result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  res.json(result);
});

// POST Content
router.post('/', authenticateToken, (req, res) => {
  const { title, excerpt, content, content_type, idea_id, tags } = req.body;

  // @ts-ignore
  const user_id = req.user.id;

  const newContent = {
    id: contents.length + 1,
    user_id,
    title,
    excerpt,
    content,
    content_type,
    idea_id,
    tags: tags || [],
    status: 'draft',
    created_at: new Date().toISOString(),
  };

  contents.push(newContent);
  res.status(201).json(newContent);
});

// GET By ID
router.get('/:id', authenticateToken, (req, res) => {
  const content = contents.find(c => c.id === parseInt(req.params.id));
  if (!content) return res.status(404).json({ message: 'Content not found' });
  res.json(content);
});

// PATCH Content
router.patch('/:id', authenticateToken, (req, res) => {
  const index = contents.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Content not found' });

  contents[index] = { ...contents[index], ...req.body, updated_at: new Date().toISOString() };
  res.json(contents[index]);
});

// DELETE Content
router.delete('/:id', authenticateToken, (req, res) => {
  const index = contents.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Content not found' });

  contents.splice(index, 1);
  res.status(204).send();
});

export default router;
