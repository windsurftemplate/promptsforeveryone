import { Request, Response } from 'express';
import { PromptService } from '../services/PromptService';

// Define custom interface for the Request to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
  params: {
    promptId: string;
    [key: string]: string;
  };
}

export class PromptController {
  constructor(private promptService: PromptService) {}

  async updatePrompt(req: AuthenticatedRequest, res: Response) {
    try {
      const { promptId } = req.params;
      const userId = req.user?.id; // Using optional chaining
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const updatedPrompt = await this.promptService.updatePrompt(userId, promptId, updates);
      
      res.json(updatedPrompt);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        res.status(403).json({ error: error.message });
      } else {
        console.error('Error updating prompt:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 