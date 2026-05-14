/**
 * =========================================================
 * DIALOG SYSTEM
 * =========================================================
 *
 *
 * 브라우저 기본 alert/confirm/prompt 대신 사용합니다.
 * useDialog() 훅으로 어디서든 호출 가능합니다.
 *
 * 사용 예시:
 *   const { alert, confirm, prompt } = useDialog();
 *
 *   await alert("저장되었습니다");
 *   const ok = await confirm("정말 삭제하시겠습니까?");
 *   if (!ok) return;
 *   const value = await prompt("새 이름을 입력하세요", "기본값");
 *
 * =========================================================
 */

export * from "./DialogProvider";
export * from "./useDialog";
