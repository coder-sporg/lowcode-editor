import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"
import { CSSProperties } from "react"

export interface ButtonProps {
  id: number // 用于处理hover 和 click
  type: ButtonType
  text: string
  styles: CSSProperties
}

const Button = ({ id, type, text, styles }: ButtonProps) => {
  return (
    <AntdButton data-component-id={id} type={type} style={styles}>{ text }</AntdButton>
  )
}

export default Button
