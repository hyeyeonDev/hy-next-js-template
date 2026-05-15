"use client";

import { useState } from "react";
import { MessageSquareReply, Pencil, Trash2 } from "lucide-react";

import {
  useCommentsQuery,
  useCreateCommentMutation,
  useCreateCommentReplyMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/data-display";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Card, Textarea } from "@/components/ui";
import { isAdminRole } from "@/lib/roles";
import type { ContentComment, ContentKind } from "@/types";

interface CommentThreadProps {
  kind: ContentKind;
  contentId: number;
  allowReplies?: boolean;
}

export function CommentThread({ kind, contentId, allowReplies = true }: CommentThreadProps) {
  const { toast } = useToast();
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

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text">댓글</h3>
          <p className="mt-1 text-xs text-text-muted">
            실제 API 연결 시 `comments.api.ts`의 service만 교체하면 됩니다.
          </p>
        </div>
        {!allowReplies && <Badge variant="secondary">대댓글 비활성</Badge>}
      </div>

      <div className="mb-6 space-y-3">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          placeholder="댓글을 입력하세요"
        />
        <div className="flex justify-end">
          <Button loading={createComment.isPending} disabled={!content.trim()} onClick={submitComment}>
            댓글 등록
          </Button>
        </div>
      </div>

      {commentsQuery.isLoading && <LoadingState message="댓글을 불러오는 중..." />}
      {commentsQuery.isError && <p className="text-sm text-danger-600">{commentsQuery.error.message}</p>}

      <div className="space-y-4">
        {(commentsQuery.data ?? []).map((comment) => (
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
            onDelete={(id) => {
              deleteComment.mutate(id, {
                onSuccess: () => toast("댓글이 삭제되었습니다.", "danger"),
              });
            }}
          />
        ))}
        {!commentsQuery.isLoading && (commentsQuery.data ?? []).length === 0 && (
          <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-text-muted">
            아직 등록된 댓글이 없습니다.
          </p>
        )}
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
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">{comment.authorName}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {new Date(comment.createdAt).toLocaleString("ko-KR")}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {allowReplies && (
            <Button size="xs" variant="ghost" leftIcon={<MessageSquareReply aria-hidden="true" />} onClick={() => onStartReply(comment.id)}>
              답글
            </Button>
          )}
          {canManage && (
            <>
              <Button size="xs" variant="ghost" leftIcon={<Pencil aria-hidden="true" />} onClick={() => onStartEdit(comment)}>
                수정
              </Button>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Trash2 aria-hidden="true" />}
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
          <Textarea value={editingContent} onChange={(event) => onChangeEdit(event.target.value)} rows={3} />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              취소
            </Button>
            <Button size="sm" loading={loadingEdit} disabled={!editingContent.trim()} onClick={() => onSubmitEdit(comment.id)}>
              저장
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text">{comment.content}</p>
      )}

      {isReplying && (
        <div className="mt-4 space-y-2 border-l-2 border-primary-200 pl-4">
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
            <Button size="sm" loading={loadingReply} disabled={!replyContent.trim()} onClick={() => onSubmitReply(comment.id)}>
              답글 등록
            </Button>
          </div>
        </div>
      )}

      {!!comment.replies?.length && (
        <div className="mt-4 space-y-3 border-l-2 border-border pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-md bg-surface-2 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">{reply.authorName}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {new Date(reply.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                {(reply.authorId === currentUserId || isAdmin) && (
                  <div className="flex shrink-0 gap-1">
                    <Button size="xs" variant="ghost" leftIcon={<Pencil aria-hidden="true" />} onClick={() => onStartEdit(reply)}>
                      수정
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      leftIcon={<Trash2 aria-hidden="true" />}
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
                  <Textarea value={editingContent} onChange={(event) => onChangeEdit(event.target.value)} rows={3} />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={onCancelEdit}>
                      취소
                    </Button>
                    <Button size="sm" loading={loadingEdit} disabled={!editingContent.trim()} onClick={() => onSubmitEdit(reply.id)}>
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
    </div>
  );
}
