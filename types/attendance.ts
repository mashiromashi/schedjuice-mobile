import * as z from "zod"
import { accountSchema } from "./user"
import { eventSchema } from "./course"

export enum attendanceStatus {
    unregistered = "unregistered",
    present = "present",
    absent = "absent",
    late = "late"

}

export const attendanceSchema = z.object({
    id: z.number(),
    user: accountSchema,
    event: eventSchema,
    attendance_status: z.nativeEnum(attendanceStatus),
    attendance_note: z.string().nullable().optional(),
})

export type attendanceType = typeof attendanceSchema._type