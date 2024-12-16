import { create } from "zustand";
import { z } from "zod";
import { ImageGenerationFormSchema } from "@/app/(dashboard)/image-generation/_components/Configurations";
import { generateImageAction } from "@/app/actions/image-actions";

interface GenerateState {
  loading: boolean;
  images: Array<{ url: string }>;
  error: string | null;
  generateImage: (
    values: z.infer<typeof ImageGenerationFormSchema>
  ) => Promise<void>;
}

export const useGeneratedStore = create<GenerateState>((set) => ({
  loading: false,
  images: [],
  error: null,
  generateImage: async (values: z.infer<typeof ImageGenerationFormSchema>) => {
    set({ loading: true, error: null });
    try {
      const { error, success, data } = await generateImageAction(values);

      console.log("@error", error);
      console.log("@success", success);
      console.log("@data", data);
      if (!success) {
        set({ error: error, loading: false });
        return;
      }

      const dataWithUrl = data.map((url: string) => {
        return {
          url: url,
        };
      });

      set({ images: dataWithUrl, loading: false });
    } catch (error) {
      set({
        error: "failed to generate image. Please try again",
        loading: false,
      });
    }
  },
}));

export default useGeneratedStore;
