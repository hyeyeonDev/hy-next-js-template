import { UserEditPage } from "@/components/features/users/UserEditPage";

export default async function UserEditRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserEditPage id={Number(id)} />;
}
