// This file is auto-generated by @hey-api/openapi-ts

import { z } from "zod";

export const zBody_create_leaderboard = z.object({
  leaderboard_name: z.string(),
  picture: z.string().optional(),
});

export const zBody_create_log = z.object({
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});

export const zBody_login = z.object({
  grant_type: z.unknown().optional(),
  username: z.string(),
  password: z.string(),
  scope: z.string().optional().default(""),
  client_id: z.unknown().optional(),
  client_secret: z.unknown().optional(),
});

export const zBody_register_user = z.object({
  password: z.string(),
  email: z.string(),
  nick_name: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const zHTTPValidationError = z.object({
  detail: z
    .array(
      z.object({
        loc: z.array(z.unknown()),
        msg: z.string(),
        type: z.string(),
      })
    )
    .optional(),
});

export const zLeaderboard = z.object({
  leaderboard_name: z.unknown().optional(),
  picture: z.unknown().optional(),
  is_active: z.unknown().optional(),
  invite_code: z.string(),
  uuid: z.string().uuid(),
});

export const zLeaderboardData = z.object({
  leaderboard_name: z.unknown().optional(),
  picture: z.unknown().optional(),
  is_active: z.unknown().optional(),
  invite_code: z.string(),
  uuid: z.string().uuid(),
  users_data: z.array(
    z.object({
      first_name: z.unknown().optional(),
      last_name: z.unknown().optional(),
      nick_name: z.unknown().optional(),
      picture: z.unknown().optional(),
      hours: z.string(),
    })
  ),
});

export const zLeaderboardUpdate = z.object({
  leaderboard_name: z.unknown().optional(),
  picture: z.unknown().optional(),
  is_active: z.unknown().optional(),
  invite_code: z.unknown().optional(),
});

export const zLog = z.object({
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  uuid: z.string().uuid(),
});

export const zLogHours = z.object({
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  uuid: z.string().uuid(),
  hours: z.string(),
});

export const zLogUpdate = z.object({
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});

export const zPublicUser = z.object({
  first_name: z.unknown().optional(),
  last_name: z.unknown().optional(),
  nick_name: z.unknown().optional(),
  picture: z.unknown().optional(),
  hours: z.string(),
});

export const zTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const zTotalHours = z.object({
  hours: z.string(),
});

export const zUser = z.object({
  first_name: z.unknown().optional(),
  last_name: z.unknown().optional(),
  nick_name: z.unknown().optional(),
  picture: z.unknown().optional(),
  email: z.unknown().optional(),
  is_active: z.unknown().optional(),
  is_superuser: z.unknown().optional(),
  uuid: z.string().uuid(),
});

export const zUserUpdate = z.object({
  first_name: z.unknown().optional(),
  last_name: z.unknown().optional(),
  nick_name: z.unknown().optional(),
  picture: z.unknown().optional(),
  password: z.unknown().optional(),
  email: z.unknown().optional(),
  is_active: z.unknown().optional(),
  is_superuser: z.unknown().optional(),
});

export const zValidationError = z.object({
  loc: z.array(z.unknown()),
  msg: z.string(),
  type: z.string(),
});
