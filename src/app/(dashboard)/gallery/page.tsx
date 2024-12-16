import { getImages } from "@/app/actions/image-actions";
import { ImageGallery } from "./_components/ImageGallery";

export default async function GalleryPage() {
  const { data: images } = await getImages();

  return (
    <section className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-2">My Images</h1>
      <p className="text-muted-foreground mb-6">
        Here you can see all the images you have generated. Click on an email to
        view details
      </p>
      <ImageGallery images={images || []} />
    </section>
  );
}
