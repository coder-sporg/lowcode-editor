import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"

export interface ButtonPorps {
  type: ButtonType
  text: string
}

const Button = ({ type, text }: ButtonPorps) => {
  return (
    <AntdButton type={type}>{ text }</AntdButton>
  )
}

export default Button
