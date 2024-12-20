import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/lib/supabase/database.types";
import Link from "next/link";
import { formatDistance } from "date-fns";
import {
  LucideCheckCircle2,
  LucideClock,
  LucideLoader2,
  LucideTrash2,
  LucideUser2,
  LucideXCircle,
} from "lucide-react";

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

type ModelType = {
  error: string | null;
  success: boolean;
  data: Database["public"]["Tables"]["models"]["Row"][] | null;
};

interface ModelsListProps {
  models: ModelType;
}

export function ModelsList({ models }: ModelsListProps) {
  const { data, success, error } = models;

  if (data?.length === 0) {
    return (
      <Card className="flex h-[450px] flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>No Model found</CardTitle>
          <CardDescription>
            You have not trained any models yet. Start by creating a new model
          </CardDescription>
          <Link href="/model-training" className="inline-block pt-2">
            <Button className="w-fit">Create Model</Button>
          </Link>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {data?.map((model) => (
        <Card
          key={model.id}
          className="relative flex flex-col overflow-hidden max-w-96"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{model.model_name}</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  {model.training_status === "succeeded" && (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <LucideCheckCircle2 className="w-4 h-4 " />
                      <span className="capitalize">Ready</span>
                    </div>
                  )}
                  {model.training_status === "failed" && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <LucideXCircle className="w-4 h-4 " />
                      <span className="capitalize">Failed</span>
                    </div>
                  )}
                  {model.training_status === "canceled" && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <LucideXCircle className="w-4 h-4 " />
                      <span className="capitalize">Canceled</span>
                    </div>
                  )}
                  {model.training_status === "processing" && (
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <LucideLoader2 className="w-4 h-4 animate-spin" />
                      <span className="capitalize">Running</span>
                    </div>
                  )}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-8 h-8 text-destructive/90 hover:text-destructive"
                    >
                      <LucideTrash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Model</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardDescription>
              created{" "}
              {formatDistance(new Date(model.created_at), new Date(), {
                addSuffix: true,
              })}
            </CardDescription>
            <CardContent className="flex-1 p-0 pt-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted px-3 py-2 ">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LucideClock className="w-4 h-4" />
                      <span>Training duration</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {`${Math.round(
                        Number(model.training_time) / 60
                      )} minutes`}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2 ">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LucideUser2 className="w-4 h-4" />
                      <span>Training duration</span>
                    </div>
                    <p className="mt-1 font-medium">{model.gender}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
  return <div></div>;
}
