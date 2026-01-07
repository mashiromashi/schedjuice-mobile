
export type queryParamOptions = {
    page?: number,
    size?: number,
    sorts?: string[],
    expand?: string[],
    fields?: string[],
    csv?: boolean,
    group_by?: "latest"| "best" | "all"
    range?: string
    range_group_by?: "day" | "month"
    onlyFree?: boolean
    q?: string
    all?: boolean
}

export enum operatorEnum {
    exact = "exact",
    iexact = "iexact",
    in = "in",
    lt = "lt",
    gt = "gt",
    lte = "lte",
    gte = "gte",
    icontains = "icontains",
    contains = "contains",
    contained_by = "contained_by",
    isnull= "isnull"

}

export type filterParam = {
    field_name: string,
    operator: operatorEnum,
    value: string 
}

export type filterParamsBody = {
    filter_params?: filterParam[],
    exclude_params?: filterParam[]
}

