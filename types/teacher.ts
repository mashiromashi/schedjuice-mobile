import { ISubject } from "./subject";
import * as z from "zod"

const TeacherSchema = z.object({
    name: z.string({required_error: "this is required"}),
    email: z.string().email(),
    password: z.string()
})


export interface ITeacher {
    id?: number,
    name?: string,
    subjects?: ISubject[]
}

export {TeacherSchema}