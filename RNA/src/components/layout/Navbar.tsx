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
            setUserData({ name: user.displayName || "Anonymous", email: user.email });
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
      toast.success("Logged out");
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
    <nav className="bg-[#500096] border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-lg font-bold">RH</span>
            </div>
            <span className="font-bold text-xl text-white">RNA HUB</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-[#7566d2] text-primary-foreground"
                    : "text-white hover:bg-[#b8aef6]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-4"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-white" />
              ) : (
                <Sun className="h-5 w-5 text-white" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {currentUser ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white ml-2">
                    <UserCircle2 className="h-5 w-5" />
                    <span className="hidden md:inline text-sm font-medium">
                      {userData?.name?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-background text-foreground">
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">{userData?.name || "User"}</p>
                    <p className="text-muted-foreground text-xs">{userData?.email}</p>
                    <hr className="my-2" />
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="outline" className="ml-4">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-white" />
              ) : (
                <Sun className="h-5 w-5 text-white" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-1 fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? "bg-[#7566d2] text-primary-foreground"
                    : "text-white hover:bg-[#b8aef6]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {currentUser ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
