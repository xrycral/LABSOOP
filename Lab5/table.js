class Table {
  constructor(container) {
    this.container = container;
    this.rows = [];
    this.rowElements = [];
    this.selected = -1;
    this.listeners = { select: [], remove: [] };
    this.build();
  }

  build() {
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const title of ['№', 'Тип', 'x1', 'y1', 'x2', 'y2']) {
      const th = document.createElement('th');
      th.textContent = title;
      headRow.appendChild(th);
    }
    head.appendChild(headRow);
    this.body = document.createElement('tbody');
    table.appendChild(head);
    table.appendChild(this.body);

    const scroll = document.createElement('div');
    scroll.className = 'scroll';
    scroll.appendChild(table);

    this.removeButton = document.createElement('button');
    this.removeButton.type = 'button';
    this.removeButton.textContent = 'Вилучити вибраний об’єкт';
    this.removeButton.disabled = true;
    this.removeButton.addEventListener('click', () => this.onRemoveClick());

    this.container.appendChild(scroll);
    this.container.appendChild(this.removeButton);
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  on(event, callback) {
    this.listeners[event].push(callback);
  }

  emit(event, ...args) {
    for (const callback of this.listeners[event]) callback(...args);
  }

  setRows(rows) {
    this.rows = rows;
    this.selected = -1;
    this.removeButton.disabled = true;
    this.body.replaceChildren();
    this.rowElements = rows.map((row, index) => {
      const tr = document.createElement('tr');
      const cells = [index + 1, row.label, row.x1, row.y1, row.x2, row.y2];
      for (const value of cells) {
        const td = document.createElement('td');
        td.textContent = String(value);
        tr.appendChild(td);
      }
      tr.addEventListener('click', () => this.onRowClick(index));
      this.body.appendChild(tr);
      return tr;
    });
  }

  onRowClick(index) {
    this.selected = index;
    this.rowElements.forEach((tr, i) => tr.classList.toggle('selected', i === index));
    this.removeButton.disabled = false;
    this.emit('select', index);
  }

  onRemoveClick() {
    if (this.selected >= 0) this.emit('remove', this.selected);
  }

  onKeyDown(event) {
    if (event.key === 'Delete') this.onRemoveClick();
  }
}