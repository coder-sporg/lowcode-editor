import { Button, Collapse, CollapseProps } from "antd"
import { useComponentConfigStore } from "../../store/component-config"
import type { ComponentEvent } from "../../store/component-config"
import { useComponentsStore } from "../../store/components"
import { useState } from "react"
import ActionModal from "./actions/ActionModal"
import { GoToLinkConfig } from "./actions/GoToLink"
import { ShowMessageConfig } from "./actions/ShowMessage"
import { DeleteOutlined } from "@ant-design/icons"

export function ComponentEvent() {
  const { curComponent, curComponentId, updateComponentProps } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  // 控制弹窗的显示与隐藏
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>();


  if(!curComponent) return null

  // // 改变url
  // function urlChange(eventName: string, value: string) {
  //   if(!curComponentId) return null

  //   updateComponentProps(curComponentId, {
  //     [eventName]: {
  //       ...curComponent?.props?.[eventName],
  //       url: value
  //     }
  //   })
  // }

  // 生成 collapse 右上角内容
  const genExtra = (event: ComponentEvent) => {
    return <Button
      type="primary"
      onClick={
        (e) => {
          e.stopPropagation()
          setCurEvent(event)
          setActionModalOpen(true)
        }
      }
    >
      添加动作
    </Button>
  }

  // 删除action
  const deleteAction = (event: ComponentEvent, index: number) => {
    if(!curComponent) return

    const actions = curComponent.props[event.name]?.actions || []
    actions.splice(index, 1)
    updateComponentProps(curComponentId!, {
      [event.name]: {
        actions
      }
    })
  }

  const items: CollapseProps['items'] = (componentConfig[curComponent.name].events ?? []).map(event => {
    return {
      key: event.name,
      label: event.label,
      children: <div>
        {
          (curComponent.props[event.name]?.actions || []).map((item: GoToLinkConfig | ShowMessageConfig, index: number) => {
            return <div key={index}>
              {
                item.type === 'goToLink' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                  <div className='text-[blue]'>跳转链接</div>
                  <div>{item.url}</div>
                  <div 
                    style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                    onClick={() => deleteAction(event, index)}>
                    <DeleteOutlined />
                  </div>
                </div> : null
              }
              {
                item.type === 'showMessage' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                  <div className='text-[blue]'>消息弹窗</div>
                  <div>{item.config.type}</div>
                  <div>{item.config.text}</div>
                  <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                    onClick={() => deleteAction(event, index)}>
                    <DeleteOutlined />
                  </div>
                </div> : null
              }
            </div>
          })
        }
      </div>,
      extra: genExtra(event),
      style: {
        alignItems: 'center'
      }
    }
  })

  // 处理弹窗确认
  function handleModelOk(config?: GoToLinkConfig | ShowMessageConfig) {
    if(!config || !curEvent || !curComponentId) return

    updateComponentProps(curComponentId, {
      [curEvent.name]: {
        actions: [
          ...(curComponent?.props[curEvent.name]?.actions || []),
          config
        ]
      }
    })
    setActionModalOpen(false)
  }

  return <div className='px-[10px]'>
    <Collapse className='mb-[10px] component-event' items={items}
      defaultActiveKey={componentConfig[curComponent.name].events?.map(item =>item.name)}
    />
    <ActionModal
      visible={actionModalOpen}
      handleOk={handleModelOk}
      handleCancel={() => setActionModalOpen(false)}
    />
  </div>
}
