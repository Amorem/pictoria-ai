"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideInfo } from "lucide-react";
import { useEffect } from "react";
import useGeneratedStore from "@/store/useGeneratedSore";

export const ImageGenerationFormSchema = z.object({
  model: z.string({
    required_error: "Model is required",
  }),
  prompt: z.string({
    required_error: "Prompt is required",
  }),
  guidance: z.number({
    required_error: "Guidance scale is required",
  }),
  num_outputs: z
    .number()
    .min(1, {
      message: "Number of outputs should be at least 1",
    })
    .max(4, {
      message: "Number of outputs do not exceed 4",
    }),
  aspect_ratio: z.string({
    required_error: "Aspect ration is required",
  }),
  output_format: z.enum(["webp", "jpg", "png"], {
    required_error: "Output format is required",
  }),
  output_quality: z
    .number()
    .min(1, {
      message: "quality should be at least 1",
    })
    .max(100, { message: "quality does not exceed 100" }),

  num_inference_steps: z
    .number()
    .min(1, {
      message: "inference should be at least 1",
    })
    .max(50, { message: "inference does not exceed 50" }),
});

export function Configurations() {
  const generateImage = useGeneratedStore((state) => state.generateImage);
  const form = useForm<z.infer<typeof ImageGenerationFormSchema>>({
    resolver: zodResolver(ImageGenerationFormSchema),
    defaultValues: {
      model: "black-forest-labs/flux-schnell",
      prompt: "",
      guidance: 3.5,
      num_outputs: 1,
      output_format: "jpg",
      aspect_ratio: "1:1",
      output_quality: 80,
      num_inference_steps: 4,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "model") {
        let newSteps;
        if (value.model === "black-forest-labs/flux-schnell") {
          newSteps = 4;
        } else {
          newSteps = 28;
        }
        if (newSteps !== undefined) {
          form.setValue("num_inference_steps", newSteps);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof ImageGenerationFormSchema>) {
    await generateImage(values);
  }
  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="grid gap-6 p-4 bg-background rounded-lg border">
            <legend className="text-sm -ml-1 px-1 font-medium">Settings</legend>
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Model
                    <Tooltip>
                      <TooltipTrigger>
                        <LucideInfo className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>you can select any model from the dropdown menu</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-forest-labs/flux-dev">
                        Flux Dev
                      </SelectItem>
                      <SelectItem value="black-forest-labs/flux-schnell">
                        Flux Schnell
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 w-full">
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Aspect Ratio
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideInfo className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Aspect ratio for the generated image</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="9:16">9:16</SelectItem>
                        <SelectItem value="21:9">21:9</SelectItem>
                        <SelectItem value="9:21">9:21</SelectItem>
                        <SelectItem value="4:5">4:5</SelectItem>
                        <SelectItem value="5:4">5:4</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                        <SelectItem value="2:3">2:3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Number of Images
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideInfo className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>number of outputs to generate</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="guidance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2 ">
                      Guidance{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideInfo className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Prompt guidance for generated image</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={10}
                      step={0.5}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="num_inference_steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Inference
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideInfo className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Number of denoising steps. Recommanded range is
                            28-50 for dev modem and 1-4 for schnell model
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={1}
                      max={
                        form.getValues("model") ===
                        "black-forest-labs/flux-schnell"
                          ? 4
                          : 50
                      }
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="output_quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Quality
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideInfo className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Quality when saving the output image, form 0
                            (lowest) to 100 (best)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={50}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="output_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      Output Format
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideInfo className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Output format</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an output format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WEBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      Prompt
                      <Tooltip>
                        <TooltipTrigger>
                          <LucideInfo className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Prompt for generated images</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="font-medium">
              Generate
            </Button>
          </fieldset>
        </form>
      </Form>
    </TooltipProvider>
  );
}
