import TextArea from "antd/es/input/TextArea"
import { useComponentsStore } from "../../../store/components"
import { useState } from "react"

export interface GoToLinkConfig {
  type: 'goToLink'
  url: string
}

export interface GoToLinkProps {
  defaultValue?: string
  onChange?: (config: GoToLinkConfig) => void
}

function GoToLink(props: GoToLinkProps) {
  const { defaultValue, onChange } = props
  const { curComponentId } = useComponentsStore()
  const [value, setValue] = useState(defaultValue)

  // 改变url
  function urlChange(value: string) {
    if(!curComponentId) return null

    setValue(value)
    onChange?.({
      type: 'goToLink',
      url: value
    })
  }

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>链接：</div>
        <div>
          <TextArea
            style={{ width: 500, height: 200, border: '1px solid #000' }}
            onChange={e => urlChange(e.target.value)}
            value={value}
          />
        </div>
      </div>
    </div>
  )
}

export default GoToLink
