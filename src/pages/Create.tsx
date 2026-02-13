import { Camera, Image, Zap } from "lucide-react";

const Create = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-8 pb-20">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <Camera className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Create a video</h2>
        <p className="text-center text-sm text-muted-foreground">
          Record, edit, and share your moment with the world.
        </p>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            <Zap className="h-4 w-4" />
            Record
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground">
            <Image className="h-4 w-4" />
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
