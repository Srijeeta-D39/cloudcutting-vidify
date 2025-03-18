
import { 
  Cloud, Upload, Edit, Save, Clock, Share, Zap, CheckCircle,
  Layout, PieChart, Layers, Users
} from 'lucide-react';

const features = [
  {
    title: 'Cloud Storage',
    description: 'Store and access your video projects from anywhere, with secure cloud backup.',
    icon: <Cloud className="h-8 w-8 text-primary" />
  },
  {
    title: 'Fast Upload',
    description: 'Optimized upload process with progress tracking and resume capability.',
    icon: <Upload className="h-8 w-8 text-primary" />
  },
  {
    title: 'Powerful Editor',
    description: 'Professional editing tools with an intuitive interface for all skill levels.',
    icon: <Edit className="h-8 w-8 text-primary" />
  },
  {
    title: 'Auto-Save',
    description: 'Never lose your work with automatic saving and version history.',
    icon: <Save className="h-8 w-8 text-primary" />
  },
  {
    title: 'Fast Processing',
    description: 'AWS-powered rendering means faster export times for your projects.',
    icon: <Clock className="h-8 w-8 text-primary" />
  },
  {
    title: 'Easy Sharing',
    description: 'Share your videos directly to social media or via secure links.',
    icon: <Share className="h-8 w-8 text-primary" />
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with team members on the same project simultaneously.',
    icon: <Users className="h-8 w-8 text-primary" />
  },
  {
    title: 'Analytics',
    description: 'Track performance and engagement with built-in analytics tools.',
    icon: <PieChart className="h-8 w-8 text-primary" />
  }
];

const Features = () => {
  return (
    <section className="relative py-20 md:py-32 bg-accent/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge badge-primary mb-4">Features</span>
          <h2 className="heading-2 mb-6">Everything you need for professional video editing</h2>
          <p className="subtitle">
            Our cloud-based platform combines powerful editing tools with the convenience 
            of cloud storage and collaboration features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card rounded-xl p-6 animate-fade-in opacity-0"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
            >
              <div className="mb-4 p-2 bg-accent inline-block rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
