import React, { useRef } from "react";
import { useComponentConfigStore } from "../../store/component-config";
import { Component, useComponentsStore } from "../../store/components";
import { message } from "antd";
import { ActionConfig } from "../Setting/ActionModal";

export function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const componentRefs = useRef<Record<string, any>>({})

  // 绑定事件
  function handleEvent(component: Component) {
    const props: Record<string, any> = {}

    componentConfig[component.name].events?.forEach(event => {
      const eventConfig = component.props[event.name]

      if(eventConfig) {
        props[event.name] = (...args: any[]) => {
          eventConfig?.actions?.forEach((action: ActionConfig) => {
            if(action.type === 'goToLink' && action.url) {
              // window.location.href = action.url
              window.open(action.url)
            } else if(action.type === 'showMessage' && action.config) {
              if(action.config.type === 'success') {
                message.success(action.config.text)
              } else if(action.config.type === 'error') {
                message.error(action.config.text)
              }
            } else if(action.type === 'customJS' && action.code) {
              // new Function() 第一个是参数名字，最后一个是函数体
              const func = new Function('context', 'args', action.code)
              func({
                name: component.name,
                props: component.props,
                showMessage(content: string) {
                  message.success(content)
                }
              }, args) // 支持传入额外参数
            } else if(action.type === 'componentMethod') {
              const component = componentRefs.current[action.config.componentId]

              if(component) {
                component[action.config.method]?.(...args)
              }
            }
          })
        }
      }
    })

    return props
  }

  // 渲染组件
  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.prod) {
        return null;
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          // 使用了froward的组件才给ref属性
          ref: config.prod?.$$typeof === Symbol.for('react.forward_ref') ?
                (ref: Record<string, any>) => { componentRefs.current[component.id] = ref; } : undefined,
          ...config.defaultProps,
          ...component.props,
          // 绑定事件
          ...handleEvent(component)
        },
        renderComponents(component.children || [])
      );
    });
  }

  return <div>{renderComponents(components)}</div>;
}
