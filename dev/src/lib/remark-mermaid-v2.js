import { visit } from "unist-util-visit";
import mermaid from "mermaid";

// export interface RemarkMermaidOptions {
//   theme?: mermaidAPI.Theme;
// }

async function Mermaid(theme, instances) {
  const diag = instances.map((ins) => {
    const code = ins[0];
    const id = "mermaid" + Math.random().toString(36).slice(2);
    console.log(code);
    mermaid.initialize({ theme: theme });
    const div = document.createElement("div");
    const diagram = mermaid.render(id, code).then((value) => {
      return value;
    });
    div.innerHTML = `<div>${diagram}</div>`;
    return div.innerHTML;
  });
  const results = await Promise.all(diag);
  return results;
}

const remarkMermaid = function remarkMermaid({ theme = "default" } = {}) {
  return (ast) => {
    const instances = [];
    console.log(instances);

    // find all instances of md code blocks with mermaid language tag in abstract syntax tree
    visit(ast, { type: "code", lang: "mermaid" }, (node, index, parent) => {
      instances.push([node.value, index, parent]);
    });

    // if no mermaid tag return the original abstract syntax tree
    if (!instances.length) {
      return ast;
    }

    const results = instances.map((ins) => {
      const div = document.createElement("div");
      try {
        const code = ins[0];
        const id = "mermaid" + Math.random().toString(36).slice(2);
        console.log(code);
        mermaid.initialize({ theme: theme });
        const diagram = mermaid.render(id, code);
        div.innerHTML = `<div>${diagram}</div>`;
        return div.innerHTML;
      } catch {
        div.innerHTML = ``;
        return div.innerHTML;
      }
    });
    // const results = Mermaid(theme,instances)
    instances.forEach(([, index, parent], i) => {
      let value = results[i];
      console.log(parent);
      parent.children.splice(index, 1, {
        type: "html",
        value,
      });
    });
  };
};

export default remarkMermaid;
