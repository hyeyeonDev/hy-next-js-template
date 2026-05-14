# Form Components

## Fields

| Component | Description |
| --- | --- |
| `FormField` | label, hint, error를 포함한 필드 래퍼 |
| `FormLabel` | 폼 라벨 |
| `FormError` | 폼 에러 메시지 |
| `EmailField` | 이메일 입력 |
| `PasswordField` | 비밀번호 입력 |
| `PhoneField` | 전화번호 입력 |
| `NumberField` | 숫자 입력 |
| `CurrencyField` | 금액 입력 |
| `UrlField` | URL 입력 |
| `AddressField` | 주소 입력 |
| `DatePicker` | 날짜 입력 |
| `DateRange` | 두 달력 기반 기간 선택 |
| `TimeField` | 시간 입력 |
| `SearchInput` | 검색 입력 |
| `AutoComplete` | 추천 목록 입력 |
| `TagInput` | 태그 입력 |
| `OTPField` | 인증번호 입력 |
| `FileUploadField` | 파일 업로드 |

## Form State

`FormProvider.tsx`는 `react-hook-form`의 context provider를 감싼 컴포넌트입니다.

```tsx
const form = useZodForm(schema, {
  defaultValues,
});

return (
  <FormProvider form={form} onSubmit={handleSubmit}>
    ...
  </FormProvider>
);
```

## Validation

- schema는 zod로 정의합니다.
- 필드 에러는 `form.formState.errors`를 기준으로 표시합니다.
- 서버 validation 오류는 API error의 `errors` 필드를 form error로 매핑합니다.
