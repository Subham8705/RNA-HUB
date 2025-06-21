import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  Menu,
  LogOut,
  UserCircle2,
  ChevronDown,
  X,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  auth,
  onAuthStateChanged,
  signOut,
  getDoc,
  doc,
  db,
} from "@/firebase";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const { name, email } = docSnap.data();
            setUserData({ name, email });
          } else {
            setUserData({ 
              name: user.displayName || "Anonymous", 
              email: user.email || "No email" 
            });
          }
        } catch {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Error signing out");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    ...(currentUser ? [{ name: "RNA Structure", path: "/rna-structure" }] : []),
  ];

  const isActive = (path: string) =>
    path === location.pathname || location.pathname.startsWith(path);

  return (
    <nav className="bg-gradient-to-r from-[#500096] to-[#7566d2] border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
            >
              <span className="text-[#500096] text-lg font-bold">RH</span>
            </motion.div>
            <motion.span 
              whileHover={{ scale: 1.02 }}
              className="font-bold text-xl text-white group-hover:text-[#f0e9ff] transition-colors"
            >
              RNA HUB
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive(link.path)
                    ? "bg-white/20 text-white shadow-inner"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                <motion.span whileHover={{ scale: 1.05 }}>
                  {link.name}
                </motion.span>
              </Link>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-4 text-white hover:bg-white/10"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Profile */}
            {currentUser ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-white ml-2 hover:bg-white/10"
                  >
                    <UserCircle2 className="h-5 w-5" />
                    <span className="hidden md:inline text-sm font-medium">
                      {userData?.name?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-56 p-2 bg-white dark:bg-[#1e1e2d] border border-gray-200 dark:border-gray-700 shadow-lg"
                  align="end"
                >
                  <div className="space-y-2">
                    <div className="px-2 py-1.5">
                      <p className="font-semibold text-sm truncate">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-muted-foreground text-xs truncate">
                        {userData?.email}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-2"
                      >
                        View Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full justify-start px-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link to="/auth">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="ml-4 bg-white/90 hover:bg-white text-[#500096] hover:text-[#500096] border-white/20"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-white hover:bg-white/10"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="text-white border-white/30 hover:bg-white/10 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive(link.path)
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-white/20">
                  {currentUser ? (
                    <>
                      <div className="px-3 py-2 text-sm text-white/80">
                        <p>Logged in as</p>
                        <p className="font-medium truncate">
                          {userData?.name || "User"}
                        </p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        View Profile
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link 
                      to="/auth" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-white/10 hover:bg-white/20 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;