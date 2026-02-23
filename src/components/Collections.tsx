import { useState } from "react";
import {
  Plus,
  Grid,
  Lock,
  Globe,
  MoreVertical,
  Trash2,
  Edit,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "@/hooks/useCollections";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Collections = ({ userId }: { userId?: string }) => {
  const navigate = useNavigate();
  const { data: collections = [], isLoading } = useCollections(userId);
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: false,
  });

  const handleCreate = () => {
    createCollection.mutate(formData, {
      onSuccess: () => {
        setCreateDialogOpen(false);
        setFormData({ name: "", description: "", is_public: false });
      },
    });
  };

  const handleUpdate = () => {
    if (!editingCollection) return;
    updateCollection.mutate(
      {
        id: editingCollection.id,
        ...formData,
      },
      {
        onSuccess: () => {
          setEditingCollection(null);
          setFormData({ name: "", description: "", is_public: false });
        },
      }
    );
  };

  const handleDelete = (collectionId: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      deleteCollection.mutate(collectionId);
    }
  };

  const openEditDialog = (collection: any) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || "",
      is_public: collection.is_public,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Collections</h2>
          <p className="text-sm text-gray-500">
            Organize your saved videos
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="My Favorites"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Videos I love..."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="public">Public Collection</Label>
                <Switch
                  id="public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_public: checked })
                  }
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={!formData.name.trim() || createCollection.isPending}
                className="w-full"
              >
                {createCollection.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {collections.map((collection: any) => (
          <div
            key={collection.id}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate(`/collections/${collection.id}`)}
          >
            {/* Cover image or grid */}
            {collection.cover_url ? (
              <img
                src={collection.cover_url}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Grid className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {collection.name}
                  </h3>
                  <p className="text-white/70 text-xs mt-1">
                    {collection.video_count} videos
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {collection.is_public ? (
                    <Globe className="w-3.5 h-3.5 text-white/70" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-white/70" />
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 text-white hover:bg-white/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(collection);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async (e) => {
                          e.stopPropagation();
                          const shareUrl = `${window.location.origin}/profile?collection=${collection.id}`;
                          try {
                            await navigator.clipboard.writeText(shareUrl);
                            toast.success("Collection link copied");
                          } catch {
                            toast.error("Could not copy collection link");
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(collection.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-16">
          <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No collections yet
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Create collections to organize your saved videos
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Collection
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCollection}
        onOpenChange={(open) => !open && setEditingCollection(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-public">Public Collection</Label>
              <Switch
                id="edit-public"
                checked={formData.is_public}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_public: checked })
                }
              />
            </div>
            <Button
              onClick={handleUpdate}
              disabled={!formData.name.trim() || updateCollection.isPending}
              className="w-full"
            >
              {updateCollection.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
