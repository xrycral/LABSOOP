class TableApp {
  constructor() {
    this.table = new Table(document.getElementById('table-container'));
    this.table.on('select', (index) => this.onSelect(index));
    this.table.on('remove', (index) => this.onRemove(index));
    window.tableApi.onRows((rows) => this.onRows(rows));
  }

  onRows(rows) {
    this.table.setRows(rows);
  }

  onSelect(index) {
    window.tableApi.select(index);
  }

  onRemove(index) {
    window.tableApi.remove(index);
  }
}

new TableApp();