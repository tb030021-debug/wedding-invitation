import { z } from "zod";

export const guestbookSideSchema = z.enum(["GROOM_SIDE", "BRIDE_SIDE"]);

const fourDigitPasswordSchema = z
  .string()
  .trim()
  .regex(/^\d{4}$/, "삭제용 비밀번호는 숫자 4자리로 입력해 주세요.");

const trimmedString = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label}을(를) 입력해 주세요.`)
    .max(max, `${label}은(는) ${max}자 이하로 입력해 주세요.`)
    .refine((value) => !/<\/?script/i.test(value), "허용되지 않는 문구가 포함되어 있습니다.");

export const guestbookCreateSchema = z.object({
  name: trimmedString(1, 20, "이름"),
  side: guestbookSideSchema,
  message: trimmedString(1, 300, "축하 메시지"),
  password: fourDigitPasswordSchema
});

export const guestbookDeleteSchema = z.object({
  password: fourDigitPasswordSchema
});

export const adminLoginSchema = z.object({
  username: trimmedString(1, 50, "아이디"),
  password: trimmedString(4, 100, "비밀번호")
});

export const adminGuestbookQuerySchema = z.object({
  side: z.enum(["ALL", "GROOM_SIDE", "BRIDE_SIDE"]).default("ALL"),
  keyword: z.string().trim().max(80).default(""),
  hidden: z.enum(["ALL", "VISIBLE", "HIDDEN"]).default("ALL"),
  order: z.enum(["desc", "asc"]).default("desc")
});

export const adminGuestbookUpdateSchema = z
  .object({
    isHidden: z.boolean().optional(),
    side: guestbookSideSchema.optional(),
    name: trimmedString(1, 20, "이름").optional(),
    message: trimmedString(1, 300, "축하 메시지").optional()
  })
  .refine((value) => Object.keys(value).length > 0, "수정할 값이 없습니다.");

export const exportQuerySchema = z.object({
  side: z.enum(["ALL", "GROOM_SIDE", "BRIDE_SIDE"]).default("ALL"),
  includeHidden: z.enum(["true", "false"]).default("true")
});
