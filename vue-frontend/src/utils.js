import { useElementVisibility } from "@vueuse/core";

export function elementInViewPort(refs) {
  var element;
  Object.keys(refs).forEach((key) => {
    if (refs[key].length > 0) {
      refs[key].forEach((ref, index) => {
        if (useElementVisibility(refs[key][index]).value) {
          element = index;
          return;
        }
      });
    } else {
      if (useElementVisibility(refs[key]).value) {
        element = key;
        return;
      }
    }
  });
  return element;
}

export function handleAnimationOnScroll(data) {
  if (data) {
    let { top, bottom } = data.name.getBoundingClientRect();
    let height = document.documentElement.clientHeight;

    if (top < height && bottom > 0) {
      data.name.classList.add(data.animation);
    }
  }
}
