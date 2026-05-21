# Translation Files

The app loads translations through `/api/i18n`, backed by the configured storage adapter.

The default file storage reads these JSON files:

- `KO.json`
- `EN.json`
- `locales.json`

Each locale file is a flat JSON object. Keep the keys identical across languages and change only the values.

Example:

```json
{
  "common.save": "저장",
  "common.delete": "삭제"
}
```

`locales.json` controls the language switcher:

```json
[
  { "code": "KO", "label": "KO" },
  { "code": "EN", "label": "EN" },
  { "code": "JA", "label": "JA" }
]
```

You can generate locale files from JSON or CSV:

```bash
npm run i18n:import -- --input ./translations/JA.json --locale JA --label JA
npm run i18n:import -- --input ./translations/messages.csv
```

Admins can also manage these files in `/settings/i18n`. The page shows all known keys, opens a file upload modal for XLSX templates and uploads, validates uploaded XLSX/CSV/JSON, and saves the generated locale files through `/api/admin/i18n`.

Storage is selected by environment variables:

```env
I18N_STORAGE=file
I18N_LOCALES_DIR=public/locales
```

For S3:

```env
I18N_STORAGE=s3
AWS_REGION=ap-northeast-2
I18N_S3_BUCKET=my-bucket
I18N_S3_PREFIX=locales
```

S3 object layout:

```txt
s3://my-bucket/locales/locales.json
s3://my-bucket/locales/KO.json
s3://my-bucket/locales/EN.json
```

The runtime IAM role needs `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, and `s3:ListBucket` scoped to the configured bucket/prefix.

The admin upload template contains only the key column and the target language column:

```csv
key,JA
common.save,保存
common.delete,削除
```

Only headers that are 2-3 uppercase letters, such as `JA`, are saved as locale files.
Uploads are merged into the existing locale file, so a missing-only spreadsheet will fill the provided keys without removing existing translations.

CSV files should have a `key` column and one or more locale columns:

```csv
key,KO,EN,JA
common.save,저장,Save,保存
common.delete,삭제,Delete,削除
```

If a key is missing or a file cannot be loaded, the app falls back to the built-in Korean/English defaults in `src/i18n/dictionaries.ts`.

For a deployed static build, replacing files in this folder requires redeployment unless the hosting environment supports runtime file upload. For non-developer uploads after deployment, connect this same JSON shape to object storage or an admin upload API.
