import { message } from "antd";
import { useDrop } from "react-dnd";
import { useComponentsStore } from "../../store/components"
import { useComponentConfigStore } from "../../store/conponent-config";
import { CommonComponentProps } from "../../interface";

function Page({ id, children }: CommonComponentProps) {

  const { addComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: ['Button', 'Container'],
    drop: (item: { type: string }, monitor) => {

      const didDrop = monitor.didDrop()
      // container 中拖拽时，page不做处理
      if(didDrop) return

      const props = componentConfig[item.type]
      addComponent({
        id: new Date().getTime(),
        name: item.type,
        props
      }, id)
      message.success(item.type)
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop()
    })
  }))

  return (
    <div
      ref={drop}
      className='p-[20px] h-[100%] box-border bg-slate-200'
      style={{ border: canDrop ? '2px solid blue' : 'none' }}
    >
      {children}
    </div>
  )
}

export default Page;
