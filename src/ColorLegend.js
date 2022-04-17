import React from "react";

const ColorLegend = ({
  colorScale,
  tickSpacing = 20,
  tickSize = 10,
  tickTextOffset = 20,
  onHover,
  hoveredValue,
}) =>
  colorScale.domain().map((value, i) => (
    <g
      cursor="default"
      key={value}
      transform={`translate(0, ${i * tickSpacing})`}
      opacity={hoveredValue && value !== hoveredValue && 0.2}
      onMouseEnter={() => onHover(value)}
      onMouseOut={() => onHover(null)}
    >
      <circle fill={colorScale(value)} r={tickSize} />
      <text dy=".32em" x={tickTextOffset} fill={colorScale(value)}>
        {value}
      </text>
    </g>
  ));
export default ColorLegend;
