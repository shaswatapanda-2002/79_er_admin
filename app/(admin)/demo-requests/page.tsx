import DemoRequestsClient from "@/components/tables/demo-requests/demo-requests-client";
import { MOCK_DEMO_REQUESTS } from "@/components/tables/demo-requests/mock";

export default function DemoRequestsPage() {
  return <DemoRequestsClient initial={MOCK_DEMO_REQUESTS} />;
}
