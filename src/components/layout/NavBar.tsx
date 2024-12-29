import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function NavBar() {
  const { user } = useAuth();

  return (
    <nav className="bg-black border-b border-[#00ffff]/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-[#00ffff] font-bold text-xl">
              Prompt Repository
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/explore"
                className="text-gray-300 hover:text-[#00ffff] px-3 py-2 rounded-md text-sm"
              >
                Explore
              </Link>
              <Link
                href="/tutorial"
                className="text-gray-300 hover:text-[#00ffff] px-3 py-2 rounded-md text-sm"
              >
                Tutorial
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-[#00ffff] px-3 py-2 rounded-md text-sm"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/submit"
                    className="text-gray-300 hover:text-[#00ffff] px-3 py-2 rounded-md text-sm"
                  >
                    Submit
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
