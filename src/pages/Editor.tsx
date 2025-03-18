
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import VideoEditor from '@/components/VideoEditor';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getVideo } from '@/lib/aws';
import { ArrowLeft, Save } from 'lucide-react';

const Editor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('Untitled');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if video URL is in search params (from upload)
    const urlParam = searchParams.get('videoUrl');
    const fileNameParam = searchParams.get('fileName');
    
    if (urlParam) {
      setVideoUrl(urlParam);
      if (fileNameParam) setFileName(fileNameParam);
      setIsLoading(false);
    } else {
      // If no URL in params, check if there's a video ID to load from "backend"
      const videoId = searchParams.get('id');
      
      if (videoId) {
        // In a real app, fetch the video from your backend
        getVideo(videoId).then(video => {
          setVideoUrl(video.videoUrl);
          setFileName(video.title);
          setIsLoading(false);
        }).catch(error => {
          console.error('Error loading video:', error);
          toast({
            title: 'Error',
            description: 'Failed to load the video. Please try again.',
            variant: 'destructive'
          });
          setIsLoading(false);
          navigate('/dashboard');
        });
      } else {
        // No video URL or ID, redirect to dashboard
        toast({
          title: 'Error',
          description: 'No video selected for editing',
          variant: 'destructive'
        });
        navigate('/dashboard');
      }
    }
  }, [searchParams, navigate]);
  
  const handleSave = (processedUrl: string, settings: any) => {
    console.log('Video processed:', processedUrl, settings);
    
    // In a real app, save the processed video to your backend
    
    // Redirect to dashboard after processing
    setTimeout(() => {
      toast({
        title: 'Success',
        description: 'Your video has been processed and saved to your projects.',
      });
      navigate('/dashboard');
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="container py-8">
            <div className="flex justify-center items-center min-h-[500px]">
              <div className="flex flex-col items-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Loading editor...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Project
            </Button>
          </div>
          
          {videoUrl && (
            <VideoEditor 
              videoUrl={videoUrl} 
              fileName={fileName}
              onSave={handleSave}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Editor;
