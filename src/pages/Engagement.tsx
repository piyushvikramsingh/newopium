import { useMemo, useState } from "react";
import { BarChart3, Flag, Plus, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChallenges, useCreateChallenge, useCreatePoll, useJoinChallenge, usePolls, useVotePoll } from "@/hooks/useEngagement";

const Engagement = () => {
  const { data: polls = [] } = usePolls();
  const { data: challenges = [] } = useChallenges();
  const createPoll = useCreatePoll();
  const votePoll = useVotePoll();
  const createChallenge = useCreateChallenge();
  const joinChallenge = useJoinChallenge();

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptionsText, setPollOptionsText] = useState("Yes,No");

  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeHashtag, setChallengeHashtag] = useState("mychallenge");

  const activeChallenges = useMemo(
    () => challenges.filter((challenge: any) => !challenge.end_date || new Date(challenge.end_date) > new Date()),
    [challenges],
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-20 pt-safe fade-in">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Engagement</h1>
          <p className="text-sm text-muted-foreground mt-1">Polls and challenges to boost interactions.</p>
        </div>

        <Tabs defaultValue="polls" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="polls" className="space-y-4 mt-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Plus className="h-4 w-4" /> Create Poll</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input value={pollQuestion} onChange={(event) => setPollQuestion(event.target.value)} placeholder="Ask your audience a question" />
                <Input value={pollOptionsText} onChange={(event) => setPollOptionsText(event.target.value)} placeholder="Comma-separated options" />
                <Button
                  onClick={() => {
                    const options = pollOptionsText
                      .split(",")
                      .map((option) => option.trim())
                      .filter(Boolean);
                    if (!pollQuestion.trim() || options.length < 2) return;
                    createPoll.mutate({ question: pollQuestion.trim(), options });
                    setPollQuestion("");
                    setPollOptionsText("Yes,No");
                  }}
                  disabled={createPoll.isPending}
                >
                  Create Poll
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {polls.map((poll: any) => (
                <Card key={poll.id} className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><Vote className="h-4 w-4" /> {poll.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {poll.options.map((option: string, index: number) => (
                      <Button
                        key={`${poll.id}-${option}`}
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => votePoll.mutate({ pollId: poll.id, optionIndex: index })}
                        disabled={votePoll.isPending}
                      >
                        <span>{option}</span>
                        <span className="text-xs text-muted-foreground">Vote</span>
                      </Button>
                    ))}
                    <p className="text-xs text-muted-foreground pt-1">Total votes: {poll.total_votes ?? 0}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4 mt-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Flag className="h-4 w-4" /> Create Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input value={challengeTitle} onChange={(event) => setChallengeTitle(event.target.value)} placeholder="Challenge title" />
                <Input value={challengeHashtag} onChange={(event) => setChallengeHashtag(event.target.value.replace(/#/g, ""))} placeholder="Hashtag" />
                <Button
                  onClick={() => {
                    if (!challengeTitle.trim() || !challengeHashtag.trim()) return;
                    createChallenge.mutate({
                      title: challengeTitle.trim(),
                      hashtag: challengeHashtag.trim().toLowerCase(),
                    });
                    setChallengeTitle("");
                  }}
                  disabled={createChallenge.isPending}
                >
                  Create Challenge
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {activeChallenges.map((challenge: any) => (
                <Card key={challenge.id} className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">#{challenge.hashtag}</p>
                    <p className="text-sm text-muted-foreground">Participants: {challenge.participant_count ?? 0}</p>
                    <Button onClick={() => joinChallenge.mutate({ challengeId: challenge.id })} disabled={joinChallenge.isPending}>
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Quick Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Active polls: {polls.length} · Active challenges: {activeChallenges.length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Engagement;
