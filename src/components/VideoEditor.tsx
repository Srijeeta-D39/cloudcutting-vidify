
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { processVideo } from '@/lib/aws';
import {
  Play, Pause, SkipBack, SkipForward, Scissors, Save, Download,
  Volume2, VolumeX, Crop, Image, Type, Palette, Layers
} from 'lucide-react';

interface VideoEditorProps {
  videoUrl: string;
  fileName: string;
  onSave?: (processedVideoUrl: string, settings: any) => void;
}

const VideoEditor = ({ videoUrl, fileName, onSave }: VideoEditorProps) => {
  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // Editor state
  const [activeTab, setActiveTab] = useState('trim');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100); // Percentage of video duration
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState(fileName.split('.')[0] || 'Untitled');
  
  // Initialize video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded successfully");
      setDuration(video.duration);
      setTrimEnd(100); // Reset trim end to 100% when new video loads
      setVideoError(null);
    };
    
    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setVideoError("Failed to load video. Please check the video URL or format.");
      toast({
        title: "Video Error",
        description: "Could not load the video. The format might be unsupported.",
        variant: "destructive"
      });
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    
    // Make sure the video source is set correctly
    if (video.src !== videoUrl) {
      video.src = videoUrl;
      video.load();
    }
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);
  
  // Update time display
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);
  
  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      console.log("Attempting to play video");
      video.play().catch(error => {
        console.error('Error playing video:', error);
        setIsPlaying(false);
        toast({
          title: "Playback Error",
          description: "Could not play the video. Please try again.",
          variant: "destructive"
        });
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  
  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Playback controls
  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const toggleMute = () => setIsMuted(!isMuted);
  
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };
  
  const handleTrimChange = (values: number[]) => {
    setTrimStart(values[0]);
    setTrimEnd(values[1]);
  };
  
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.min(video.currentTime + 5, duration);
    video.currentTime = newTime;
  };
  
  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(video.currentTime - 5, 0);
    video.currentTime = newTime;
  };
  
  // Process video based on editor settings
  const handleProcessVideo = async () => {
    setIsProcessing(true);
    
    try {
      // Prepare settings object to send to backend
      const editorSettings = {
        title,
        trim: {
          start: (trimStart / 100) * duration,
          end: (trimEnd / 100) * duration
        },
        fileName,
        // Add other settings as needed
      };
      
      // Simulate processing with AWS
      const result = await processVideo(videoUrl, editorSettings);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(result.processedVideoUrl, editorSettings);
      }
      
      toast({
        title: "Processing Complete",
        description: "Your video has been processed successfully.",
      });
      
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="w-full space-y-4">
      {/* Video Title Input */}
      <div className="flex items-center space-x-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium"
          placeholder="Enter video title"
        />
      </div>
      
      {/* Video Preview */}
      <Card className="overflow-hidden bg-black rounded-lg shadow-lg">
        <div className="relative aspect-video">
          {videoError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/90 p-4">
              <div className="text-destructive text-lg mb-2">Error loading video</div>
              <div className="text-sm text-center max-w-md">{videoError}</div>
            </div>
          ) : null}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
            onEnded={() => setIsPlaying(false)}
            controls={false}
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Video Controls */}
        <div className="bg-background/95 backdrop-blur-sm border-t p-4 space-y-2">
          {/* Progress bar */}
          <div className="pb-2">
            <Slider
              value={[Math.round((currentTime / duration) * 100) || 0]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>
          
          {/* Time display and controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipBackward}
                aria-label="Skip backward 5 seconds"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="h-10 w-10 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={skipForward}
                aria-label="Skip forward 5 seconds"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </Card>
      
      {/* Editing Tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="trim" className="flex items-center space-x-2">
            <Scissors className="h-4 w-4" />
            <span>Trim</span>
          </TabsTrigger>
          <TabsTrigger value="crop" className="flex items-center space-x-2">
            <Crop className="h-4 w-4" />
            <span>Crop</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Filters</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="overlay" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Overlay</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trim" className="pt-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Trim Video</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>
                    Start: {formatTime((trimStart / 100) * duration)}
                  </span>
                  <span>
                    End: {formatTime((trimEnd / 100) * duration)}
                  </span>
                </div>
                <Slider
                  value={[trimStart, trimEnd]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={handleTrimChange}
                  className="cursor-pointer"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Drag the handles to select the part of the video you want to keep.
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="crop" className="pt-4">
          <Card className="p-4 text-center">
            <h3 className="text-lg font-medium mb-4">Crop Video</h3>
            <p className="text-muted-foreground">
              Crop functionality will be available in a future update.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="filters" className="pt-4">
          <Card className="p-4 text-center">
            <h3 className="text-lg font-medium mb-4">Video Filters</h3>
            <p className="text-muted-foreground">
              Filter functionality will be available in a future update.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="text" className="pt-4">
          <Card className="p-4 text-center">
            <h3 className="text-lg font-medium mb-4">Add Text</h3>
            <p className="text-muted-foreground">
              Text overlay functionality will be available in a future update.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="overlay" className="pt-4">
          <Card className="p-4 text-center">
            <h3 className="text-lg font-medium mb-4">Add Overlays</h3>
            <p className="text-muted-foreground">
              Overlay functionality will be available in a future update.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={handleProcessVideo} disabled={isProcessing}>
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Process Video
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoEditor;
