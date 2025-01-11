class PromptController {
  constructor(private promptService: PromptService) {}

  async updatePrompt(req: Request, res: Response) {
    try {
      const { promptId } = req.params;
      const userId = req.user.id; // Assuming you have user info in request
      const updates = req.body;

      const updatedPrompt = await this.promptService.updatePrompt(userId, promptId, updates);
      
      res.json(updatedPrompt);
    } catch (error) {
      if (error.message.includes('Unauthorized')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 