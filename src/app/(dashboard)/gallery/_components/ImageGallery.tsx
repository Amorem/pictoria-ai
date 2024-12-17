"use client";
import { Tables } from "@/lib/supabase/database.types";
import Image from "next/image";
import { ImageDetails } from "./ImageDetails";
import { useState } from "react";

type ImageProps = {
  url: string | undefined;
} & Tables<"generated_images">;

interface GalleryProps {
  images: ImageProps[];
}

export function ImageGallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        No images found
      </div>
    );
  }

  return (
    <section className="container mx-auto py-8">
      <div className="columns-4 gap-4 space-y-4">
        {images.map((image) => (
          <div key={image.id}>
            <div
              className="relative overflow-hidden cursor-pointer transition-transform group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-70 rounded">
                <div className="flex items-center justify-center h-full">
                  <p className="text-primary-foreground text-lg font-semibold">
                    View details
                  </p>
                </div>
              </div>
              <Image
                src={image.url || ""}
                alt={image.prompt || ""}
                width={image.width || 0}
                height={image.height || 0}
                className="object-cover rounded"
              />
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageDetails
          image={selectedImage}
          onClose={() => {
            setSelectedImage(null);
          }}
        />
      )}
    </section>
  );
}
