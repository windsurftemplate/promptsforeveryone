export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-black">
      {children}
    </main>
  );
} 