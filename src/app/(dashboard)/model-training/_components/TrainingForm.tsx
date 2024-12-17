"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useId } from "react";
import { getPresignedStorageUrl } from "@/app/actions/model";

const ACCEPTED_ZIP_FILES = ["application/x-zip-compressed", "application/zip"];
const MAX_FILE_SIZE = 45 * 1024 * 1024;

const formSchema = z.object({
  modelName: z.string({
    required_error: "Model name is required",
  }),
  gender: z.enum(["man", "woman"]),
  zipFile: z
    .any()
    .refine((files) => files?.[0] instanceof File, "Please select a valid file")
    .refine(
      (files) =>
        files?.[0]?.type && ACCEPTED_ZIP_FILES.includes(files?.[0]?.type),
      "Only ZIP files are accepted"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size allowed is 45 MB"
    ), // 45MB
});

export function TrainingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      gender: "man",
      zipFile: undefined,
    },
  });

  const fileRef = form.register("zipFile");

  const toastId = useId();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Uploading file...", {
      id: toastId,
    });

    try {
      const data = await getPresignedStorageUrl(values.zipFile[0].name);
    } catch {}
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="grid max-w-5xl bg-background p-8 rounded-lg gap-6 border ">
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Enter model name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be the name of your trained model
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Please select the gender of the images</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="man" />
                      </FormControl>
                      <FormLabel className="font-normal">Man</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="woman" />
                      </FormControl>
                      <FormLabel className="font-normal">Woman</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Training Data (ZIP file){" "}
                  <span className="text-destructive">
                    {" "}
                    * read the requirements below *
                  </span>
                </FormLabel>
                <div className="mb-4 rounded-lg shadow-sm pb-4 text-card-foreground">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      When training your custom model, ensure 10-15 images in
                      total
                    </li>
                    <li className="italic">
                      Recommended breakdown (for 12 images):
                    </li>
                    <ul className="ml-4 mt-1 space-y-1">
                      <ul>- 6 face closeups</ul>
                      <ul>- 4 half body closeups</ul>
                      <ul>- 2 full body shots</ul>
                    </ul>
                    <li>• No accessories on face/head idealy</li>
                    <li>• No others people in images</li>
                    <li>
                      • Different expressions, clothing, backgrounds, with good
                      lightning
                    </li>
                    <li>• Images to be 1:1 resolution (1048x1048 or higher)</li>
                    <li>• ZIP file under 45MB total size</li>
                  </ul>
                </div>
                <FormControl>
                  <Input type="file" accept=".zip" {...fileRef} />
                </FormControl>
                <FormDescription>
                  Upload a ZIP file containing your training images (max 45 MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-fit
          "
            type="submit"
          >
            Submit
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
