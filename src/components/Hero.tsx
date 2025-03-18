
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/20 pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="badge badge-secondary mb-4">Cloud-powered Video Editing</span>
          </div>
          
          <h1 className="heading-1 mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            Edit Videos in the Cloud.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Simple. Fast. Professional.
            </span>
          </h1>
          
          <p className="subtitle max-w-2xl mx-auto mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            Upload your videos and edit them directly in your browser. Cutting-edge cloud technology makes video processing faster than ever before. 
            No downloads, no installations, just powerful editing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl animate-scale-in opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className={`transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <video 
              className="w-full h-auto rounded-2xl"
              poster="/placeholder.svg"
              autoPlay 
              loop 
              muted 
              playsInline
              onCanPlay={() => setIsVideoLoaded(true)}
            >
              <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm" type="video/webm" />
              <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Fallback image while video loads */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent">
              <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary animate-spin" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
