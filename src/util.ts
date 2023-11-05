
const defaultStyleCache = new Map<String, Map<string, string>>();

/**
 * 
 * @param tagName 获取元素的自定义样式
 * @returns 
 */
export const getDafaultStyle = (tagName: string): Map<string, string> => {
  // console.log(tagName);
  if (!defaultStyleCache.has(tagName)) {
    const result = new Map<string, string>();

    const elem =  document.createElement(tagName);
    document.body.appendChild(elem)
    const defaultStyles = window.getComputedStyle(elem, null); // Object.assign({}, window.getComputedStyle(elem, null))
    
    for (let i = 0; i < defaultStyles.length; i++) {
      let cssName = defaultStyles.item(i);
      let val = defaultStyles.getPropertyValue(cssName);
      result.set(cssName, val)
    }

    document.body.removeChild(elem)
    defaultStyleCache.set(tagName, result);
  }
  return defaultStyleCache.get(tagName)!;
};

/**
 * 获取自定义样式（实际样式中和默认样式不一致的）
 * @param defaultStyle 默认样式
 * @param computedStyle 实际样式
 * @returns 自定义样式（实际样式中和默认样式不一致的）
 */
export const getCustomStyle = (
  defaultStyle: Map<string, string>,
  computedStyle: CSSStyleDeclaration
) => {
  const result = new Map<string, string>();

  for (let i = 0; i < computedStyle.length; i++) {
    let cssName = computedStyle.item(i);
    if(cssName.startsWith("-webkit")){
      continue;
    }
    let val = computedStyle.getPropertyValue(cssName);
    if(["auto", "none"].indexOf(val) > -1){
      continue;
    }
    let defaultVal = defaultStyle.get(cssName);
    if(val !== defaultVal){
      result.set(cssName, val);
    }
  }

  return result;
};


export const copyToClipboardAsHtml = async (text: string) => {
  try {
    const blob = new Blob([text], {type: "text/html"});
    await navigator.clipboard.writeText(text);
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": blob
      })
    ])
  } catch (err) {
    console.error("copyToClipboardAsHtml error: ", err);
  }
};



export const copyToClipboardAsText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("copyToClipboardAsText error: ", err);
  }
};