export function createElement(html: string): Node {
  const template = document.createElement("template");
  template.innerHTML = html.trim();

  return template.content.firstChild as Node;
}
