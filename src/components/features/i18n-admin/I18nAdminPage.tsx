"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Download, Languages, RefreshCw, Shield, Trash2, Upload } from "lucide-react";
import ExcelJS from "exceljs";

import { RoleGuard } from "@/components/auth";
import { DataTable } from "@/components/data-display";
import { FormField } from "@/components/forms";
import { AdminLayout, PageWrapper } from "@/components/layout";
import { Badge, Button, Card, CardDescription, CardTitle, Input, Modal } from "@/components/ui";
import { useDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/format";
import type { TableColumn } from "@/types";

type LocaleOption = {
  code: string;
  label: string;
};

type Dictionary = Record<string, string>;

type I18nPayload = {
  locales: LocaleOption[];
  dictionaries: Record<string, Dictionary>;
  keys: string[];
};

type TranslationRow = {
  key: string;
  group: string;
  missingCount: number;
  [locale: string]: string | number;
};

type ParsedImport = {
  dictionaries: Record<string, Dictionary>;
  duplicateKeys: string[];
};
type MissingInputValues = Record<string, Record<string, string>>;

const LOCALE_CODE_PATTERN = /^[A-Z]{2,3}$/;
const EMPTY_LOCALES: LocaleOption[] = [];
const EMPTY_DICTIONARIES: Record<string, Dictionary> = {};
const EMPTY_KEYS: string[] = [];

function normalizeLocaleCode(value: string) {
  return value.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted && char === '"' && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && char === ",") {
      row.push(value);
      value = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((item) => item.some((cell) => cell.trim().length > 0));
}

function parseWorksheetRows(rows: string[][]): ParsedImport {
  const [header, ...bodyRows] = rows;
  if (!header) throw new Error("파일이 비어 있습니다.");

  const columns = header.map((cell) => String(cell).trim());
  const keyIndex = columns.indexOf("key");
  if (keyIndex < 0) throw new Error('파일에는 "key" 컬럼이 필요합니다.');

  const localeColumns = columns
    .map((name, index) => ({ name: normalizeLocaleCode(name), rawName: name, index }))
    .filter((item) => !item.rawName.toUpperCase().startsWith("REF_"))
    .filter((item) => item.index !== keyIndex && LOCALE_CODE_PATTERN.test(item.name));

  if (localeColumns.length === 0) {
    throw new Error("파일에는 KO, EN, JA 같은 2-3자 대문자 언어 코드 컬럼이 하나 이상 필요합니다.");
  }

  const seen = new Set<string>();
  const duplicateKeys: string[] = [];
  const dictionaries = Object.fromEntries(localeColumns.map((item) => [item.name, {} as Dictionary]));

  bodyRows.forEach((row) => {
    const key = row[keyIndex]?.trim();
    if (!key) return;

    if (seen.has(key)) {
      duplicateKeys.push(key);
    }
    seen.add(key);

    localeColumns.forEach(({ name, index }) => {
      const value = row[index]?.trim();
      if (value) dictionaries[name][key] = value;
    });
  });

  return {
    dictionaries,
    duplicateKeys,
  };
}

function parseDictionaryJson(text: string, locale: string): ParsedImport {
  const data = JSON.parse(text) as unknown;
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("JSON 파일은 key/value 객체여야 합니다.");
  }

  const dictionary = Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) => {
      if (!key.trim() || typeof value !== "string") return [];
      return [[key.trim(), value] as const];
    }),
  );

  return {
    dictionaries: { [locale]: dictionary },
    duplicateKeys: [],
  };
}

function parseDictionaryCsv(text: string): ParsedImport {
  return parseWorksheetRows(parseCsv(text));
}

async function parseDictionaryXlsx(buffer: ArrayBuffer): Promise<ParsedImport> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("XLSX 파일에 시트가 없습니다.");

  const rows: string[][] = [];
  sheet.eachRow((row) => {
    const values = Array.isArray(row.values) ? row.values.slice(1) : [];
    rows.push(values.map((value) => String(value ?? "")));
  });

  return parseWorksheetRows(rows);
}

