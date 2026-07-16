import { z } from 'zod';

// ─── Query params ───────────────────────────────────────────
export const ListNotificationsQuerySchema = z.object({
  filter: z.enum(['read', 'unread']).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListNotificationsQuery = z.infer<typeof ListNotificationsQuerySchema>;

// ─── Path params ────────────────────────────────────────────
export const NotificationIdParamsSchema = z.object({
  id: z.string().uuid('Invalid notification ID format'),
});
export type NotificationIdParams = z.infer<typeof NotificationIdParamsSchema>;

// ─── Request bodies ─────────────────────────────────────────
export const UpdatePreferencesBodySchema = z.object({
  inApp: z.boolean().optional(),
  email: z.boolean().optional(),
  types: z.record(z.string(), z.boolean()).optional(),
});
export type UpdatePreferencesBody = z.infer<typeof UpdatePreferencesBodySchema>;

// ─── Response interfaces ────────────────────────────────────
export interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  data: NotificationResponse[];
  unreadCount: number;
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface NotificationPreferencesResponse {
  inApp: boolean;
  email: boolean;
  types: Record<string, boolean>;
}

export interface MarkReadResponse {
  success: true;
}

export interface MarkAllReadResponse {
  success: true;
  updatedCount: number;
}
