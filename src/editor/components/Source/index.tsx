import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { useComponentsStore } from "../../store/components";

export function Source() {
  const { components } = useComponentsStore();

  const handleEditorMount: OnMount = (editor, monaco) => {
    // 格式化代码 快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };

  return (
    <MonacoEditor
      height={"100%"}
      path="components.json"
      language="json"
      onMount={handleEditorMount}
      value={JSON.stringify(components, null, 2)}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        automaticLayout: true, // 自动布局
        readOnly: true, // 只读
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
}
