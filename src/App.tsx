// import { createSignal } from 'solid-js'
// import solidLogo from './assets/solid.svg'
// import viteLogo from '/vite.svg'
import { createSignal, createEffect } from "solid-js";
import Prism from "prismjs";
import "./App.css";
import SearchSelect from "./SearchSelect";
import {
  getDafaultStyle,
  getCustomStyle,
  copyToClipboardAsHtml,
  copyToClipboardAsText,
} from "./util";
import languages from "./languages";

const renderCode = (code: string, lang: string) => {
  let html = "";
  if (code) {
    const languageMap = Prism.languages as Prism.LanguageMap;
    html = Prism.highlight(code, languageMap[lang], lang);
  }
  return html;
};

//#endregion copy event
const copyClassStyles = (element: HTMLElement) => {
  const html = element.innerHTML;

  // var result = juice(element)
  // 遍历元素
  traverseAndPrintTags(element.children[0]);
  //将元素的innerHTML复制到剪切板中
  copyToClipboardAsHtml(element.innerHTML);

  element.innerHTML = html;
};

const calcStyle = (element: HTMLElement) => {
  if (!element) {
    return;
  }
  // 当前元素实际样式
  const computedStyle = getComputedStyle(element);
  // 当前元素默认样式
  const defaultStyle = getDafaultStyle(element.tagName);

  const customStyles: Map<string, string> = getCustomStyle(
    defaultStyle,
    computedStyle
  );
  let cssText = "";
  for (let [key, value] of customStyles) {
    cssText += `${key}: ${value};`;
  }

  element.style.cssText = cssText;
};

const traverseAndPrintTags = (element: Element) => {
  calcStyle(element as HTMLElement);

  const children = element.children;
  for (let i = 0; i < children.length; i++) {
    traverseAndPrintTags(children[i]); // 递归调用以处理子元素
  }
};
//#endregion

const mdCode = "```";
function App() {
  let ref: HTMLDivElement | undefined = undefined;
  const [getHtml, setHtml] = createSignal("");
  const [getCode, setCode] = createSignal("");
  const [getLang, setLang] = createSignal(languages.defaultLanguage);

  createEffect(() => {
    const html = renderCode(getCode(), getLang());
    setHtml(html);
  });

  const onCopy = () => {
    const code = getCode();
    copyToClipboardAsText(code)
      .then(() => {
        alert("copyToClipboard success");
      })
      .catch(() => {
        alert("copyToClipboard failed!");
      });
  };

  const onCopyAsMd = () => {
    const code = getCode();
    const lang = getLang();
    const str = `${mdCode}${lang}\n${code}\n${mdCode}`;
    copyToClipboardAsText(str)
      .then(() => {
        alert("copyToClipboard success");
      })
      .catch(() => {
        alert("copyToClipboard failed!");
      });
  };

  const onCopyClick = () => {
    if (ref) {
      copyClassStyles(ref);
    }
  };

  return (
    <>
      <div class="tools">
        <div class="float-left">
          <SearchSelect
            onClick={(item) => {
              setLang(item.value);
            }}
          />
        </div>
        <div class="float-right">
          <div
            class="btn-group btn-group-narrow"
            role="group"
            style={{
              "margin-right": "0.5rem",
            }}
          >
            <button
              type="button"
              class="btn btn-outline-default"
              onClick={onCopyAsMd}
            >
              Copy Source As Md
            </button>
            <button
              type="button"
              class="btn btn-outline-default"
              onClick={onCopy}
            >
              Copy Source
            </button>
          </div>

          <div class="btn-group" role="group">
            <button type="button" class="btn btn-primary" onClick={onCopyClick}>
              copy
            </button>
          </div>
        </div>
      </div>
      <div class="code-container">
        <div class="editor">
          <textarea
            onInput={(e) => {
              setCode(e.target.value);
            }}
          ></textarea>
        </div>
        <div ref={ref} class="preview">
          <section>
            <pre class="language-css">
              <code innerHTML={getHtml()}></code>
            </pre>
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
