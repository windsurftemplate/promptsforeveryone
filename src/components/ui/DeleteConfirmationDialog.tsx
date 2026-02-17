import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog({
  isOpen,
  isDeleting,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-black/90 border border-[#8B5CF6]/20 rounded-lg p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Delete Prompt</h3>
          <p className="text-white/70 mb-6">Are you sure you want to delete this prompt? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded transition-colors flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
