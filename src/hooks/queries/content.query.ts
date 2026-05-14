"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { contentService } from "@/api/content.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { ContentKind, ContentListParams, CreateContentDto, UpdateContentDto } from "@/types";

export function useContentsQuery(kind: ContentKind, params: ContentListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTENTS.list(kind, params),
    queryFn: () => contentService.getList(kind, params),
  });
}

export function useContentQuery(kind: ContentKind, id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.CONTENTS.detail(kind, id),
    queryFn: () => contentService.getById(kind, id),
    enabled: !!id,
  });
}

export function useCreateContentMutation(kind: ContentKind) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateContentDto) => contentService.create(kind, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENTS.lists(kind) });
    },
  });
}

export function useUpdateContentMutation(kind: ContentKind) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateContentDto }) => contentService.update(kind, id, dto),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENTS.lists(kind) });
      queryClient.setQueryData(QUERY_KEYS.CONTENTS.detail(kind, item.id), item);
    },
  });
}

export function useDeleteContentMutation(kind: ContentKind) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contentService.delete(kind, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENTS.lists(kind) });
    },
  });
}
