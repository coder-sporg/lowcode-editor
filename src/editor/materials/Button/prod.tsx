import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"
import { CSSProperties } from "react"

export interface ButtonProps {
  id: number // 用于处理hover 和 click
  type: ButtonType
  text: string
  styles: CSSProperties,
  [key: string]: any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({ id, type, text, styles, ...props }: ButtonProps) => {
  return (
    <AntdButton type={type} style={styles} {...props}>{ text }</AntdButton>
  )
}

export default Button
