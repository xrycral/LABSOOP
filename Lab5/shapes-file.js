function serializeShapes(rows) {
  const lines = rows.map((row) => [row.type, row.x1, row.y1, row.x2, row.y2].join(' '));
  return lines.length ? lines.join('\n') + '\n' : '';
}

function parseShapes(text, allowedTypes) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 5) continue;
    const [type, ...numbers] = parts;
    if (!allowedTypes.includes(type)) continue;
    const [x1, y1, x2, y2] = numbers.map(Number);
    if (![x1, y1, x2, y2].every(Number.isFinite)) continue;
    rows.push({ type, x1, y1, x2, y2 });
  }
  return rows;
}

module.exports = { serializeShapes, parseShapes };