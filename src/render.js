const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function render(component, container, place = RenderPosition.BEFOREEND) {
  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.before(component.element);
      break;

    case RenderPosition.AFTERBEGIN:
      container.prepend(component.element);
      break;

    case RenderPosition.BEFOREEND:
      container.append(component.element);
      break;

    case RenderPosition.AFTEREND:
      container.after(component.element);
      break;
  }
}

export { RenderPosition, render };

