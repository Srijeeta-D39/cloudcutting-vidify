
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

const Index = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* Testimonials Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="badge badge-secondary mb-4">Testimonials</span>
              <h2 className="heading-2 mb-5">What our users are saying</h2>
              <p className="subtitle">
                Join thousands of video creators who have transformed their workflow with our cloud editing platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">User {i}</h4>
                      <p className="text-sm text-muted-foreground">Video Creator</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "CloudCut has revolutionized my video editing process. What used to take hours now takes minutes, and the quality is exceptional."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-accent/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-2 mb-6">Ready to transform your video workflow?</h2>
              <p className="subtitle mb-8">
                Join thousands of content creators who have streamlined their video production with CloudCut.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="btn-primary btn-lg">
                  Get Started Free
                </button>
                <button className="btn-ghost btn-lg">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
