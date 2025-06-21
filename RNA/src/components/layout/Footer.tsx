
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">RNA HUB</h3>
            <p className="text-sm opacity-80">
            A web-based platform that provides AI-driven RNA 3D structure prediction and cancer biomarker detection, offering tools for researchers, doctors, students and biotech professionals.            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/research" className="hover:underline">Research</Link></li>
              <li><Link to="/rna-structure" className="hover:underline">RNA Structure</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-sm space-y-2">
              <p>RNA Hub</p>
              {/* <p>123 Science Avenue</p>
              <p>Genomic City, GC 12345</p> */}
              <p className="pt-2">idk@gmail.com</p>
            </address>
          </div>
        </div>
        
        {/* <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-sm text-center opacity-80">
          <p>&copy; {new Date().getFullYear()} RNA BRRRR. All rights reserved.</p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
