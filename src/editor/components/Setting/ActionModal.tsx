import { Modal, Segmented } from "antd"
import { useEffect, useState } from "react"
import GoToLink, { GoToLinkConfig } from "./actions/GoToLink"
import ShowMessage, { ShowMessageConfig } from "./actions/ShowMessage"
import { CustomJSConfig, CustomJS } from "./actions/CustomJS"
import { ComponentMethod, ComponentMethodConfig } from "./actions/ComponentMethod"

interface ActionModelProps {
  visible: boolean
  action?: ActionConfig
  handleOk: (config?: ActionConfig) => void
  handleCancel: () => void
}

export type ActionConfig = GoToLinkConfig | ShowMessageConfig | CustomJSConfig | ComponentMethodConfig

function ActionModal(props: ActionModelProps) {

  const { visible, action, handleOk, handleCancel } = props

  const map = {
    goToLink: '访问链接',
    showMessage: '消息提示',
    customJS: '自定义 JS',
    componentMethod: '组件方法'
  }

  const [key, setKey] = useState('访问链接')
  const [curConfig, setCurConfig] = useState<ActionConfig>()

  useEffect(() => {
    if(action?.type) {
      setKey(map[action.type])
    }
  }, [action])

  return <Modal
    title='事件动作配置'
    width={800}
    open={visible}
    okText='添加'
    cancelText='取消'
    onOk={() => {
      setKey(map['goToLink'])
      handleOk(curConfig)
    }}
    onCancel={() => {
      setKey(map['goToLink'])
      handleCancel()
    }}
  >
    <div className="h-[500px]">
      <Segmented value={key} onChange={setKey} block options={['访问链接', '消息提示', '组件方法', '自定义 JS']} />
      {
        key === '访问链接' && <GoToLink value={action?.type === 'goToLink' ? action.url : ''} onChange={(config) => setCurConfig(config)} />
      }
      {
        key === '消息提示' &&
        <ShowMessage
          onChange={(config) => setCurConfig(config)}
          value={action?.type === 'showMessage' ? action.config : undefined} />
      }
      {
        key === '组件方法' &&
        <ComponentMethod
          onChange={(config) => setCurConfig(config)}
          value={action?.type === 'componentMethod' ? action.config : undefined} />
      }
      {
        key === '自定义 JS' &&
          <CustomJS onChange={config => setCurConfig(config)}
          value={action?.type === 'customJS' ? action.code : ''}
        />
      }
    </div>
  </Modal>
}

export default ActionModal