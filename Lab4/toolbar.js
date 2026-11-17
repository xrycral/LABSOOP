const SVG_NS = 'http://www.w3.org/2000/svg';
const TOOLTIP_DELAY = 400;

function createIcon(iconParts) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');

  const defaults = { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6' };
  for (const [tag, attrs] of iconParts) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries({ ...defaults, ...attrs })) {
      el.setAttribute(name, value);
    }
    svg.appendChild(el);
  }
  return svg;
}

class Toolbar {
  constructor(container, items, onSelect) {
    this.container = container;
    this.items = items;
    this.onSelect = onSelect;
    this.buttons = new Map();
    this.timer = null;

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.hidden = true;
    document.body.appendChild(this.tooltip);

    this.render();
  }

  render() {
    for (const item of this.items) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', item.label);
      button.appendChild(createIcon(item.icon));
      button.addEventListener('click', () => this.onClick(item.id));
      button.addEventListener('mouseenter', () => this.onMouseEnter(button, item.label));
      button.addEventListener('mouseleave', () => this.onMouseLeave());
      this.container.appendChild(button);
      this.buttons.set(item.id, button);
    }
  }

  onClick(id) {
    this.hideTooltip();
    this.onSelect(id);
  }

  onMouseEnter(button, text) {
    this.hideTooltip();
    this.timer = setTimeout(() => this.showTooltip(button, text), TOOLTIP_DELAY);
  }

  onMouseLeave() {
    this.hideTooltip();
  }

  showTooltip(button, text) {
    const rect = button.getBoundingClientRect();
    this.tooltip.textContent = text;
    this.tooltip.style.left = rect.left + 'px';
    this.tooltip.style.top = rect.bottom + 6 + 'px';
    this.tooltip.hidden = false;
  }

  hideTooltip() {
    clearTimeout(this.timer);
    this.timer = null;
    this.tooltip.hidden = true;
  }

  setActive(id) {
    for (const [itemId, button] of this.buttons) {
      const active = itemId === id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }
}