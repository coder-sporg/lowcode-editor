import { Form, Input, InputNumber, Select } from 'antd'
import { CSSProperties, useEffect, useState } from 'react';
import { ComponentSetter, useComponentConfigStore } from '../../store/component-config'
import { useComponentsStore } from '../../store/components'
import CssEditor from './CssEditor'
import { debounce } from 'lodash-es'
import styleToObject from 'style-to-object'

export function ComponentStyle() {

  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentStyles } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [css, setCss] = useState<string>(".comp{\n\n}")

  useEffect(() => {
    // 组件发生变化时，重置表单
    form.resetFields()
    const data = form.getFieldsValue();
    form.setFieldsValue({...data, ...curComponent?.styles});

    // 重置css编辑器样式
    setCss(toCSSStr(curComponent?.styles ?? {}))
  }, [curComponent])

  if (!curComponentId || !curComponent) return null;

  // 样式表单的渲染
  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;

    if (type === 'select') {
      return <Select options={options} />
    } else if (type === 'input') {
      return <Input />
    } else if (type === 'inputNumber') {
      return <InputNumber />
    }
  }

  function valueChange(changeValues: CSSProperties) {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues);
    }
  }

  // 拼接css字符串
  function toCSSStr(css: Record<string, any>) {
    let str = `.comp {\n`;
    for(const key in css) {
      let value = css[key];
      if(!value) {
        continue;
      }
      if(['width', 'height'].includes(key) && !value.toString().endsWith('px')) {
        value += 'px';
      }

      str += `\t${key}: ${value};\n`
    }
    str += `}`;
    return str;
  }

  // 处理 css 编辑器
  const handleChange = debounce((value: any) => {
    setCss(value)

    const css: Record<string, any> = {};

    try {
      const cssStr = value.replace(/\/\*.*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
        .replace('}', '');// 去掉 }

      styleToObject(cssStr, (name, value) => {
        css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
      });

      console.log('99999', css);
      updateComponentStyles(curComponentId, { ...form.getFieldsValue(), ...css }, true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(e) {
      // 编辑器语法错误
      // console.log("🚀 ~ .replace ~ e:", e)
    }
  }, 500)

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {
        componentConfig[curComponent.name]?.stylesSetter?.map(setter => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElement(setter)}
          </Form.Item>
        ))
      }
      <div className='h-[200px] border-[1px] border-[#ccc]'>
        <CssEditor value={css} onChange={handleChange} />
      </div>
    </Form>
  )
}
