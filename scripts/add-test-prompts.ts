import { db } from '../src/lib/firebase';
import { ref, set } from 'firebase/database';

async function addTestPrompts() {
  const prompts = [
    {
      id: 'test-prompt-1',
      title: 'Code Review Assistant',
      content: 'Please review this code for best practices, potential bugs, and suggest improvements: ```{{code}}```',
      category: 'Code Review',
      isPublic: true,
      status: 'approved',
      userId: 'test-user',
      createdAt: new Date().toISOString()
    },
    {
      id: 'test-prompt-2',
      title: 'Test Case Generator',
      content: 'Generate comprehensive test cases for the following function: ```{{code}}```',
      category: 'Testing',
      isPublic: true,
      status: 'approved',
      userId: 'test-user',
      createdAt: new Date().toISOString()
    },
    {
      id: 'test-prompt-3',
      title: 'Documentation Writer',
      content: 'Write clear and comprehensive documentation for this code: ```{{code}}```',
      category: 'Documentation',
      isPublic: true,
      status: 'approved',
      userId: 'test-user',
      createdAt: new Date().toISOString()
    }
  ];

  try {
    for (const prompt of prompts) {
      await set(ref(db, `prompts/${prompt.id}`), prompt);
      console.log(`Added prompt: ${prompt.title}`);
    }
    console.log('All test prompts added successfully!');
  } catch (error) {
    console.error('Error adding test prompts:', error);
  }
}

addTestPrompts();
