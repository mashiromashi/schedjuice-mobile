import * as z from "zod"


export enum questionEnum {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    TEXTAREA = "TEXTAREA",
    RADIO = "RADIO",
    CHECKBOX = "CHECKBOX",
    SELECT = "SELECT",
    DATE = "DATE",
    DATE_RANGE = "DATE_RANGE",
    TIME = "TIME",
    TIME_RANGE = "TIME_RANGE",
    DATETIME = "DATETIME",
    DATETIME_RANGE = "DATETIME_RANGE",
    FILE = "FILE",
    IMAGE = "IMAGE",
}

export type baseQuestionType = {
    id: string,
    type: questionEnum
}

export type baseTextQuestionType = baseQuestionType & {
    type: questionEnum.TEXT | questionEnum.NUMBER | questionEnum.TEXTAREA,
    label: string,
}

export type optionType = {
    id: string,
    label: string
    value: string
}

export type baseChoiceQuestionType = baseQuestionType & {
    type: questionEnum.RADIO | questionEnum.CHECKBOX | questionEnum.SELECT,
    label: string,
    choices: optionType[]
}


export type formType = {
    id: number
    name: string
    description: string
    form_data: any

}