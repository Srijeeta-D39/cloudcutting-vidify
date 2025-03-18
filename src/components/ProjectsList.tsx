
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import VideoThumbnail from './VideoThumbnail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FilterX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  createdAt: string;
  status: 'ready' | 'processing' | 'error';
}

interface ProjectsListProps {
  videos: Video[];
}

const ProjectsList = ({ videos }: ProjectsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(videos);
  
  // Filter videos based on search query
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video => 
        video.title.toLowerCase().includes(query)
      );
      setFilteredVideos(filtered);
    }
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredVideos(videos);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FilterX className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Link to="/dashboard/upload">
          <Button className="whitespace-nowrap group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            New Project
          </Button>
        </Link>
      </div>
      
      {/* Video grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <VideoThumbnail
              key={video.id}
              id={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              createdAt={video.createdAt}
              status={video.status}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-lg font-medium mb-2">No videos found</p>
          {searchQuery ? (
            <p className="text-muted-foreground">
              No videos match your search. Try a different query or{' '}
              <button
                className="text-primary hover:underline"
                onClick={clearSearch}
              >
                clear your search
              </button>.
            </p>
          ) : (
            <p className="text-muted-foreground">
              You haven't created any video projects yet.{' '}
              <Link to="/dashboard/upload" className="text-primary hover:underline">
                Create your first project
              </Link>
              .
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProjectsList;
