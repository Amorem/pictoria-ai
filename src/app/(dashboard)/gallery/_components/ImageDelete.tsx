import { deleteImage } from "@/app/actions/image-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideTrash2 } from "lucide-react";
import { useId } from "react";
import { toast } from "sonner";

interface DeleteImageProps {
  imageId: string;
  imageName: string;
  onDelete?: () => void;
  className?: string;
}

export function DeleteImage({
  imageId,
  imageName,
  onDelete,
  className,
}: DeleteImageProps) {
  const toastId = useId();
  async function handleDelete() {
    toast.loading("Deleting image...", { id: toastId });
    const { error, success } = await deleteImage(imageId, imageName);
    if (error) {
      toast.error(error.toString() || "An error occured", { id: toastId });
    } else if (success) {
      toast.success("Image deleted", {
        id: toastId,
      });
      onDelete?.();
    } else {
      toast.dismiss(toastId);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={cn("w-fit", className)} variant={"destructive"}>
          <LucideTrash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            image from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
