const SVG_NS = 'http://www.w3.org/2000/svg';
const TOOLTIP_DELAY = 400;

function createIcon(id) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');

  const make = (tag, attrs) => {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
    return el;
  };
  const stroke = { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' };

  if (id === 'point') svg.appendChild(make('circle', { cx: 12, cy: 12, r: 3, fill: 'currentColor' }));
  if (id === 'line') svg.appendChild(make('line', { x1: 4, y1: 20, x2: 20, y2: 4, ...stroke }));
  if (id === 'rect') svg.appendChild(make('rect', { x: 4, y: 6, width: 16, height: 12, ...stroke }));
  if (id === 'ellipse') svg.appendChild(make('ellipse', { cx: 12, cy: 12, rx: 8, ry: 5.5, ...stroke }));
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
      button.setAttribute('aria-label', item.tooltip);
      button.appendChild(createIcon(item.id));
      button.addEventListener('click', () => this.onClick(item.id));
      button.addEventListener('mouseenter', () => this.onMouseEnter(button, item.tooltip));
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