import AppUsersTable from "@/components/tables//app-users/app-users-table";
import { MOCK_USERS } from "@/components/tables/app-users/mock";

export default function AppUsersPage() {
  return <AppUsersTable initialUsers={MOCK_USERS} />;
}
