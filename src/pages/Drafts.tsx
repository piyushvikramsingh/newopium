import { useState } from "react";
import {
  FileText,
  Clock,
  Edit,
  Trash2,
  Calendar,
  Play,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useDrafts,
  useScheduledPosts,
  useDeleteDraft,
  useCancelScheduledPost,
  useSchedulePost,
} from "@/hooks/useDrafts";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

const Drafts = () => {
  const navigate = useNavigate();
  const { data: drafts = [], isLoading: draftsLoading } = useDrafts();
  const { data: scheduledPosts = [], isLoading: scheduledLoading } =
    useScheduledPosts();
  const deleteDraft = useDeleteDraft();
  const cancelScheduledPost = useCancelScheduledPost();
  const schedulePost = useSchedulePost();

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<any>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSchedule = () => {
    if (!selectedDraft || !scheduledDate || !scheduledTime) return;

    const scheduledFor = `${scheduledDate}T${scheduledTime}:00`;

    schedulePost.mutate(
      {
        video_url: selectedDraft.media_url,
        thumbnail_url: selectedDraft.thumbnail_url,
        description: selectedDraft.description,
        scheduled_for: scheduledFor,
      },
      {
        onSuccess: () => {
          setScheduleDialogOpen(false);
          setSelectedDraft(null);
          setScheduledDate("");
          setScheduledTime("");
        },
      }
    );
  };

  const handleDeleteDraft = (draftId: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deleteDraft.mutate(draftId);
    }
  };

  const handleCancelScheduled = (postId: string) => {
    if (confirm("Cancel this scheduled post?")) {
      cancelScheduledPost.mutate(postId);
    }
  };

  const openScheduleDialog = (draft: any) => {
    setSelectedDraft(draft);
    setScheduleDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20 pt-safe fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Drafts & Scheduled</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your drafts and scheduled posts
          </p>
        </div>

        <Tabs defaultValue="drafts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Drafts ({drafts.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Scheduled (
              {scheduledPosts.filter((p: any) => p.status === "pending").length})
            </TabsTrigger>
          </TabsList>

          {/* Drafts Tab */}
          <TabsContent value="drafts">
            {draftsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : drafts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.map((draft: any) => (
                  <Card
                    key={draft.id}
                    className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[9/16] bg-gray-100">
                      {draft.thumbnail_url || draft.media_url ? (
                        <img
                          src={draft.thumbnail_url || draft.media_url}
                          alt="Draft thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8 rounded-full"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                navigate("/create", {
                                  state: { draftId: draft.id, fromDrafts: true },
                                });
                                toast.success("Opening draft in Create");
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openScheduleDialog(draft)}
                              disabled={!draft.media_url}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDraft(draft.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {draft.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(draft.updated_at), "MMM d, yyyy")}
                        </span>
                        {draft.media_url && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Play className="w-3 h-3" />
                            Ready
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No drafts yet
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Start creating content and save it as a draft
                </p>
                <Button onClick={() => navigate("/create")}>
                  Create Video
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Scheduled Tab */}
          <TabsContent value="scheduled">
            {scheduledLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : scheduledPosts.filter((p: any) => p.status === "pending")
                .length > 0 ? (
              <div className="space-y-4">
                {scheduledPosts
                  .filter((p: any) => p.status === "pending")
                  .map((post: any) => (
                    <Card key={post.id} className="rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {post.thumbnail_url ? (
                              <img
                                src={post.thumbnail_url}
                                alt="Scheduled post"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Clock className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                              {post.description || "No description"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(
                                  new Date(post.scheduled_for),
                                  "MMM d, yyyy 'at' h:mm a"
                                )}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full ${
                                  post.status === "pending"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {post.status}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelScheduled(post.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No scheduled posts
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Schedule your drafts to post at a specific time
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Schedule Dialog */}
        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDraft?.thumbnail_url && (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedDraft.thumbnail_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSchedule}
                disabled={
                  !scheduledDate || !scheduledTime || schedulePost.isPending
                }
                className="w-full"
              >
                {schedulePost.isPending ? "Scheduling..." : "Schedule Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Drafts;
