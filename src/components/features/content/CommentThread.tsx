"use client";

import { useState } from "react";
import {
  MessageCircle,
  MessageSquareReply,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";

import {
  useCommentsQuery,
  useCreateCommentMutation,
  useCreateCommentReplyMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/data-display";
import { useDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Card, Textarea } from "@/components/ui";
import { formatDateTime, formatNumber } from "@/lib/format";
import { isAdminRole } from "@/lib/roles";
import type { ContentComment, ContentKind } from "@/types";

interface CommentThreadProps {
  kind: ContentKind;
  contentId: number;
  allowReplies?: boolean;
}

const commentActionClass =
  "h-6 gap-1 rounded px-1.5 text-[11px] font-medium text-text-muted hover:bg-surface-2 hover:text-primary-700";
const commentDangerActionClass =
  "h-6 gap-1 rounded px-1.5 text-[11px] font-medium text-text-muted hover:bg-danger-50 hover:text-danger-700";
const commentActionIconClass = "h-3 w-3";

export function CommentThread({ kind, contentId, allowReplies = true }: CommentThreadProps) {
  const { toast } = useToast();
  const { confirm } = useDialog();
  const { user } = useAuth();
  const commentsQuery = useCommentsQuery(kind, contentId);
  const createComment = useCreateCommentMutation(kind, contentId);
  const createReply = useCreateCommentReplyMutation(kind, contentId);
  const updateComment = useUpdateCommentMutation(kind, contentId);
  const deleteComment = useDeleteCommentMutation(kind, contentId);
  const [content, setContent] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const submitComment = () => {
    createComment.mutate(
      { content },
      {
        onSuccess: () => {
          setContent("");
          toast("댓글이 등록되었습니다.", "success");
        },
      },
    );
  };

  const submitReply = (commentId: number) => {
    createReply.mutate(
      { commentId, dto: { content: replyContent } },
      {
        onSuccess: () => {
          setReplyTargetId(null);
          setReplyContent("");
          toast("답글이 등록되었습니다.", "success");
        },
      },
    );
  };

  const submitEdit = (commentId: number) => {
    updateComment.mutate(
      { commentId, dto: { content: editingContent } },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingContent("");
          toast("댓글이 수정되었습니다.", "success");
        },
      },
    );
  };

  const comments = commentsQuery.data ?? [];

  return (
    <Card className="overflow-hidden" padding="none">
      <div className="border-b border-border bg-surface-2 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-text">댓글</h3>
              <p className="mt-0.5 text-xs text-text-muted">{formatNumber(comments.length)}개의 의견</p>
            </div>
          </div>
          {!allowReplies && <Badge variant="secondary">답글 비활성</Badge>}
        </div>
      </div>

      <div className="border-b border-border px-5 py-5">
        <div className="rounded-lg border border-border bg-surface p-3">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={3}
            placeholder="댓글을 입력하세요"
            className="border-0 bg-transparent p-0 shadow-none focus:ring-0"
          />
          <div className="mt-3 flex justify-end">
            <Button
              loading={createComment.isPending}
              disabled={!content.trim()}
              rightIcon={<Send className="h-4 w-4" aria-hidden="true" />}
              onClick={submitComment}
            >
              댓글 등록
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        {commentsQuery.isLoading && <LoadingState message="댓글을 불러오는 중..." />}
        {commentsQuery.isError && <p className="text-sm text-danger-600">{commentsQuery.error.message}</p>}

        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allowReplies={allowReplies}
              editingId={editingId}
              editingContent={editingContent}
              replyTargetId={replyTargetId}
              replyContent={replyContent}
              loadingReply={createReply.isPending}
              loadingEdit={updateComment.isPending}
              loadingDelete={deleteComment.isPending}
              currentUserId={user?.id}
              isAdmin={isAdminRole(user?.role)}
              onStartReply={(id) => {
                setReplyTargetId(id);
                setReplyContent("");
              }}
              onCancelReply={() => {
                setReplyTargetId(null);
                setReplyContent("");
              }}
              onChangeReply={setReplyContent}
              onSubmitReply={submitReply}
              onStartEdit={(target) => {
                setEditingId(target.id);
                setEditingContent(target.content);
              }}
              onCancelEdit={() => {
                setEditingId(null);
                setEditingContent("");
              }}
              onChangeEdit={setEditingContent}
              onSubmitEdit={submitEdit}
              onDelete={async (id) => {
                const ok = await confirm("댓글을 삭제할까요?", {
                  message: "삭제된 댓글은 목록에서 제거됩니다.",
                  variant: "danger",
                  confirmLabel: "삭제",
                });
                if (!ok) return;

                deleteComment.mutate(id, {
                  onSuccess: () => toast("댓글이 삭제되었습니다.", "danger"),
                });
              }}
            />
          ))}
          {!commentsQuery.isLoading && comments.length === 0 && (
            <p className="rounded-lg border border-dashed border-border bg-surface-2 py-10 text-center text-sm text-text-muted">
              아직 등록된 댓글이 없습니다.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface CommentItemProps {
  comment: ContentComment;
  allowReplies: boolean;
  editingId: number | null;
  editingContent: string;
  replyTargetId: number | null;
  replyContent: string;
  loadingReply: boolean;
  loadingEdit: boolean;
  loadingDelete: boolean;
  currentUserId?: number;
  isAdmin: boolean;
  onStartReply: (id: number) => void;
  onCancelReply: () => void;
  onChangeReply: (value: string) => void;
  onSubmitReply: (id: number) => void;
  onStartEdit: (comment: ContentComment) => void;
  onCancelEdit: () => void;
  onChangeEdit: (value: string) => void;
  onSubmitEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function CommentItem({
  comment,
  allowReplies,
  editingId,
  editingContent,
  replyTargetId,
  replyContent,
  loadingReply,
  loadingEdit,
  loadingDelete,
  currentUserId,
  isAdmin,
  onStartReply,
  onCancelReply,
  onChangeReply,
  onSubmitReply,
  onStartEdit,
  onCancelEdit,
  onChangeEdit,
  onSubmitEdit,
  onDelete,
}: CommentItemProps) {
  const isEditing = editingId === comment.id;
  const isReplying = replyTargetId === comment.id;
  const canManage = comment.authorId === currentUserId || isAdmin;

  return (
    <article className="rounded-lg border border-border bg-surface px-4 py-4 transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <CommentAvatar name={comment.authorName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">{comment.authorName}</p>
            <p className="mt-0.5 text-xs text-text-muted">
              {formatDateTime(comment.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          {allowReplies && (
            <Button
              size="xs"
              variant="ghost"
              className={commentActionClass}
              leftIcon={<MessageSquareReply className={commentActionIconClass} aria-hidden="true" />}
              onClick={() => onStartReply(comment.id)}
            >
              답글
            </Button>
          )}
          {canManage && (
            <>
              <Button
                size="xs"
                variant="ghost"
                className={commentActionClass}
                leftIcon={<Pencil className={commentActionIconClass} aria-hidden="true" />}
                onClick={() => onStartEdit(comment)}
              >
                수정
              </Button>
              <Button
                size="xs"
                variant="ghost"
                className={commentDangerActionClass}
                leftIcon={<Trash2 className={commentActionIconClass} aria-hidden="true" />}
                loading={loadingDelete}
                onClick={() => onDelete(comment.id)}
              >
                삭제
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <Textarea
            value={editingContent}
            onChange={(event) => onChangeEdit(event.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              취소
            </Button>
            <Button
              size="sm"
              loading={loadingEdit}
              disabled={!editingContent.trim()}
              onClick={() => onSubmitEdit(comment.id)}
            >
              저장
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text">{comment.content}</p>
      )}

      {isReplying && (
        <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50/50 p-3">
          <Textarea
            value={replyContent}
            onChange={(event) => onChangeReply(event.target.value)}
            rows={3}
            placeholder="답글을 입력하세요"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onCancelReply}>
              취소
            </Button>
            <Button
              size="sm"
              loading={loadingReply}
              disabled={!replyContent.trim()}
              onClick={() => onSubmitReply(comment.id)}
            >
              답글 등록
            </Button>
          </div>
        </div>
      )}

      {!!comment.replies?.length && (
        <div className="mt-4 space-y-3 border-l border-border pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-lg bg-surface-2 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <CommentAvatar name={reply.authorName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text">{reply.authorName}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {formatDateTime(reply.createdAt)}
                    </p>
                  </div>
                </div>
                {(reply.authorId === currentUserId || isAdmin) && (
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="xs"
                      variant="ghost"
                      className={commentActionClass}
                      leftIcon={<Pencil className={commentActionIconClass} aria-hidden="true" />}
                      onClick={() => onStartEdit(reply)}
                    >
                      수정
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      className={commentDangerActionClass}
                      leftIcon={<Trash2 className={commentActionIconClass} aria-hidden="true" />}
                      loading={loadingDelete}
                      onClick={() => onDelete(reply.id)}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>
              {editingId === reply.id ? (
                <div className="mt-3 space-y-2">
                  <Textarea
                    value={editingContent}
                    onChange={(event) => onChangeEdit(event.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={onCancelEdit}>
                      취소
                    </Button>
                    <Button
                      size="sm"
                      loading={loadingEdit}
                      disabled={!editingContent.trim()}
                      onClick={() => onSubmitEdit(reply.id)}
                    >
                      저장
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text">{reply.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function CommentAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span
      className={
        size === "sm"
          ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700"
          : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700"
      }
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </span>
  );
}
