import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import Button from "@/components/atoms/Button";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import { AuthContext } from '../../App';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <ApperIcon name="Menu" size={24} />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="bg-gradient-to-br from-primary to-primary-light rounded-lg p-1.5">
                  <ApperIcon name="Zap" size={20} className="text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">PipeDrive</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <ApperIcon name="Bell" size={20} />
              </Button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-500">{user?.emailAddress || ''}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-white" />
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <ApperIcon name="LogOut" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Header;