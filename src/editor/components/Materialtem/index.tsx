import { useDrag } from "react-dnd"

export interface MaterialItemProps {
  name: string
  desc: string
}

export function MaterialItem(props: MaterialItemProps) {
  const { name, desc } = props

  const [, drag] = useDrag({
    // 当前drag元素的标识，drop的时候根据这个来决定是否accept
    type: name,
    item: {
      type: name
    }
  })

  return <div
    ref={drag}
    className="
      border-dashed
      border-[1px]
      border=[#000]
      py-[8px] px-[10px]
      m-[10px]
      cursor-move
      inline-block
      bg-white
      hover:bg-[#ccc]
    "
  >
  { desc }
</div>
}