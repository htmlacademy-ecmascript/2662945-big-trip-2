const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

function render(component, container, place = RenderPosition.BEFOREEND) {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.element);
      break;

    case RenderPosition.BEFOREEND:
    default:
      container.append(component.element);
      break;
  }
}

export { RenderPosition, render };
