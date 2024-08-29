import { Button as AntdButton } from "antd"
import { ButtonType } from "antd/es/button"
import { CSSProperties } from "react"
import { useDrag } from "react-dnd"

export interface ButtonProps {
  id: number // 用于处理hover 和 click
  type: ButtonType
  text: string
  styles: CSSProperties
}

const Button = ({ id, type, text, styles }: ButtonProps) => {
  const [, drag] = useDrag({
    type: 'Button',
    item: {
      type: 'Button',
      // 添加拖拽类型，用于区分新增组件还是移动组件
      dragType: 'move',
      id
    }
  })

  return (
    <AntdButton ref={drag} data-component-id={id} type={type} style={styles}>{ text }</AntdButton>
  )
}

export default Button
