import { useComponentsStore } from "../../store/components";
import { useComponentConfigStore } from "../../store/conponent-config";
import { useDrop } from "react-dnd";
import { CommonComponentProps } from "../../interface";
import { message } from "antd";

const Container = ({ id, children }: CommonComponentProps) => {
  const { addComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: ["Button", "Container"],
    drop: (item: { type: string }, monitor) => {
      const didDrop = monitor.didDrop()
      // container 中拖拽时，page不做处理
      if(didDrop) return

      const props = componentConfig[item.type];
      addComponent(
        {
          id: new Date().getTime(),
          name: item.type,
          props,
        },
        id
      );
      message.success(item.type);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
