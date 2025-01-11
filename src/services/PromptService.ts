class PromptService {
  // ... other methods

  async canEditPrompt(userId: string, promptId: string): Promise<boolean> {
    const prompt = await this.getPromptById(promptId);
    
    if (!prompt) {
      throw new Error('Prompt not found');
    }

    // Only allow editing if the user is the creator
    return prompt.creatorId === userId;
  }

  async updatePrompt(userId: string, promptId: string, updates: Partial<Prompt>): Promise<Prompt> {
    // Check if user has permission to edit
    const canEdit = await this.canEditPrompt(userId, promptId);
    
    if (!canEdit) {
      throw new Error('Unauthorized: Only the creator can edit this prompt');
    }

    // Proceed with update if authorized
    return this.promptRepository.update(promptId, updates);
  }
} 