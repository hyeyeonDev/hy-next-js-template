export * from "./AddressField";
export * from "./CurrencyField";
export * from "./DatePicker";
export * from "./EmailField";
export * from "./FormError";
export * from "./FormField";
export * from "./FormLabel";
export * from "./NumberField";
export * from "./OTPField";
export * from "./PasswordField";
export * from "./PhoneField";
export * from "./SearchInput";
export * from "./UrlField";
export * from "./TimeField";
export * from "./DateRangeField";
export * from "./FileUploadField";
export * from "./TagInput";
export * from "./AutoComplete";
export * from "./FormProvider";

/**
 * =========================================================
 * FORM COMPONENTS
 * =========================================================
 *
 * 기본 사용 예시:
 *
 * <FormField
 *   label="이메일"
 *   required
 *   error={errors.email}
 * >
 *   <EmailField />
 * </FormField>
 *
 * ---------------------------------------------------------
 * 제공 컴포넌트
 * ---------------------------------------------------------
 *
 * FormField
 * - label / hint / error wrapper
 *
 * FormLabel
 * - label UI
 *
 * FormError
 * - error text UI
 *
 * SearchInput
 * - 검색 input
 *
 * DatePicker
 * - 날짜 선택 input
 *
 * EmailField
 * - 이메일 입력
 *
 * PasswordField
 * - 비밀번호 입력 + show/hide
 *
 * PhoneField
 * - 전화번호 입력
 *
 * AddressField
 * - 주소 입력
 *
 * NumberField
 * - 숫자 입력
 *
 * CurrencyField
 * - 금액 입력
 *
 * OTPField
 * - 인증번호 입력
 *
 * UrlField / TimeField / DateRangeField
 * - URL, 시간, 기간 입력
 *
 * FileUploadField
 * - 파일 선택 UI
 *
 * TagInput
 * - 태그 입력
 *
 * =========================================================
 */
