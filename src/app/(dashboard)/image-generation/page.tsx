import { Configurations } from "./_components/Configurations";
import { GeneratedImages } from "./_components/GeneratedImages";

export default function ImageGenerationPage() {
  return (
    <section className="container mx-auto grid gap-4 grid-cols-3 overflow-hidden">
      <Configurations />
      <div className="col-span-2 p-4 rounded-xl flex items-center justify-center h-fit">
        <GeneratedImages />
      </div>
    </section>
  );
}
