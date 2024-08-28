import { Collapse, CollapseProps, Select } from "antd"
import { useComponentConfigStore } from "../../store/component-config"
import { useComponentsStore } from "../../store/components"
import GoToLink from "./actions/GoToLink"
import ShowMessage from "./actions/ShowMessage"


export function ComponentEvent() {
  const { curComponent, curComponentId, updateComponentProps } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()


  if(!curComponent) return null

  // 改变选择事件
  function selectAction(eventName: string, value: string) {
    if(!curComponentId) return
    updateComponentProps(curComponentId, {
      [eventName]: {
        type: value
      }
    })
  }

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

  const items: CollapseProps['items'] = (componentConfig[curComponent.name].events ?? []).map(event => {
    return {
      key: event.name,
      label: event.label,
      children: <div>
        <div className="flex items-center gap-[10px]">
          <div>动作：</div>
          <div>
            <Select
              style={{ width: 160 }}
              options={[
                { label: '显示提示', value: 'showMessage' },
                { label: '跳转链接', value: 'goToLink' }
              ]}
              // change事件
              onChange={ value =>  selectAction(event.name, value)}
              value={curComponent?.props?.[event.name]?.type}
            />
          </div>
        </div>
        {
          curComponent.props?.[event.name]?.type === 'goToLink' &&
          <GoToLink event={event} />
        }
        {
          curComponent.props?.[event.name]?.type === 'showMessage' &&
          <ShowMessage event={event} />
        }
      </div>
    }
  })

  return <div className='px-[10px]'>
        <Collapse className='mb-[10px]' items={items}/>
    </div>
}
