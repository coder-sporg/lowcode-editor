import { create } from "zustand"

export interface Component {
  id: number
  name: string
  props: any
  desc: string
  children?: Component[]
  parentId?: number
}

interface State {
  components: Component[]
  curComponentId?: null | number
  curComponent: Component | null
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void
  deleteComponent: (componentId: number) => void
  updateComponent: (componentId: number, props: any) => void
  setCurComponentId: (componentId: number | null) => void
}

export const useComponentsStore = create<State & Action>(
  ((set, get) => ({
    components: [
      {
        id: 1,
        name: 'Page',
        props: {},
        desc: '页面'
      }
    ],
    curComponentId: null,
    curComponent: null,
    setCurComponentId: (componentId) => set(state => {
      return {
        curComponentId: componentId,
        curComponent: getComponentById(state.components, componentId)
      }
    }),
    addComponent: (component, parentId) => set((state) => {
      // console.log("🚀 ~ addComponent: ~ state:", state) // get() === state
      if(parentId) {
        const parentComponent = getComponentById(state.components, parentId)

        if(parentComponent) {
          if(parentComponent.children) {
            parentComponent.children.push(component)
          } else {
            parentComponent.children = [component]
          }
        }
        component.parentId = parentId
        return {
          components: [...state.components]
        }
      }
      return {
        components: [...state.components, component]
      }
    }),
    // set 来写，比下面的稍微麻烦
    // deleteComponent: (componentId) => set((state) => {
    //   if(!componentId) return { components: state.components }

    //   const component = getComponentById(state.components, componentId)
    //   if(component?.parentId) {
    //     const parentComponent = getComponentById(state.components, component.parentId)

    //     if(parentComponent) {
    //       parentComponent.children = parentComponent.children?.filter(item => item.id !== componentId)
    //       return { components: state.components }
    //     }
    //   }
    //   return { components: get().components }
    // }),
    deleteComponent: (componentId) => {
      if(!componentId) return

      const component = getComponentById(get().components, componentId)

      if(component?.parentId) {
        const parentComponent = getComponentById(get().components, component.parentId)

        if(parentComponent) {
          parentComponent.children = parentComponent.children?.filter(item => item.id !== +componentId)

          set({
            components: [...get().components]
          })
        }
      }
    },
    updateComponent: (componentId, props) => set((state) => {
      const component = getComponentById(state.components, componentId)

      if(component) {
        component.props = { ...component.props, ...props }

        return { components: [...state.components] }
      }

      return { components: [...state.components] }
    })
  }))
)

export function getComponentById(components: Component[], id: number | null): Component | null {
  if(!id) return null
  for(const component of components) {
    if(component.id === id) return component
    if(component.children && component.children.length > 0) {
      const result = getComponentById(component.children, id)
      if(result) return result
    }
  }
  return null
}
