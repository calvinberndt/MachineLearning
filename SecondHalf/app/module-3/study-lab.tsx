import { Module3LabProvider } from "./labs/lab-context";
import { ConceptKMeans } from "./concept-kmeans";
import { ConceptKnn } from "./concept-knn";
import { ConceptSvm } from "./concept-svm";

export function Module3Content() {
  return (
    <Module3LabProvider>
      <ConceptKMeans />
      <ConceptKnn />
      <ConceptSvm />
    </Module3LabProvider>
  );
}
