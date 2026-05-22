import type { DataCodeLevel } from "@/types";

const DATA_CODE_PATTERN = /^[A-Z]{2}\d{3}$/;

export function normalizeDataCode(code: string) {
  return code.trim().toUpperCase();
}

export function getDataCodeFormatHint(level: DataCodeLevel) {
  if (level === "large") return "대분류 코드는 AE000처럼 영문 2자리 + 000 형식이어야 합니다.";
  if (level === "medium") return "중분류 코드는 AE100처럼 영문 2자리 + 숫자 1자리 + 00 형식이어야 합니다.";
  return "소분류 코드는 AE101처럼 중분류 코드 하위의 세부 숫자 형식이어야 합니다.";
}

export function getExpectedParentCode(code: string, level: DataCodeLevel) {
  const normalized = normalizeDataCode(code);
  if (!DATA_CODE_PATTERN.test(normalized) || level === "large") return undefined;

  if (level === "medium") return `${normalized.slice(0, 2)}000`;
  return `${normalized.slice(0, 3)}00`;
}

export function getExpectedLargeCode(code: string) {
  const normalized = normalizeDataCode(code);
  if (!DATA_CODE_PATTERN.test(normalized)) return undefined;
  return `${normalized.slice(0, 2)}000`;
}

export function validateDataCodeInput({
  level,
  code,
  parentCode,
}: {
  level: DataCodeLevel;
  code: string;
  parentCode?: string;
}) {
  const normalized = normalizeDataCode(code);

  if (!normalized) return "코드를 입력해주세요.";
  if (!DATA_CODE_PATTERN.test(normalized)) return "코드는 AE101처럼 영문 2자리 + 숫자 3자리 형식으로 입력해주세요.";

  if (level === "large" && !normalized.endsWith("000")) {
    return getDataCodeFormatHint(level);
  }

  if (level === "medium" && !/^[A-Z]{2}[1-9]00$/.test(normalized)) {
    return getDataCodeFormatHint(level);
  }

  if (level === "small" && (!/^[A-Z]{2}[1-9]\d{2}$/.test(normalized) || normalized.endsWith("00"))) {
    return getDataCodeFormatHint(level);
  }

  const expectedParentCode = getExpectedParentCode(normalized, level);
  if (expectedParentCode && parentCode !== expectedParentCode) {
    return `선택한 상위 분류와 코드 형식이 맞지 않습니다. ${normalized}의 상위 코드는 ${expectedParentCode}이어야 합니다.`;
  }

  return undefined;
}
