
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Play, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VideoThumbnailProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  createdAt: string;
  status: 'ready' | 'processing' | 'error';
}

const VideoThumbnail = ({
  id,
  title,
  thumbnail,
  duration,
  createdAt,
  status
}: VideoThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Format duration (seconds) as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date as relative time (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {isLoading && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onLoad={() => setIsLoading(false)}
        />
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(duration)}
        </div>
        
        {/* Status Badge (if processing or error) */}
        {status !== 'ready' && (
          <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
            status === 'processing' 
              ? 'bg-primary/80 text-white' 
              : 'bg-destructive/80 text-white'
          }`}>
            {status === 'processing' ? 'Processing' : 'Error'}
          </div>
        )}
        
        {/* Play Button Overlay on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link to={`/editor?id=${id}`}>
            <Button 
              size="icon" 
              className="rounded-full h-12 w-12 bg-white/30 backdrop-blur-md hover:bg-white/50"
            >
              <Play className="h-6 w-6 text-white" fill="white" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate" title={title}>
              {title}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground space-x-3 mt-1">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VideoThumbnail;
