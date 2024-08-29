import { Table as AntdTable } from "antd";
import React, { useEffect, useMemo, useRef } from "react";
import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";
import { useDrag } from "react-dnd";

function Table({ id, name, children, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(["TableColumn"], id);

  const divRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  // 拖拽 TableColumn 组件过来的时候，用 React.Children 遍历，把它变为 columns 配置
  const columns = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      return {
        title: (
          <div
            className="m-[-16px] p-[16px]"
            data-component-id={item.props?.id}
          >
            {item.props?.title}
          </div>
        ),
        dataIndex: item.props?.dataIndex,
        key: item,
      };
    });
  }, [children]);

  return (
    <div
      className={`w-[100%] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
      ref={divRef}
      data-component-id={id}
      style={styles}
    >
      <AntdTable columns={columns} dataSource={[]} pagination={false} />
    </div>
  );
}

export default Table;
