import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

const Container = ({ id, name, children, styles }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(['Button', 'Container', 'Table'], id)

  const divRef = useRef<HTMLDivElement>(null)

  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      // 添加拖拽类型，用于区分新增组件还是移动组件
      dragType: 'move',
      id
    }
  })

  useEffect(() => {
    // 同时给 div 绑定 drag、drop 的处理,在拿到ref之后绑定
    drop(divRef)
    drag(divRef)
  }, [])

  return (
    <div
      ref={divRef}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      style={styles}
    >
      {children}
    </div>
  );
};

export default Container;
