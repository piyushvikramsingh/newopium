import { useMemo, useState } from "react";
import { CalendarClock, Radio, Send, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateLiveStream, useLiveComments, useLiveStreams, useSendLiveComment, useUpdateStreamStatus } from "@/hooks/useLive";

const LiveStreaming = () => {
  const { data: streams = [] } = useLiveStreams();
  const createStream = useCreateLiveStream();
  const updateStreamStatus = useUpdateStreamStatus();
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);
  const { data: comments = [] } = useLiveComments(selectedStreamId);
  const sendComment = useSendLiveComment();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledStart, setScheduledStart] = useState("");
  const [commentText, setCommentText] = useState("");

  const liveStreams = useMemo(() => streams.filter((stream: any) => stream.status === "live"), [streams]);
  const scheduledStreams = useMemo(
    () => streams.filter((stream: any) => stream.status === "scheduled"),
    [streams],
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-20 pt-safe fade-in">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Streaming</h1>
          <p className="text-sm text-muted-foreground mt-1">Go live now or schedule a live session.</p>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Video className="h-4 w-4" /> Create Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Stream title" />
            <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
            <Input
              type="datetime-local"
              value={scheduledStart}
              onChange={(event) => setScheduledStart(event.target.value)}
              placeholder="Optional schedule"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  if (!title.trim()) return;
                  createStream.mutate({ title: title.trim(), description: description || null });
                  setTitle("");
                  setDescription("");
                }}
                disabled={createStream.isPending}
              >
                Go Live Now
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (!title.trim() || !scheduledStart) return;
                  createStream.mutate({
                    title: title.trim(),
                    description: description || null,
                    scheduled_start: new Date(scheduledStart).toISOString(),
                  });
                  setTitle("");
                  setDescription("");
                  setScheduledStart("");
                }}
                disabled={createStream.isPending}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="live">Live ({liveStreams.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({scheduledStreams.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="grid gap-4 md:grid-cols-2 mt-4">
            {liveStreams.map((stream: any) => (
              <Card key={stream.id} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Radio className="h-4 w-4 text-red-500" /> {stream.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stream.description || "No description"}</p>
                  <p className="text-sm">Viewers: {stream.viewer_count ?? 0}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setSelectedStreamId(stream.id)}>Open Chat</Button>
                    <Button variant="destructive" onClick={() => updateStreamStatus.mutate({ streamId: stream.id, status: "ended" })}>
                      End Stream
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="scheduled" className="grid gap-4 md:grid-cols-2 mt-4">
            {scheduledStreams.map((stream: any) => (
              <Card key={stream.id} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">{stream.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Starts: {stream.scheduled_start ? new Date(stream.scheduled_start).toLocaleString() : "TBD"}</p>
                  <Button onClick={() => updateStreamStatus.mutate({ streamId: stream.id, status: "live" })}>Start Now</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {selectedStreamId && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3">
                {comments.map((comment: any) => (
                  <p key={comment.id} className="text-sm">
                    <span className="text-muted-foreground">{new Date(comment.created_at).toLocaleTimeString()} · </span>
                    {comment.content}
                  </p>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Send message" />
                <Button
                  onClick={() => {
                    if (!commentText.trim()) return;
                    sendComment.mutate({ streamId: selectedStreamId, content: commentText.trim() });
                    setCommentText("");
                  }}
                  disabled={sendComment.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LiveStreaming;
