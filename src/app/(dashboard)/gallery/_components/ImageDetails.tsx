import { Tables } from "@/lib/supabase/database.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LucideDownload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DeleteImage } from "./ImageDelete";

interface ImageDialogProps {
  image: { url: string | undefined } & Tables<"generated_images">;
  onClose: () => void;
}

export function ImageDetails({ image, onClose }: ImageDialogProps) {
  function handleDownload() {
    if (image.url) {
      fetch(image.url)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `generated-image-${Date.now()}.${image?.output_format}`
          );

          document.body.appendChild(link);
          link.click();

          // Cleanup
          link.parentNode?.removeChild(link);
        })
        .catch((error) => console.log("error", error));
    }
  }

  return (
    <div>
      <Sheet open onOpenChange={onClose}>
        <SheetContent className="max-w-full sm:max-w-xl w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl w-full">Image Details</SheetTitle>
            <ScrollArea className="flex flex-col h-[100vh]">
              <div className="relative w-fit h-fit">
                <Image
                  src={image.url || ""}
                  alt={image.prompt || ""}
                  width={image.width || 0}
                  height={image.height || 0}
                  className="w-full h-auto flex mb-3 rounded"
                />
                <div className="flex gap-4 absolute bottom-4 right-4">
                  <Button className="w-fit" onClick={handleDownload}>
                    <LucideDownload className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <DeleteImage
                    imageId={image.id.toString()}
                    imageName={image.image_name?.toString() || ""}
                    onDelete={onClose}
                  />
                </div>
              </div>
              <hr className="inline-block w-full border-primary/30 mb-2" />
              <p className="text-primary/90 flex flex-col w-full">
                <span className="text-primary text-xl font-semibold">
                  Prompt
                </span>
                {image.prompt}
              </p>
              <hr className="inline-block w-full border-primary/30 my-3" />
              <div className="flex flex-wrap gap-3 mb-32">
                <Badge
                  variant={"secondary"}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
                >
                  <span className="text-primary font-semibold uppercase mr-2">
                    Model ID:
                  </span>
                  {image.model}
                </Badge>

                <Badge
                  variant={"secondary"}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
                >
                  <span className="text-primary font-semibold uppercase mr-2">
                    Aspect Ratio:
                  </span>
                  {image.aspect_ratio}
                </Badge>

                <Badge
                  variant={"secondary"}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
                >
                  <span className="text-primary font-semibold uppercase mr-2">
                    Dimensions:
                  </span>
                  {image.width}x{image.height}px
                </Badge>

                <Badge
                  variant={"secondary"}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
                >
                  <span className="text-primary font-semibold uppercase mr-2">
                    Guidance:
                  </span>
                  {image.guidance}
                </Badge>

                <Badge
                  variant={"secondary"}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
                >
                  <span className="text-primary font-semibold uppercase mr-2">
                    Inference:
                  </span>
                  {image.num_inference_steps}
                </Badge>

                <Badge
                  variant={"secondary"}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
                >
                  <span className="text-primary font-semibold uppercase mr-2">
                    Output Format:
                  </span>
                  {image.output_format}
                </Badge>

                <Badge
                  variant={"secondary"}
                  className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
                >
                  <span className="text-primary font-semibold uppercase mr-2">
                    Created at:
                  </span>
                  {new Date(image.created_at).toLocaleDateString()}
                </Badge>
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
