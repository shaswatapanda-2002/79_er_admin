import AgenciesClient from "@/components/tables/agencies/agencies-client";
import { MOCK_AGENCIES } from "@/components/tables/agencies/mock";

export default function AgenciesPage() {
  return <AgenciesClient initial={MOCK_AGENCIES} />;
}
