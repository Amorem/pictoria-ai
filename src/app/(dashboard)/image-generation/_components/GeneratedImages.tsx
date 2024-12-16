"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useGeneratedStore from "@/store/useGeneratedSore";
import Image from "next/image";

// const images = [
//   {
//     src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
//     alt: "Charismatic Young Man",
//   },
//   {
//     src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
//     alt: "Confident Businesswoman",
//   },
//   {
//     src: "/hero-images/Futuristic Helmet Portrait.jpeg",
//     alt: "Futuristic Helmet Portrait",
//   },
//   {
//     src: "/hero-images/Sophisticated Businessman Portrait.jpeg",
//     alt: "Sophisticated Businessman Portrait",
//   },
// ];

export function GeneratedImages() {
  const images = useGeneratedStore((state) => state.images);
  const loading = useGeneratedStore((state) => state.loading);

  if (images.length === 0) {
    return (
      <Card className="w-full max-w-2xl bg-muted">
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <span className="text-2xl">No images generated</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
              <Image
                src={image.url}
                alt={"generated images using AI"}
                fill
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
