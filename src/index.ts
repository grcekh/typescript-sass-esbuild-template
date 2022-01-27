import { createElement } from "./utils";
import video from "./assets/video/untitled-1.mp4";

import "./styles/index.scss";

function init() {
  const tmp = `
    <div class="container">
      <h1 class="heading">typescript + sass + esbuild</h1>
      <video class="video" src=${video} controls="false" muted="true" autoplay="true" loop="true" crossorigin="anonymous" />
    </div>
  `;
  const el = createElement(tmp);

  const root = document.querySelector("#app");
  root?.appendChild(el);
}

init();
