import { Button, Collapse, CollapseProps } from "antd"
import { useComponentConfigStore } from "../../store/component-config"
import type { ComponentEvent } from "../../store/component-config"
import { getComponentById, useComponentsStore } from "../../store/components"
import { useState } from "react"
import ActionModal, { ActionConfig } from "./ActionModal"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"

export function ComponentEvent() {
  const { curComponent, curComponentId, updateComponentProps, components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  // 控制弹窗的显示与隐藏
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>();
  const [curAction, setCurAction] = useState<ActionConfig>()
  // 记录当前修改action的索引，用于判断新增还是更新
  const [curActionIndex, setCurActionIndex] = useState<number>();

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

  // 编辑action
  const editAction = (action: ActionConfig, index: number) => {
    if(!curComponent) return
    setCurAction(action)
    setCurActionIndex(index)
    setActionModalOpen(true)
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
          (curComponent.props[event.name]?.actions || []).map((item: ActionConfig, index: number) => {
            return <div key={index}>
              {
                item.type === 'goToLink' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                  <div className='text-[blue]'>跳转链接</div>
                  <div>{item.url}</div>
                  <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                    onClick={() => editAction(item, index)}
                  >
                    <EditOutlined />
                  </div>
                  <div
                    style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                    onClick={() => deleteAction(event, index)}>
                    <DeleteOutlined />
                  </div>
                </div> : null
              }
              {
                item.type === 'showMessage' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                  <div className='text-[blue]'>消息提示</div>
                  <div>{item.config.type}</div>
                  <div>{item.config.text}</div>
                  <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                    onClick={() => editAction(item, index)}
                  >
                    <EditOutlined />
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                    onClick={() => deleteAction(event, index)}>
                    <DeleteOutlined />
                  </div>
                </div> : null
              }
              {
                item.type === 'customJS' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                  <div className='text-[blue]'>自定义 JS</div>
                  <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                    onClick={() => editAction(item, index)}
                  >
                    <EditOutlined />
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                    onClick={() => deleteAction(event, index)}>
                    <DeleteOutlined />
                  </div>
                </div> : null
              }
              {
                item.type === 'componentMethod' ? <div className='border border-[#aaa] m-[10px] p-[10px] relative'>
                  <div className='text-[blue]'>组件方法</div>
                  <div>{getComponentById(components, item.config.componentId)?.desc}</div>
                  <div>{item.config.componentId}</div>
                  <div>{item.config.method}</div>
                  <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                    onClick={() => editAction(item, index)}
                  >
                    <EditOutlined />
                  </div>
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
  function handleModelOk(config?: ActionConfig) {
    if(!config || !curEvent || !curComponentId) return

    if(curAction) {
      // 只做修改
      updateComponentProps(curComponentId, {
        [curEvent.name]: {
          actions: (curComponent?.props[curEvent.name]?.actions || []).map((item: ActionConfig, index: number) => {
            return index === curActionIndex ? config : item
          })
        }
      })
    } else {
      updateComponentProps(curComponentId, {
        [curEvent.name]: {
          actions: [
            ...(curComponent?.props[curEvent.name]?.actions || []),
            config
          ]
        }
      })
    }

    setCurAction(undefined)
    setCurActionIndex(-1)
    setActionModalOpen(false)
  }

  return <div className='px-[10px]'>
    <Collapse className='mb-[10px] component-event' items={items}
      defaultActiveKey={componentConfig[curComponent.name].events?.map(item =>item.name)}
    />
    <ActionModal
      visible={actionModalOpen}
      action={curAction}
      handleOk={handleModelOk}
      handleCancel={() => {
        setCurAction(undefined)
        setActionModalOpen(false)
      }}
    />
  </div>
}
