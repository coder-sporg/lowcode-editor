import { useEffect } from "react"
import { useComponentsStore } from "../store/components"

export function EditArea() {
  const { components, addComponent, deleteComponent, updateComponent } = useComponentsStore()

  useEffect(() => {
    addComponent({
      id: 222,
      name: 'Container',
      props: {},
      children: []
    }, 1)

    addComponent({
      id: 333,
      name: 'Container',
      props: {},
      children: []
    }, 222)

    setTimeout(() => {
      deleteComponent(333)
    }, 3000);

    setTimeout(() => {
      updateComponent(222, {
        title: '222的标题'
      })
    }, 5000);
  }, [])

  return <div>
    <pre>
      {
        JSON.stringify(components, null, 2)
      }
    </pre>
  </div>
}
