import { Input, Select } from "antd";
import { ComponentEvent } from "../../../store/component-config";
import { useComponentsStore } from "../../../store/components";

function ShowMessage(props: { event: ComponentEvent }) {
  const { event } = props

  const { curComponent, curComponentId, updateComponentProps } = useComponentsStore()

  function messageTypeChange(eventName: string, value: string) {
    if(!curComponentId) return

    updateComponentProps(curComponentId, {
      [event.name]: {
        ...curComponent?.props?.[event.name],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          type: value
        }
      }
    })
  }

  function messageTextChange(eventName: string, value: string) {
    if(!curComponentId) return

    updateComponentProps(curComponentId, {
      [event.name]: {
        ...curComponent?.props?.[event.name],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          text: value
        }
      }
    })
  }

  return <div className="mt-[10px]">
    <div className="flex items-center gap-[10px]">
      <div>类型：</div>
      <div>
        <Select
          style={{ width: 160 }}
          options={[
            { label: '成功', value: 'success' },
            { label: '失败', value: 'error' }
          ]}
          onChange={value => {messageTypeChange(event.name, value)}}
          value={curComponent?.props[event.name]?.config?.type}
        />
      </div>
    </div>
    <div className="flex items-center gap-[10px] mt-[10px]">
      <div>文本：</div>
      <div>
        <Input
          style={{ width: 160 }}
          onChange={e => messageTextChange(event.name, e.target.value)}
          value={curComponent?.props?.[event.name]?.config?.text}
        />
      </div>
    </div>
  </div>
}

export default ShowMessage
