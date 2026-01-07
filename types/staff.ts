import * as z from "zod"

const StaffSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

export {StaffSchema}
