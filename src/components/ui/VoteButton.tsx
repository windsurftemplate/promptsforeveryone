'use client';

import React, { useState, useEffect } from 'react';
import { ref, set, get, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { FireIcon } from '@heroicons/react/24/outline';
import { FireIcon as FireIconSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface VoteButtonProps {
  promptId: string;
  initialVotes?: number;
  onVoteChange?: (newVoteCount: number) => void;
}

export default function VoteButton({ promptId, initialVotes = 0, onVoteChange }: VoteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Remove any prefix from promptId
  const cleanPromptId = promptId.replace(/^(private-|public-)/, '');

  useEffect(() => {
    const checkUserVote = async () => {
      try {
        // Get total votes regardless of user auth state
        const votesRef = ref(db, `prompts/${cleanPromptId}/votes`);
        const votesSnapshot = await get(votesRef);
        const voteCount = votesSnapshot.exists() ? Object.keys(votesSnapshot.val()).length : 0;
        setVotes(voteCount);

        // Check user's vote only if authenticated
        if (user) {
          const voteRef = ref(db, `prompts/${cleanPromptId}/votes/${user.uid}`);
          const snapshot = await get(voteRef);
          setHasVoted(snapshot.exists());
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserVote();
  }, [user, cleanPromptId]);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      const voteRef = ref(db, `prompts/${cleanPromptId}/votes/${user.uid}`);

      if (hasVoted) {
        // Remove vote
        await remove(voteRef);
        setVotes(prev => {
          const newCount = prev - 1;
          onVoteChange?.(newCount);
          return newCount;
        });
        setHasVoted(false);
      } else {
        // Add vote
        await set(voteRef, true);
        setVotes(prev => {
          const newCount = prev + 1;
          onVoteChange?.(newCount);
          return newCount;
        });
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      alert('Failed to update vote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      title={!user ? 'Log in to vote' : hasVoted ? 'Remove vote' : 'Vote for this prompt'}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
        hasVoted
          ? 'bg-[#8B5CF6] text-black'
          : 'bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : !user ? 'cursor-pointer opacity-75 hover:opacity-100' : ''}`}
    >
      {hasVoted ? (
        <FireIconSolid className="h-5 w-5" />
      ) : (
        <FireIcon className="h-5 w-5" />
      )}
      <span className="font-medium">{votes}</span>
    </button>
  );
} 