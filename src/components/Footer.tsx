
import { Link } from 'react-router-dom';
import { Github, Twitter, Youtube, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-muted/20 py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                CloudCut
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Professional cloud-based video editing platform that simplifies the creative process.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Github">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Youtube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Features</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Pricing</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Templates</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Tutorials</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Documentation</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Help Center</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Community</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Blog</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">About Us</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Careers</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Legal</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Privacy</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary text-sm">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CloudCut. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-destructive" /> using modern web technologies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
