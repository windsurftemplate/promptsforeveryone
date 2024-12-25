import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Link from 'next/link';

const categories = [
  'Code Generation',
  'Debugging',
  'API Development',
  'Automation',
  'Frontend',
  'Backend',
];

interface Folder {
  name: string;
  prompts: string[];
}

const Sidebar: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([
    { name: 'Web App Project', prompts: [] },
    { name: 'Automation Pipelines', prompts: [] },
  ]);

  const [, drop] = useDrop<HTMLUListElement>(() => ({
    accept: 'PROMPT',
    drop: (item: { id: string }) => addPromptToFolder(item.id),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addPromptToFolder = (promptId: string) => {
    // Logic to add prompt to a folder
  };

  return (
<div className="w-64 bg-gray-900 p-4 text-white">
  <h2 className="text-lg font-bold">Categories</h2>
  <ul className="mt-2">
    {categories.map((category) => (
      <li key={category} className="my-2">
        <Link href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="flex items-center p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <span className="mr-2">🔹</span> {/* Placeholder for icons */}
            {category}
          </div>
        </Link>
      </li>
    ))}
  </ul>
  <h2 className="text-lg font-bold mt-6">My Folders</h2>
  <ul className="mt-2" ref={drop as unknown as React.Ref<HTMLUListElement>}>
    {folders.map((folder) => (
      <li key={folder.name} className="my-2">
        <div className="flex items-center p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
          <span className="mr-2">📁</span> {/* Placeholder for icons */}
          {folder.name}
        </div>
      </li>
    ))}
  </ul>
</div>
  );
};

export default Sidebar;
