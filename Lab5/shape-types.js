const SHAPE_TYPES = [
  { id: 'point', label: 'Крапка',
    icon: [['circle', { cx: 12, cy: 12, r: 3, fill: 'currentColor', stroke: 'none' }]] },
  { id: 'line', label: 'Лінія',
    icon: [['line', { x1: 4, y1: 20, x2: 20, y2: 4 }]] },
  { id: 'rect', label: 'Прямокутник',
    icon: [['rect', { x: 4, y: 6, width: 16, height: 12 }]] },
  { id: 'ellipse', label: 'Еліпс',
    icon: [['ellipse', { cx: 12, cy: 12, rx: 8, ry: 5.5 }]] },
  { id: 'lineo', label: 'Лінія з кружечками',
    icon: [
      ['line', { x1: 7, y1: 17, x2: 17, y2: 7 }],
      ['circle', { cx: 6, cy: 18, r: 2.8 }],
      ['circle', { cx: 18, cy: 6, r: 2.8 }]
    ] },
  { id: 'cube', label: 'Каркас куба',
    icon: [
      ['rect', { x: 3.5, y: 9.5, width: 11, height: 11 }],
      ['rect', { x: 9.5, y: 3.5, width: 11, height: 11 }],
      ['line', { x1: 3.5, y1: 9.5, x2: 9.5, y2: 3.5 }],
      ['line', { x1: 14.5, y1: 9.5, x2: 20.5, y2: 3.5 }],
      ['line', { x1: 3.5, y1: 20.5, x2: 9.5, y2: 14.5 }],
      ['line', { x1: 14.5, y1: 20.5, x2: 20.5, y2: 14.5 }]
    ] }
];
if (typeof module !== 'undefined') module.exports = { SHAPE_TYPES };