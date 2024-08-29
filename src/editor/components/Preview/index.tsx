import React from "react";
import { useComponentConfigStore } from "../../store/component-config";
import { Component, useComponentsStore } from "../../store/components";
import { message } from "antd";
import { ActionConfig } from "../Setting/actions/ActionModal";

export function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  // 绑定事件
  function handleEvent(component: Component) {
    const props: Record<string, any> = {}

    componentConfig[component.name].events?.forEach(event => {
      const eventConfig = component.props[event.name]

      if(eventConfig) {
        props[event.name] = () => {
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
              const func = new Function('context', action.code)
              func({
                name: component.name,
                props: component.props,
                showMessage(content: string) {
                  message.success(content)
                }
              })
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
