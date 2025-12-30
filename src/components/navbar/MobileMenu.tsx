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
  BookOpenIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface MobileMenuProps {
  user: any;
  isAdmin: boolean;
  isPaidUser: boolean;
  onSignOut: () => void;
}

export default function MobileMenu({ user, isAdmin, isPaidUser, onSignOut }: MobileMenuProps) {
  const menuItemClass = "flex flex-col items-center gap-1 p-3 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-300";
  const iconClass = "h-5 w-5";
  const labelClass = "text-[10px] uppercase tracking-wider";

  return (
    <div className="md:hidden glass-panel border-t border-white/5 animate-soft-fade">
      <div className="grid grid-cols-4 gap-1 p-3">
        <Link href="/categories" className={menuItemClass}>
          <FolderIcon className={iconClass} />
          <span className={labelClass}>Browse</span>
        </Link>
        <Link href="/popular" className={menuItemClass}>
          <FireIcon className={iconClass} />
          <span className={labelClass}>Popular</span>
        </Link>
        <Link href="/price" className={menuItemClass}>
          <CurrencyDollarIcon className={iconClass} />
          <span className={labelClass}>Pricing</span>
        </Link>
        <Link href="/about" className={menuItemClass}>
          <InformationCircleIcon className={iconClass} />
          <span className={labelClass}>About</span>
        </Link>
      </div>

      <div className="border-t border-white/5">
        <div className="grid grid-cols-4 gap-1 p-3">
          <Link href="/guides" className={menuItemClass}>
            <BookOpenIcon className={iconClass} />
            <span className={labelClass}>Guides</span>
          </Link>
          {isAdmin && (
            <Link href="/explore" className={menuItemClass}>
              <GlobeAltIcon className={iconClass} />
              <span className={labelClass}>Explore</span>
            </Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard" className={menuItemClass}>
                <Squares2X2Icon className={iconClass} />
                <span className={labelClass}>Dashboard</span>
              </Link>
              <button onClick={onSignOut} className={menuItemClass}>
                <ArrowRightOnRectangleIcon className={iconClass} />
                <span className={labelClass}>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={menuItemClass}>
                <ArrowLeftOnRectangleIcon className={iconClass} />
                <span className={labelClass}>Login</span>
              </Link>
              <Link href="/register" className={`${menuItemClass} text-emerald`}>
                <UserPlusIcon className={iconClass} />
                <span className={labelClass}>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
