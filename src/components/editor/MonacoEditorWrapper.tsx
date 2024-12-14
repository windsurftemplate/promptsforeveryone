'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import * as Monaco from 'monaco-editor';

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
      Loading Editor...
    </div>
  ),
});

interface MonacoEditorWrapperProps {
  content: string;
  onChange: (value: string) => void;
  theme?: string;
  fontSize?: number;
}

export default function MonacoEditorWrapper({
  content,
  onChange,
  theme = 'vs-dark',
  fontSize = 14,
}: MonacoEditorWrapperProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  // Function to handle editor mount
  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addAction({
      id: 'toggle-bold',
      label: 'Toggle Bold',
      keybindings: [Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyB],
      run: () => {
        const selection = editor.getSelection();
        if (selection) {
          const model = editor.getModel();
          if (model) {
            const text = model.getValueInRange(selection);
            const isBold = text.startsWith('**') && text.endsWith('**');
            const newText = isBold ? text.slice(2, -2) : `**${text}**`;
            editor.executeEdits('toggle-bold', [{
              range: selection,
              text: newText,
            }]);
          }
        }
      }
    });

    // Add italic shortcut
    editor.addAction({
      id: 'toggle-italic',
      label: 'Toggle Italic',
      keybindings: [Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyI],
      run: () => {
        const selection = editor.getSelection();
        if (selection) {
          const model = editor.getModel();
          if (model) {
            const text = model.getValueInRange(selection);
            const isItalic = text.startsWith('*') && text.endsWith('*');
            const newText = isItalic ? text.slice(1, -1) : `*${text}*`;
            editor.executeEdits('toggle-italic', [{
              range: selection,
              text: newText,
            }]);
          }
        }
      }
    });
  };

  return (
    <Editor
      height="400px"
      defaultLanguage="markdown"
      value={content}
      theme={theme}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      options={{
        fontSize: fontSize,
        wordWrap: 'on',
        minimap: { enabled: false },
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
      }}
    />
  );
}
