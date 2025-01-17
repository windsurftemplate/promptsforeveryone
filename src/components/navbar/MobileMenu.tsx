import Link from 'next/link';
import {
  GlobeAltIcon,
  FolderIcon,
  FireIcon,
  InformationCircleIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

interface MobileMenuProps {
  user: any;
  isAdmin: boolean;
  isPaidUser: boolean;
  onSignOut: () => void;
}

export default function MobileMenu({ user, isAdmin, isPaidUser, onSignOut }: MobileMenuProps) {
  return (
    <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-[#00ffff]/10">
      <div className="grid grid-cols-4 gap-2 p-4">
        {isAdmin && (
          <Link href="/explore" className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300">
            <GlobeAltIcon className="h-5 w-5" />
          </Link>
        )}
        <Link href="/categories" className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300">
          <FolderIcon className="h-5 w-5" />
        </Link>
        <Link href="/popular" className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300">
          <FireIcon className="h-5 w-5" />
        </Link>
        <Link href="/about" className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300">
          <InformationCircleIcon className="h-5 w-5" />
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300">
              <Squares2X2Icon className="h-5 w-5" />
            </Link>
            <button
              onClick={onSignOut}
              className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300">
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </Link>
            <Link href="/register" className="flex justify-center items-center p-2 rounded-lg text-white/80 hover:text-[#00ffff] hover:bg-[#00ffff]/5 transition-all duration-300">
              <UserPlusIcon className="h-5 w-5" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
} 