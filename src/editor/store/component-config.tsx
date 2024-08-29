import { create } from "zustand"
import ContainerDev from "../materials/Container/dev"
import ContainerProd from "../materials/Container/prod"
import ButtonDev from "../materials/Button/dev"
import ButtonProd from "../materials/Button/prod"
import PageDev from "../materials/Page/dev"
import PageProd from "../materials/Page/prod"
import ModalDev from "../materials/Modal/dev"
import ModalProd from "../materials/Modal/prod"
import TableDev from "../materials/Table/dev"
import TableProd from "../materials/Table/prod"
import TableColumnDev from "../materials/TableColumn/dev"
import TableColumnProd from "../materials/TableColumn/prod"

export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}

export interface ComponentEvent {
  name: string
  label: string
}

export interface ComponentMethod {
  name: string
  label: string
}

export interface ComponentConfig {
  name: string
  defaultProps: Record<string, any>
  desc: string
  // 组件的表单设置
  setter?: ComponentSetter[]
  // 样式设置
  stylesSetter?: ComponentSetter[]
  // 事件绑定
  events?: ComponentEvent[]
  // 组件方法
  methods?: ComponentMethod[]
  // component: any
  dev: any // 编辑模式
  prod: any // 预览模式
}

interface State {
  componentConfig: { [key: string]: ComponentConfig }
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>(set => {
  return {
    componentConfig: {
      Modal: {
        name: 'Modal',
        desc: '弹窗',
        defaultProps: {
          title: '弹窗'
        },
        setter: [
          {
            name: 'title',
            label: '标题',
            type: 'input'
          }
        ],
        events: [
          {
            name: 'onOk',
            label: '确认事件'
          },
          {
            name: 'onCancel',
            label: '取消事件'
          }
        ],
        methods: [
          {
            name: 'open',
            label: '打开弹窗'
          },
          {
            name: 'close',
            label: '关闭弹窗'
          }
        ],
        dev: ModalDev,
        prod: ModalProd
      },
      Container: {
        name: 'Container',
        defaultProps: {},
        desc: '容器',
        dev: ContainerDev,
        prod: ContainerProd
      },
      Button: {
        name: 'Button',
        defaultProps: {
          type: 'primary',
          text: '按钮'
        },
        desc: '按钮',
        setter: [
          {
            name: 'type',
            label: '按钮类型',
            type: 'select',
            options: [
              {label: '主按钮', value: 'primary'},
              {label: '次按钮', value: 'default'},
            ],
          },
          {
            name: 'text',
            label: '文本',
            type: 'input',
          }
        ],
        stylesSetter: [
          {
            name: 'width',
            label: '宽度',
            type: 'inputNumber',
          },
          {
            name: 'height',
            label: '高度',
            type: 'inputNumber',
          }
        ],
        events: [
          {
            name: 'onClick',
            label: '点击事件'
          },
          {
            name: 'onDoubleClick',
            label: '双击事件'
          }
        ],
        dev: ButtonDev,
        prod: ButtonProd
      },
      Table: {
        name: 'Table',
        defaultProps: {},
        desc: '表格',
        setter: [
          {
            name: 'url',
            label: 'url',
            type: 'input'
          }
        ],
        dev: TableDev,
        prod: TableProd
      },
      TableColumn: {
        name: 'TableColumn',
        desc: '表格列',
        defaultProps: {
          title: '列名',
          dataIndex: `col_${new Date().getTime()}`
        },
        setter: [
          {
            name: 'type',
            label: '类型',
            type: 'select',
            options: [
              {
                label: '文本',
                value: 'text'
              },
              {
                label: '日期',
                value: 'date'
              }
            ]
          },
          {
            name: 'title',
            label: '标题',
            type: 'input'
          },
          {
            name: 'dataIndex',
            label: '字段',
            type: 'input'
          }
        ],
        dev: TableColumnDev,
        prod: TableColumnProd
      },
      Page: {
        name: 'Page',
        defaultProps: {},
        desc: '页面',
        dev: PageDev,
        prod: PageProd
      }
    },
    registerComponent: (name, componentConfig) => set(state => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig
        }
      }
    })
  }
})
