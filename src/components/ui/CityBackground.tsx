'use client';

export default function CityBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{
          backgroundImage: 'url("/sf-street.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent" />
    </div>
  );
}
