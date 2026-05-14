"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { commentService } from "@/api/comments.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { ContentKind, CreateCommentDto, UpdateCommentDto } from "@/types";

export function useCommentsQuery(kind: ContentKind, contentId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTENTS.comments(kind, contentId),
    queryFn: () => commentService.getList(kind, contentId),
    enabled: !!contentId,
  });
}

export function useCreateCommentMutation(kind: ContentKind, contentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCommentDto) => commentService.create(kind, contentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENTS.comments(kind, contentId) });
    },
  });
}

export function useCreateCommentReplyMutation(kind: ContentKind, contentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, dto }: { commentId: number; dto: CreateCommentDto }) =>
      commentService.createReply(kind, contentId, commentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENTS.comments(kind, contentId) });
    },
  });
}

export function useUpdateCommentMutation(kind: ContentKind, contentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, dto }: { commentId: number; dto: UpdateCommentDto }) =>
      commentService.update(kind, contentId, commentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENTS.comments(kind, contentId) });
    },
  });
}

export function useDeleteCommentMutation(kind: ContentKind, contentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => commentService.delete(kind, contentId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENTS.comments(kind, contentId) });
    },
  });
}
