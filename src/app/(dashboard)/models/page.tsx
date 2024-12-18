import { fetchModels } from "@/app/actions/model";
import { ModelsList } from "./_components/ModelsList";

export default async function ModelsPage() {
  const data = await fetchModels();

  console.log(data);

  return (
    <section className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Models</h1>
        <p className="text-muted-foreground mt-2 ">
          View and manager trained models
        </p>
      </div>
      <ModelsList models={data} />
    </section>
  );
}
