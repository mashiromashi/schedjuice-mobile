


export type shapeProps = {
    x: number,
    y: number,
    height: number,
    width: number,
    id: string,
    draggable?: boolean,
    fill?: string
}

export interface baseComponentType  {
    isSelected?: boolean,
    onChange: (newAttrs: any) =>void, 
    onSelect?: React.Dispatch<React.SetStateAction<boolean>>,
}

export enum componentEnum {
    rect = "rect",
    image = "image",
    text = "text"
}


interface rectShapeProps extends shapeProps {

}
interface IRect {
    type: componentEnum.rect,
    shapeProps: rectShapeProps,
}


interface imageShapProps extends shapeProps {
    src: CanvasImageSource
}
interface IImage  {
    type: componentEnum.image,
    shapeProps: imageShapProps
}


interface textShapProps extends shapeProps {
    text: string,
    fontSize: number
    fontFamily: string,
    textWidht?: number,
    wrap?: "word" | "char" | "none";
}

interface IText {
    type: componentEnum.text,
    shapeProps: textShapProps
}

export type componentType = IRect | IImage | IText

export type certificateType = {

    components: componentType[],
    selectedComponentId:  number | string
}