import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { Prompt } from '@/types';

export class PromptService {
  async getPromptById(promptId: string): Promise<Prompt | null> {
    // First try to find in public prompts
    const publicPromptRef = ref(db, `prompts/${promptId}`);
    const publicSnapshot = await get(publicPromptRef);
    
    if (publicSnapshot.exists()) {
      return {
        id: promptId,
        ...publicSnapshot.val(),
        isPrivate: false
      };
    }

    // If not found in public, it might be a private prompt
    // The user check will be done in the controller/resolver level
    const privatePromptId = promptId.replace(/^(private-|public-)/, '');
    const privatePromptRef = ref(db, `users/${privatePromptId}`);
    const privateSnapshot = await get(privatePromptRef);

    if (privateSnapshot.exists()) {
      return {
        id: privatePromptId,
        ...privateSnapshot.val(),
        isPrivate: true
      };
    }

    return null;
  }

  async canEditPrompt(userId: string, promptId: string): Promise<boolean> {
    const prompt = await this.getPromptById(promptId);
    
    if (!prompt) {
      throw new Error('Prompt not found');
    }

    // Only allow editing if the user is the creator
    return prompt.userId === userId;
  }

  async updatePrompt(userId: string, promptId: string, updates: Partial<Prompt>): Promise<Prompt> {
    // Check if user has permission to edit
    const canEdit = await this.canEditPrompt(userId, promptId);
    
    if (!canEdit) {
      throw new Error('Unauthorized: Only the creator can edit this prompt');
    }

    // Remove any prefix from the ID
    const originalId = promptId.replace(/^(private-|public-)/, '');

    // Determine the correct path based on visibility
    const promptPath = updates.visibility === 'private'
      ? `users/${userId}/prompts/${originalId}`
      : `prompts/${originalId}`;
    
    const promptRef = ref(db, promptPath);

    // Update the prompt
    await update(promptRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    // Return the updated prompt
    const updatedPrompt = await this.getPromptById(originalId);
    if (!updatedPrompt) {
      throw new Error('Failed to retrieve updated prompt');
    }

    return updatedPrompt;
  }
} 