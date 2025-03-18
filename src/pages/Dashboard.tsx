
import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import VideoUploader from '@/components/VideoUploader';
import ProjectsList from '@/components/ProjectsList';
import { Card } from '@/components/ui/card';
import { listVideos } from '@/lib/aws';

const DashboardUpload = () => {
  const navigate = useNavigate();
  
  const handleUploadComplete = (videoUrl: string, fileName: string) => {
    // In a real app, you would save the video info to your database
    console.log('Upload complete:', videoUrl, fileName);
    
    // Redirect to editor with the uploaded video
    setTimeout(() => {
      navigate(`/editor?videoUrl=${encodeURIComponent(videoUrl)}&fileName=${encodeURIComponent(fileName)}`);
    }, 1000);
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="text-center mb-8">
        <h1 className="heading-2 mb-4">Upload a Video</h1>
        <p className="subtitle">
          Upload a video to start editing. You can upload videos up to 1GB in size.
        </p>
      </div>
      
      <Card className="p-6 md:p-8">
        <VideoUploader onUploadComplete={handleUploadComplete} />
      </Card>
    </div>
  );
};

const DashboardProjects = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await listVideos();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="heading-2 mb-8">My Projects</h1>
      <ProjectsList videos={videos} />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={<DashboardProjects />} />
          <Route path="/upload" element={<DashboardUpload />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