async function downloadXlsx(filename: string, rows: string[][]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("translations");
  sheet.addRows(rows);
  sheet.columns = rows[0]?.map((header) => ({
    width: header === "key" ? 38 : 28,
  }));
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getMissingCount(key: string, locales: LocaleOption[], dictionaries: Record<string, Dictionary>) {
  return locales.filter((locale) => !dictionaries[locale.code]?.[key]).length;
}

export function I18nAdminPage() {
  const { toast } = useToast();
  const { confirm } = useDialog();
  const [payload, setPayload] = useState<I18nPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [draftLocale, setDraftLocale] = useState("");
  const [importPreview, setImportPreview] = useState<ParsedImport | null>(null);
  const [importError, setImportError] = useState("");
  const [missingInputValues, setMissingInputValues] = useState<MissingInputValues>({});
  const [deletingLocale, setDeletingLocale] = useState("");

  const loadI18n = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch("/api/admin/i18n", { cache: "no-store" });
      if (!response.ok) throw new Error("다국어 정보를 불러오지 못했습니다.");
      const nextPayload = (await response.json()) as I18nPayload;
      setPayload(nextPayload);
    } catch (error) {
      toast(error instanceof Error ? error.message : "다국어 정보를 불러오지 못했습니다.", "danger");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let active = true;

    async function loadInitialI18n() {
      try {
        const response = await fetch("/api/admin/i18n", { cache: "no-store" });
        if (!response.ok) throw new Error("다국어 정보를 불러오지 못했습니다.");
        const nextPayload = (await response.json()) as I18nPayload;
        if (active) {
          setPayload(nextPayload);
        }
      } catch (error) {
        if (active) toast(error instanceof Error ? error.message : "다국어 정보를 불러오지 못했습니다.", "danger");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialI18n();

    return () => {
      active = false;
    };
  }, [toast]);

  const locales = payload?.locales ?? EMPTY_LOCALES;
  const dictionaries = payload?.dictionaries ?? EMPTY_DICTIONARIES;
  const rows = useMemo<TranslationRow[]>(() => {
    const keys = payload?.keys ?? EMPTY_KEYS;
    return keys
      .filter((key) => key.toLowerCase().includes(search.trim().toLowerCase()))
      .map((key) => ({
        key,
        group: key.split(".")[0] ?? "-",
        ...Object.fromEntries(locales.map((item) => [item.code, dictionaries[item.code]?.[key] ?? ""])),
        missingCount: getMissingCount(key, locales, dictionaries),
      }));
  }, [dictionaries, locales, payload?.keys, search]);

  const columns = useMemo<TableColumn<TranslationRow>[]>(
    () => [
      { key: "group", label: "그룹", width: "96px", render: (value) => <Badge variant="outline">{String(value)}</Badge> },
      { key: "key", label: "키", width: "260px" },
      ...locales.map<TableColumn<TranslationRow>>((item) => ({
        key: item.code,
        label: item.label || item.code.toUpperCase(),
        width: "220px",
        render: (value) => String(value || "-"),
      })),
      {
        key: "missingCount",
        label: "누락",
        width: "80px",
        align: "right",
        render: (value) => (Number(value) > 0 ? <span className="font-semibold text-warning-600">{String(value)}</span> : "0"),
      },
    ],
    [locales],
  );

  const currentKeys = useMemo(() => payload?.keys ?? EMPTY_KEYS, [payload?.keys]);
  const missingImportKeys = useMemo(() => {
    if (!importPreview) return {};

    return Object.fromEntries(
      Object.entries(importPreview.dictionaries).map(([locale, dictionary]) => [
        locale,
        currentKeys.filter((key) => !dictionary[key]?.trim()),
      ]),
    );
  }, [currentKeys, importPreview]);
  const missingImportKeyCount = Object.values(missingImportKeys).reduce((sum, keys) => sum + keys.length, 0);

  function getUploadTemplateRows(targetLocale: string, missingOnly: boolean) {
    const keys = missingOnly ? currentKeys.filter((key) => !dictionaries[targetLocale]?.[key]) : currentKeys;

    return [
      ["key", targetLocale],
      ...keys.map((key) => [key, ""]),
    ];
  }

  function openUploadModal() {
    setUploadModalOpen(true);
    setImportError("");
    setImportPreview(null);
    setMissingInputValues({});
  }

  function getValidatedDraftLocale() {
    const nextLocale = normalizeLocaleCode(draftLocale);
    if (!LOCALE_CODE_PATTERN.test(nextLocale)) {
      setImportError("언어 코드는 2-3자 영문으로 입력해주세요.");
      return null;
    }

    setDraftLocale(nextLocale);
    setImportError("");
    return nextLocale;
  }

  async function downloadUploadTemplate(missingOnly = false) {
    const nextLocale = getValidatedDraftLocale();
    if (!nextLocale) return;

    await downloadXlsx(`i18n-${missingOnly ? "missing" : "upload"}-${nextLocale}.xlsx`, getUploadTemplateRows(nextLocale, missingOnly));
  }

  async function deleteLocale(localeCode: string) {
    const ok = await confirm(`${localeCode} 언어를 삭제할까요?`, {
      message: "삭제된 언어 사전은 다시 복구할 수 없습니다.",
      variant: "danger",
      confirmLabel: "삭제",
    });
    if (!ok) return;

    setDeletingLocale(localeCode);
    try {
      const response = await fetch(`/api/admin/i18n?locale=${encodeURIComponent(localeCode)}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "언어 삭제에 실패했습니다.");

      if (draftLocale === localeCode) {
        setDraftLocale("");
      }

      toast(result.message ?? "언어가 삭제되었습니다.", "success");
      await loadI18n();
    } catch (error) {
      toast(error instanceof Error ? error.message : "언어 삭제에 실패했습니다.", "danger");
    } finally {
      setDeletingLocale("");
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImportError("");

    try {
      const fileName = file.name.toLowerCase();
      let parsed: ParsedImport;

      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        parsed = await parseDictionaryXlsx(await file.arrayBuffer());
      } else if (fileName.endsWith(".json")) {
        const nextLocale = getValidatedDraftLocale();
        if (!nextLocale) return;
        parsed = parseDictionaryJson(await file.text(), nextLocale);
      } else {
        parsed = parseDictionaryCsv(await file.text());
      }

      if (parsed.duplicateKeys.length > 0) {
        setImportError(`중복 키가 있습니다: ${parsed.duplicateKeys.slice(0, 5).join(", ")}`);
        return;
      }

      setImportPreview(parsed);
      setMissingInputValues({});
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "파일을 읽지 못했습니다.");
    }
  }

  function updateMissingInputValue(locale: string, key: string, value: string) {
    setMissingInputValues((current) => ({
      ...current,
      [locale]: {
        ...(current[locale] ?? {}),
        [key]: value,
      },
    }));
  }

  function getImportPayload() {
    if (!importPreview) return null;

    return {
      ...importPreview,
      dictionaries: Object.fromEntries(
        Object.entries(importPreview.dictionaries).map(([locale, dictionary]) => [
          locale,
          {
            ...dictionary,
            ...Object.fromEntries(
              Object.entries(missingInputValues[locale] ?? {}).filter(([, value]) => value.trim()),
            ),
          },
        ]),
      ),
    };
  }

  async function saveImport() {
    const importPayload = getImportPayload();
    if (!importPayload) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/i18n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(importPayload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "번역 파일 저장에 실패했습니다.");

      toast(result.message ?? "번역 파일이 저장되었습니다.", "success");
      setImportPreview(null);
      setMissingInputValues({});
      await loadI18n();
    } catch (error) {
      toast(error instanceof Error ? error.message : "번역 파일 저장에 실패했습니다.", "danger");
    } finally {
      setSaving(false);
    }
  }

  const previewLocales = Object.keys(importPreview?.dictionaries ?? {});
  const previewKeyCount = new Set(Object.values(importPreview?.dictionaries ?? {}).flatMap((item) => Object.keys(item))).size;

  return (
    <AdminLayout title="다국어 관리">
      <RoleGuard
        roles={["ADMIN", "MANAGER"]}
        fallback={
          <Card className="mx-auto max-w-xl text-center">
            <Shield className="mx-auto h-8 w-8 text-danger-500" aria-hidden="true" />
            <h1 className="mt-3 text-lg font-semibold text-text">접근 권한이 없습니다</h1>
            <p className="mt-1 text-sm text-text-muted">다국어 관리는 관리자 또는 매니저만 접근할 수 있습니다.</p>
          </Card>
        }
      >
        <PageWrapper title="다국어 관리" description="업로드 양식을 내려받아 선택한 언어 컬럼만 채운 뒤 다시 업로드합니다.">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            <Card>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <FormField label="키 검색" className="lg:w-80">
                  <Input value={search} placeholder="common.save" onChange={(event) => setSearch(event.target.value)} />
                </FormField>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="새로고침"
                    title="새로고침"
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                    onClick={() => loadI18n()}
                  />
                  <Button type="button" leftIcon={<Upload className="h-4 w-4" />} onClick={openUploadModal}>
                    파일 업로드
                  </Button>
                </div>
              </div>
            </Card>

            <DataTable
              columns={columns}
              data={rows}
              loading={loading}
              emptyMessage="등록된 번역 키가 없습니다."
              scrollClassName="max-h-[calc(100vh-18rem)] overflow-auto"
            />
          </div>

          <div className="space-y-4">
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary-600" aria-hidden="true" />
                <div>
                  <CardTitle>언어 관리</CardTitle>
                  <CardDescription>언어 코드는 대문자로 표시되며, 사용하지 않는 언어를 삭제할 수 있습니다.</CardDescription>
                </div>
              </div>
              <div className="space-y-2">
                {locales.map((item) => (
                  <div key={item.code} className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-2">
                    <Badge variant="outline">{item.code}</Badge>
                    <span className="text-sm text-text-muted">{item.code}.json</span>
                    <Button
                      type="button"
                      size="xs"
                      variant="danger"
                      disabled={item.code === "KO"}
                      loading={deletingLocale === item.code}
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                      onClick={() => deleteLocale(item.code)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        </PageWrapper>
      </RoleGuard>
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="다국어 파일 업로드"
        description="대상 언어를 선택하거나 새 언어 코드를 입력한 뒤 양식을 내려받고 파일을 업로드합니다."
        size="lg"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
              닫기
            </Button>
            {importPreview && (
              <Button type="button" loading={saving} onClick={saveImport}>
                번역 파일 저장
              </Button>
            )}
          </>
        }
      >
        <div className="space-y-5">
          {locales.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-text-muted">등록된 언어</p>
              <div className="flex flex-wrap gap-2">
                {locales.map((item) => (
                  <Button
                    key={item.code}
                    type="button"
                    size="xs"
                    variant={draftLocale === item.code ? "primary" : "outline"}
                    onClick={() => setDraftLocale(item.code)}
                  >
                    {item.code}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <FormField label="새 언어 코드" hint="예: en → EN, ja → JA">
            <Input
              value={draftLocale}
              maxLength={3}
              onChange={(event) => setDraftLocale(normalizeLocaleCode(event.target.value))}
              placeholder="2-3자 영문"
            />
          </FormField>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => void downloadUploadTemplate(false)}>
              업로드 양식 다운로드
            </Button>
            <Button type="button" variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => void downloadUploadTemplate(true)}>
              누락 양식 다운로드
            </Button>
          </div>
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-2 px-4 py-6 text-center transition-colors hover:border-primary-400 hover:bg-surface">
            <Upload className="h-6 w-6 text-text-subtle" aria-hidden="true" />
            <span className="mt-2 text-sm font-medium text-text">XLSX, CSV 또는 JSON 업로드</span>
            <span className="mt-1 text-xs text-text-subtle">양식의 언어 코드 컬럼만 저장됩니다.</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv,application/json"
              className="sr-only"
              onChange={handleUpload}
            />
          </label>
          {(importPreview || importError) && (
            <div className={importError ? "rounded-md border border-danger-200 bg-danger-50 p-4" : "rounded-md border border-border bg-surface-2 p-4"}>
              {importError ? (
                <p className="text-sm font-medium text-danger-700">{importError}</p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-text">업로드 검토</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {previewLocales.join(", ")} 언어, {formatNumber(previewKeyCount)}개 키를 저장합니다.
                    {missingImportKeyCount > 0 && ` 누락 ${formatNumber(missingImportKeyCount)}개를 아래에서 입력할 수 있습니다.`}
                  </p>
                </>
              )}
            </div>
          )}
          {missingImportKeyCount > 0 && (
            <div className="max-h-72 overflow-auto rounded-md border border-warning-200 bg-warning-50 p-4">
              <p className="text-sm font-semibold text-warning-700">업로드 파일에 빠진 키</p>
              <div className="mt-3 space-y-4">
                {Object.entries(missingImportKeys).map(([locale, keys]) =>
                  keys.length > 0 ? (
                    <div key={locale} className="space-y-2">
                      <Badge variant="warning">{locale}</Badge>
                      {keys.map((key) => (
                        <FormField key={`${locale}-${key}`} label={key}>
                          <Input
                            value={missingInputValues[locale]?.[key] ?? ""}
                            onChange={(event) => updateMissingInputValue(locale, key, event.target.value)}
                            placeholder="번역값 입력"
                          />
                        </FormField>
                      ))}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}
