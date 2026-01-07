import * as z from "zod"


const organizationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    tagline: z.string(),
    domain_url: z.string().describe("Domain"),
    is_admin: z.boolean(),
    available_domains: z.array(z.string()),
    default_cover_image: z.string().optional().nullable().describe("Default cover image").or(z.object({})),

    is_homepage_disabled: z.boolean(),
    is_student_login_disabled: z.boolean().describe("Disable student login"),
    is_library_disabled: z.boolean().describe("Disable library"),

    // microsoft stuffs
    is_microsoft_on: z.boolean(),

    authority: z.string().optional().nullable(),
    app_id: z.string().optional().nullable(),

    // library stuffs
    library_title: z.string().describe("Library title"),

})
const organizationCreateSchema = organizationSchema.pick({
    name: true,
    description: true,
    tagline: true,
    domain_url: true,
    is_microsoft_on: true,
    authority: true,
    app_id: true,
})

const organizationEditSchema = organizationSchema.omit({
    id: true,
    domain_url: true,
    is_admin: true,
})

const organizationOwnerEditSchema = organizationSchema.omit({
    id: true,
    is_admin: true,
    domain_url: true,
    is_microsoft_on: true,
    app_id: true,
    authority: true,
    is_homepage_disabled: true,
    available_domains: true,
})

export type organizationType = z.infer<typeof organizationSchema>
export {
    organizationSchema,
    organizationCreateSchema,
    organizationEditSchema,
    organizationOwnerEditSchema
}