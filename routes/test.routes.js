import { Router } from 'express';
import testDao from '../dao/test.dao.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const isDatabaseAlive = await testDao.testConnection();
    if (!isDatabaseAlive) {
      return res.status(500).json({ status: 'down', database: 'disconnected' });
    }
    return res.json({ status: 'up', database: 'connected' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/setup', async (req, res) => {
  try {
    await testDao.initializeSchema();
    return res.status(201).json({ status: 'success', message: 'Database schema initialized successfully' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;