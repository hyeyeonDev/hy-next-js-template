"use client";

import { useMemo, useState } from "react";
import { Building2, Edit, Shield } from "lucide-react";

import { RoleGuard } from "@/components/auth";
import { DataTable } from "@/components/data-display";
import { FormField, SearchInput } from "@/components/forms";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { Badge, Button, Card, Checkbox, Input, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useCreateOrganizationMutation, useOrganizationsQuery, useUpdateOrganizationMutation } from "@/hooks/queries";
import type { Organization, TableColumn } from "@/types";

export function OrganizationPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);

  const organizationsQuery = useOrganizationsQuery({ page, pageSize: 10, search });
  const createOrganization = useCreateOrganizationMutation();
  const updateOrganization = useUpdateOrganizationMutation();

  const columns = useMemo<TableColumn<Organization>[]>(
    () => [
      { key: "code", label: "조직코드", width: "120px" },
      { key: "name", label: "조직명" },
      { key: "description", label: "설명" },
      {
        key: "isActive",
        label: "상태",
        width: "100px",
        render: (value) => (
          <Badge variant={value ? "success" : "secondary"} dot>
            {value ? "활성" : "비활성"}
          </Badge>
        ),
      },
      {
        key: "createdAt",
        label: "등록일",
        width: "120px",
        render: (value) => new Date(String(value)).toLocaleDateString("ko-KR"),
      },
    ],
    [],
  );

  return (
    <AdminLayout title="조직관리">
      <RoleGuard
        roles={["admin"]}
        fallback={
          <Card className="mx-auto max-w-xl text-center">
            <Shield className="mx-auto h-8 w-8 text-danger-500" aria-hidden="true" />
            <h1 className="mt-3 text-lg font-semibold text-text">접근 권한이 없습니다</h1>
            <p className="mt-1 text-sm text-text-muted">조직관리는 관리자만 접근할 수 있습니다.</p>
          </Card>
        }
      >
        <PageWrapper title="조직관리" description="조직코드, 조직명, 설명, 활성화 여부를 관리합니다.">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-4">
              <Card>
                <FormField label="조직 검색">
                  <SearchInput
                    placeholder="조직코드, 조직명 검색"
                    onSearch={(value) => {
                      setSearch(value);
                      setPage(1);
                    }}
                  />
                </FormField>
              </Card>

              <DataTable
                columns={columns}
                data={(organizationsQuery.data?.data ?? []) as Organization[]}
                loading={organizationsQuery.isLoading}
                emptyMessage="등록된 조직이 없습니다."
                onRowClick={(row) => setEditingOrganization(row)}
                pagination={
                  organizationsQuery.data?.pagination
                    ? {
                        page: organizationsQuery.data.pagination.page,
                        pageSize: organizationsQuery.data.pagination.pageSize,
                        total: organizationsQuery.data.pagination.total,
                        totalPages: organizationsQuery.data.pagination.totalPages,
                        onChange: setPage,
                      }
                    : undefined
                }
              />
              {organizationsQuery.isError && <p className="text-sm text-danger-600">{organizationsQuery.error.message}</p>}
            </div>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-semibold text-text">
                  {editingOrganization ? <Edit className="h-4 w-4" aria-hidden="true" /> : <Building2 className="h-4 w-4" aria-hidden="true" />}
                  {editingOrganization ? "조직 수정" : "조직 추가"}
                </h2>
                {editingOrganization && (
                  <Button type="button" size="xs" variant="outline" onClick={() => setEditingOrganization(null)}>
                    신규 등록
                  </Button>
                )}
              </div>
              {editingOrganization ? (
                <OrganizationForm
                  key={`edit-${editingOrganization.id}`}
                  organization={editingOrganization}
                  submitLabel="저장"
                  loading={updateOrganization.isPending}
                  errorMessage={updateOrganization.isError ? updateOrganization.error.message : undefined}
                  onSubmit={(value) => {
                    updateOrganization.mutate(
                      { id: editingOrganization.id, dto: value },
                      {
                        onSuccess: (updated) => {
                          setEditingOrganization(updated);
                          toast("조직이 수정되었습니다.", "success");
                        },
                      },
                    );
                  }}
                />
              ) : (
                <OrganizationForm
                  key="create"
                  loading={createOrganization.isPending}
                  errorMessage={createOrganization.isError ? createOrganization.error.message : undefined}
                  onSubmit={(value, reset) => {
                    createOrganization.mutate(value, {
                      onSuccess: () => {
                        reset();
                        toast("조직이 추가되었습니다.", "success");
                      },
                    });
                  }}
                />
              )}
            </Card>
          </div>
        </PageWrapper>
      </RoleGuard>
    </AdminLayout>
  );
}

function OrganizationForm({
  organization,
  submitLabel = "추가",
  loading,
  errorMessage,
  onSubmit,
}: {
  organization?: Organization;
  submitLabel?: string;
  loading?: boolean;
  errorMessage?: string;
  onSubmit: (value: { code: string; name: string; description?: string; isActive: boolean }, reset: () => void) => void;
}) {
  const [code, setCode] = useState(organization?.code ?? "");
  const [name, setName] = useState(organization?.name ?? "");
  const [description, setDescription] = useState(organization?.description ?? "");
  const [isActive, setIsActive] = useState(organization?.isActive ?? true);

  const reset = () => {
    setCode("");
    setName("");
    setDescription("");
    setIsActive(true);
  };

  return (
    <form
      className="mt-4 flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ code, name, description, isActive }, reset);
      }}
    >
      <FormField label="조직코드" required>
        <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="ORG001" />
      </FormField>
      <FormField label="조직명" required>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="운영팀" />
      </FormField>
      <FormField label="설명">
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="조직 설명" />
      </FormField>
      <Checkbox
        checked={isActive}
        onChange={(event) => setIsActive(event.target.checked)}
        label="활성화"
        description="비활성 조직은 권한/배정 화면에서 숨길 수 있습니다."
      />
      {errorMessage && <p className="text-xs text-danger-600">{errorMessage}</p>}
      <Button type="submit" loading={loading} disabled={!code.trim() || !name.trim()}>
        {submitLabel}
      </Button>
    </form>
  );
}
