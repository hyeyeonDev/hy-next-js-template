"use client";

import { useMemo, useState } from "react";
import { Database, Edit, Plus, Shield } from "lucide-react";

import { RoleGuard } from "@/components/auth";
import { DataTable } from "@/components/data-display";
import { AutoComplete, FormField, SearchInput } from "@/components/forms";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import {
  useCreateDataCodeMutation,
  useDataCodeDuplicateQuery,
  useDataCodesQuery,
  useUpdateDataCodeMutation,
} from "@/hooks/queries";
import {
  getDataCodeFormatHint,
  getExpectedLargeCode,
  getExpectedParentCode,
  normalizeDataCode,
  validateDataCodeInput,
} from "@/lib/data-code";
import { formatDate } from "@/lib/format";
import type { CreateDataCodeDto, DataCode, DataCodeLevel, TableColumn } from "@/types";

const levelLabel = {
  large: "대분류",
  medium: "중분류",
  small: "소분류",
} satisfies Record<DataCodeLevel, string>;

export function DataCodePage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedLarge, setSelectedLarge] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("");
  const [editingCode, setEditingCode] = useState<DataCode | null>(null);

  const dataCodesQuery = useDataCodesQuery({ page, pageSize: 10, search });
  const largeCodesQuery = useDataCodesQuery({ level: "large", pageSize: 100 });
  const mediumCodesQuery = useDataCodesQuery({ level: "medium", parentCode: selectedLarge, pageSize: 100 });
  const smallCodesQuery = useDataCodesQuery({ level: "small", parentCode: selectedMedium, pageSize: 100 });
  const createDataCode = useCreateDataCodeMutation();
  const updateDataCode = useUpdateDataCodeMutation();

  const largeCodes = largeCodesQuery.data?.data ?? [];
  const mediumCodes = mediumCodesQuery.data?.data ?? [];
  const smallCodes = smallCodesQuery.data?.data ?? [];

  const columns = useMemo<TableColumn<DataCode>[]>(
    () => [
      {
        key: "level",
        label: "분류",
        width: "100px",
        render: (value) => <Badge variant="outline">{levelLabel[value as DataCodeLevel]}</Badge>,
      },
      { key: "parentCode", label: "상위코드", width: "120px", render: (value) => String(value || "-") },
      { key: "code", label: "코드", width: "120px" },
      { key: "codeName", label: "코드명" },
      { key: "sortOrder", label: "순서", width: "80px", align: "right" },
      { key: "description", label: "상세 내용", render: (value) => String(value || "-") },
      {
        key: "createdAt",
        label: "등록일",
        width: "120px",
        render: (value) => formatDate(String(value)),
      },
    ],
    [],
  );

  const selectedLargeName = largeCodes.find((item) => item.code === selectedLarge)?.codeName;
  const selectedMediumName = mediumCodes.find((item) => item.code === selectedMedium)?.codeName;

  return (
    <AdminLayout title="코드관리">
      <RoleGuard
        roles={["ADMIN", "MANAGER"]}
        fallback={
          <Card className="mx-auto max-w-xl text-center">
            <Shield className="mx-auto h-8 w-8 text-danger-500" aria-hidden="true" />
            <h1 className="mt-3 text-lg font-semibold text-text">접근 권한이 없습니다</h1>
            <p className="mt-1 text-sm text-text-muted">코드관리는 관리자 또는 매니저만 접근할 수 있습니다.</p>
          </Card>
        }
      >
        <PageWrapper title="코드관리" description="대/중/소 분류 코드를 등록하고 계층별 목록을 관리합니다.">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-4">
              <Card>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]">
                  <FormField label="코드 검색">
                    <SearchInput
                      placeholder="코드, 코드명, 상세 내용 검색"
                      onSearch={(value) => {
                        setSearch(value);
                        setPage(1);
                      }}
                    />
                  </FormField>
                  <FormField label="대분류">
                    <Select
                      value={selectedLarge}
                      onChange={(event) => {
                        setSelectedLarge(event.target.value);
                        setSelectedMedium("");
                      }}
                      options={[
                        { label: "전체", value: "" },
                        ...largeCodes.map((item) => ({ label: `${item.code} ${item.codeName}`, value: item.code })),
                      ]}
                    />
                  </FormField>
                  <FormField label="중분류">
                    <Select
                      value={selectedMedium}
                      disabled={!selectedLarge}
                      onChange={(event) => setSelectedMedium(event.target.value)}
                      options={[
                        { label: "전체", value: "" },
                        ...mediumCodes.map((item) => ({ label: `${item.code} ${item.codeName}`, value: item.code })),
                      ]}
                    />
                  </FormField>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <CodeColumn
                  title="대분류"
                  codes={largeCodes}
                  selectedCode={selectedLarge}
                  onSelect={setSelectedLarge}
                  onEdit={setEditingCode}
                />
                <CodeColumn
                  title="중분류"
                  codes={mediumCodes}
                  selectedCode={selectedMedium}
                  emptyMessage={selectedLarge ? "중분류가 없습니다." : "대분류를 선택하세요."}
                  onSelect={setSelectedMedium}
                  onEdit={setEditingCode}
                />
                <CodeColumn
                  title="소분류"
                  codes={smallCodes}
                  emptyMessage={selectedMedium ? "소분류가 없습니다." : "중분류를 선택하세요."}
                  onEdit={setEditingCode}
                />
              </div>

              <DataTable
                columns={columns}
                data={(dataCodesQuery.data?.data ?? []) as DataCode[]}
                loading={dataCodesQuery.isLoading}
                emptyMessage="등록된 코드가 없습니다."
                onRowClick={(row) => setEditingCode(row)}
                pagination={
                  dataCodesQuery.data?.pagination
                    ? {
                        page: dataCodesQuery.data.pagination.page,
                        pageSize: dataCodesQuery.data.pagination.pageSize,
                        total: dataCodesQuery.data.pagination.total,
                        totalPages: dataCodesQuery.data.pagination.totalPages,
                        onChange: setPage,
                      }
                    : undefined
                }
              />
              {dataCodesQuery.isError && <p className="text-sm text-danger-600">{dataCodesQuery.error.message}</p>}
            </div>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-semibold text-text">
                  {editingCode ? <Edit className="h-4 w-4" aria-hidden="true" /> : <Database className="h-4 w-4" aria-hidden="true" />}
                  {editingCode ? "코드 수정" : "코드 등록"}
                </h2>
                {editingCode && (
                  <Button type="button" size="xs" variant="outline" onClick={() => setEditingCode(null)}>
                    신규 등록
                  </Button>
                )}
              </div>
              {editingCode ? (
                <DataCodeForm
                  key={`edit-${editingCode.id}`}
                  initialValue={editingCode}
                  largeCodes={largeCodes}
                  submitLabel="저장"
                  loading={updateDataCode.isPending}
                  errorMessage={updateDataCode.isError ? updateDataCode.error.message : undefined}
                  onSubmit={(value) => {
                    updateDataCode.mutate(
                      { id: editingCode.id, dto: value },
                      {
                        onSuccess: (updated) => {
                          setEditingCode(updated);
                          toast("코드가 수정되었습니다.", "success");
                        },
                      },
                    );
                  }}
                />
              ) : (
                <DataCodeForm
                  key="create"
                  largeCodes={largeCodes}
                  loading={createDataCode.isPending}
                  errorMessage={createDataCode.isError ? createDataCode.error.message : undefined}
                  selectedLargeName={selectedLargeName}
                  selectedMediumName={selectedMediumName}
                  onSubmit={(value, reset) => {
                    createDataCode.mutate(value, {
                      onSuccess: () => {
                        reset();
                        toast("코드가 등록되었습니다.", "success");
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

function DataCodeForm({
  initialValue,
  largeCodes,
  submitLabel = "등록",
  loading,
  errorMessage,
  selectedLargeName,
  selectedMediumName,
  onSubmit,
}: {
  initialValue?: DataCode;
  largeCodes: DataCode[];
  submitLabel?: string;
  loading?: boolean;
  errorMessage?: string;
  selectedLargeName?: string;
  selectedMediumName?: string;
  onSubmit: (value: CreateDataCodeDto, reset: () => void) => void;
}) {
  const [level, setLevel] = useState<DataCodeLevel>(initialValue?.level ?? "small");
  const [formLargeCode, setFormLargeCode] = useState(
    initialValue?.level === "medium"
      ? initialValue.parentCode ?? ""
      : initialValue?.level === "small" && initialValue.parentCode
        ? expectedParentCodeFromCode(initialValue.parentCode, "large")
        : "",
  );
  const [parentCode, setParentCode] = useState(initialValue?.parentCode ?? "");
  const [code, setCode] = useState(initialValue?.code ?? "");
  const [codeName, setCodeName] = useState(initialValue?.codeName ?? "");
  const [sortOrder, setSortOrder] = useState(String(initialValue?.sortOrder ?? ""));
  const [description, setDescription] = useState(initialValue?.description ?? "");
  const [duplicateCheckCode, setDuplicateCheckCode] = useState("");
  const [validationError, setValidationError] = useState("");

  const normalizedCode = normalizeDataCode(code);
  const effectiveParentCode = level === "large" ? undefined : parentCode;
  const expectedParentCode = getExpectedParentCode(normalizedCode, level);
  const expectedLargeCode = getExpectedLargeCode(normalizedCode);
  const mediumParentCode = level === "small" ? formLargeCode : "";
  const mediumCodesQuery = useDataCodesQuery({ level: "medium", parentCode: mediumParentCode, pageSize: 100 });
  const duplicateQuery = useDataCodeDuplicateQuery(duplicateCheckCode, !!duplicateCheckCode, initialValue?.id);
  const mediumCodes = mediumCodesQuery.data?.data ?? [];
  const codeChanged = normalizedCode !== (initialValue?.code ?? "");
  const duplicateResultMatchesCode = duplicateQuery.data?.code === normalizedCode;
  const duplicateCheckPassed = !codeChanged || (duplicateResultMatchesCode && !duplicateQuery.data?.exists);
  const inputValidationMessage = validateDataCodeInput({ level, code: normalizedCode, parentCode: effectiveParentCode });
  const submitDisabled =
    !normalizedCode ||
    !codeName.trim() ||
    !sortOrder.trim() ||
    Boolean(inputValidationMessage) ||
    !duplicateCheckPassed ||
    duplicateQuery.data?.exists === true;

  const reset = () => {
    setLevel("small");
    setFormLargeCode("");
    setParentCode("");
    setCode("");
    setCodeName("");
    setSortOrder("");
    setDescription("");
    setDuplicateCheckCode("");
    setValidationError("");
  };

  return (
    <form
      className="mt-4 flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const nextValidationError = validateDataCodeInput({ level, code: normalizedCode, parentCode: effectiveParentCode });
        if (nextValidationError) {
          setValidationError(nextValidationError);
          return;
        }

        if (!duplicateCheckPassed) {
          setValidationError("코드 중복확인을 먼저 진행해주세요.");
          return;
        }

        setValidationError("");
        onSubmit(
          {
            level,
            parentCode: effectiveParentCode,
            code: normalizedCode,
            codeName: codeName.trim(),
            sortOrder: Number(sortOrder),
            description: description.trim(),
          },
          reset,
        );
      }}
    >
      <FormField label="분류" required>
        <Select
          value={level}
          onChange={(event) => {
            const nextLevel = event.target.value as DataCodeLevel;
            setLevel(nextLevel);
            setFormLargeCode("");
            setParentCode("");
            setDuplicateCheckCode("");
            setValidationError("");
          }}
          options={[
            { label: "대분류", value: "large" },
            { label: "중분류", value: "medium" },
            { label: "소분류", value: "small" },
          ]}
        />
      </FormField>

      {level === "medium" && (
        <FormField label="대분류 검색 선택" required>
          <SearchableCodeSelect
            key={`medium-large-${parentCode}-${largeCodes.length}`}
            codes={largeCodes}
            value={parentCode}
            placeholder="대분류 코드 또는 코드명 검색"
            onChange={(value) => {
              setParentCode(value);
              setValidationError("");
            }}
          />
        </FormField>
      )}

      {level === "small" && (
        <>
          <FormField label="대분류 검색 선택" required>
            <SearchableCodeSelect
              key={`small-large-${formLargeCode}-${largeCodes.length}`}
              codes={largeCodes}
              value={formLargeCode}
              placeholder="대분류 코드 또는 코드명 검색"
              onChange={(value) => {
                setFormLargeCode(value);
                setParentCode("");
                setValidationError("");
              }}
            />
          </FormField>
          <FormField label="중분류 검색 선택" required>
            <SearchableCodeSelect
              key={`small-medium-${parentCode}-${mediumCodes.length}`}
              codes={mediumCodes}
              value={parentCode}
              placeholder={formLargeCode ? "중분류 코드 또는 코드명 검색" : "대분류를 먼저 선택하세요"}
              onChange={(value) => {
                setParentCode(value);
                setValidationError("");
              }}
            />
          </FormField>
        </>
      )}

      <FormField label="코드" required>
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(event) => {
              const nextCode = event.target.value.toUpperCase();
              setCode(nextCode);
              setDuplicateCheckCode("");
              setValidationError("");
            }}
            placeholder="AE101"
            error={Boolean(inputValidationMessage)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDuplicateCheckCode(normalizedCode);
              setValidationError("");
            }}
            disabled={!normalizedCode || Boolean(inputValidationMessage)}
          >
            중복확인
          </Button>
        </div>
      </FormField>

      <p className={inputValidationMessage ? "text-xs text-danger-600" : "text-xs text-text-muted"}>
        {inputValidationMessage ?? getDataCodeFormatHint(level)}
      </p>
      {level === "small" && expectedLargeCode && (
        <p className="text-xs text-text-muted">
          코드 기준 대분류: <span className="font-semibold text-text">{expectedLargeCode}</span>
        </p>
      )}
      {expectedParentCode && (
        <p className="text-xs text-text-muted">
          코드 기준 상위 분류: <span className="font-semibold text-text">{expectedParentCode}</span>
        </p>
      )}
      {normalizedCode && codeChanged && !duplicateQuery.data && !inputValidationMessage && (
        <p className="text-xs text-warning-600">저장 전 코드 중복확인을 진행해주세요.</p>
      )}
      {duplicateQuery.data && duplicateResultMatchesCode && (
        <p className={duplicateQuery.data.exists ? "text-xs text-danger-600" : "text-xs text-success-600"}>
          {duplicateQuery.data.exists ? "이미 등록된 코드입니다." : "사용 가능한 코드입니다."}
        </p>
      )}

      <FormField label="코드명" required>
        <Input value={codeName} onChange={(event) => setCodeName(event.target.value)} placeholder="일반민원" />
      </FormField>
      <FormField label="순서" required>
        <Input
          type="number"
          min={1}
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          placeholder="1"
        />
      </FormField>
      <FormField label="코드 상세 내용">
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="코드 상세 내용을 입력하세요" />
      </FormField>

      <div className="rounded-md border border-border bg-surface-2 p-3 text-xs text-text-muted">
        예: AE101 등록 시 대분류는 AE000, 중분류는 AE100, 소분류는 AE101 구조로 관리합니다.
        {selectedLargeName && <span className="mt-1 block">현재 선택 대분류: {selectedLargeName}</span>}
        {selectedMediumName && <span className="mt-1 block">현재 선택 중분류: {selectedMediumName}</span>}
      </div>

      {(validationError || errorMessage) && <p className="text-xs text-danger-600">{validationError || errorMessage}</p>}
      <Button
        type="submit"
        leftIcon={<Plus aria-hidden="true" />}
        loading={loading}
        disabled={submitDisabled}
      >
        {submitLabel}
      </Button>
    </form>
  );
}

function SearchableCodeSelect({
  codes,
  value,
  placeholder,
  onChange,
}: {
  codes: DataCode[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const selected = codes.find((item) => item.code === value);
  const [inputValue, setInputValue] = useState(selected ? `${selected.code} ${selected.codeName}` : "");
  const options = codes.map((item) => ({ value: item.code, label: `${item.code} ${item.codeName}` }));

  return (
    <AutoComplete
      options={options}
      value={inputValue}
      placeholder={placeholder}
      onChange={(next) => {
        setInputValue(next);
        if (!next) onChange("");
      }}
      onSelect={(option) => {
        setInputValue(option.label);
        onChange(option.value);
      }}
    />
  );
}

function expectedParentCodeFromCode(code: string, targetLevel: "large" | "medium") {
  const normalized = normalizeDataCode(code);
  if (normalized.length < 3) return "";
  if (targetLevel === "large") return getExpectedLargeCode(normalized) ?? "";
  return getExpectedParentCode(normalized, "small") ?? "";
}

function CodeColumn({
  title,
  codes,
  selectedCode,
  emptyMessage = "등록된 코드가 없습니다.",
  onSelect,
  onEdit,
}: {
  title: string;
  codes: DataCode[];
  selectedCode?: string;
  emptyMessage?: string;
  onSelect?: (code: string) => void;
  onEdit?: (code: DataCode) => void;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_3.5rem] border-b border-border bg-surface-2 px-3 py-2 text-xs font-semibold text-text-muted">
        <span>코드</span>
        <span>코드명</span>
        <span className="text-right">순서</span>
      </div>
      <div className="h-72 overflow-y-auto">
        {codes.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-text-muted">{emptyMessage}</p>
        ) : (
          codes.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                onSelect?.(item.code);
                onEdit?.(item);
              }}
              className={`grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_3.5rem] gap-3 border-b border-border px-3 py-2 text-left text-sm transition-colors last:border-b-0 ${
                selectedCode === item.code ? "bg-primary-50 text-primary-700" : "text-text hover:bg-surface-2"
              }`}
            >
              <span className="truncate font-semibold">{item.code}</span>
              <span className="truncate text-text-muted">{item.codeName}</span>
              <span className="text-right text-text-muted">{item.sortOrder}</span>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
