import TextArea from "antd/es/input/TextArea"
import { useComponentsStore } from "../../../store/components"
import { useEffect, useState } from "react"

export interface GoToLinkConfig {
  type: 'goToLink'
  url: string
}

export interface GoToLinkProps {
  value?: string
  defaultValue?: string
  onChange?: (config: GoToLinkConfig) => void
}

function GoToLink(props: GoToLinkProps) {
  const { defaultValue, value: val, onChange } = props
  const { curComponentId } = useComponentsStore()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(val)
  }, [val])

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
    <div className="mt-[20px]">
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
