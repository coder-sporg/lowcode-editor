import { Form, Input, Select } from "antd"
import { useComponentsStore } from "../../store/components"
import { ComponentConfig, ComponentSetter, useComponentConfigStore } from "../../store/component-config"
import { useEffect } from "react"

export function ComponentAttr() {

  const [form] = Form.useForm()

  const { curComponent, curComponentId, updateComponentProps } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  useEffect(() => {
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.props })
  }, [curComponent])

  if(!curComponentId || !curComponent) return null

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting

    if(type === 'select') {
      return <Select options={options} />
    } else if(type === 'input') {
      return <Input />
    }
  }

  function ValueChange(changeValues: ComponentConfig) {
    if(curComponentId) {
      updateComponentProps(curComponentId, changeValues)
    }
  }

  return (
    <Form
      form={form}
      onValuesChange={ValueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled/>
      </Form.Item>
      {
        componentConfig[curComponent.name]?.setter?.map(setter => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElement(setter)}
          </Form.Item>
        ))
      }
    </Form>
  )
}
