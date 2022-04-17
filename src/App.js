import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { scaleOrdinal, scaleLinear, format, extent } from "d3";
import ReactDropdown from "react-dropdown";
import useData from "./useData";
import AxisBottom from "./AxisBottom";
import AxisLeft from "./AxisLeft";
import Marks from "./Marks";
import ColorLegend from "./ColorLegend";

const width = 1300;
const height = 500;
const margin = { top: 20, right: 200, bottom: 65, left: 90 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 45;

const labelFormat = (str) => {
  let arr = str.split("_");

  arr = arr.map((x) => x.charAt(0).toUpperCase() + x.slice(1));

  return arr.join(" ");
};

const App = () => {
  const data = useData();
  const [hoveredValue, setHoveredValue] = useState(null);

  const [xAttribute, setXAttribute] = useState("petal_length");

  const xValue = (d) => d[xAttribute];
  const xAxisLabel = labelFormat(xAttribute);

  const [yAttribute, setYAttribute] = useState("sepal_width");

  const yValue = (d) => d[yAttribute];
  const yAxisLabel = labelFormat(yAttribute);

  const circleRadius = 7;

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const attributes = [
    { value: "sepal_length", label: "Sepal Length" },
    { value: "sepal_width", label: "Sepal Width" },
    { value: "petal_length", label: "Petal Length" },
    { value: "petal_width", label: "Petal Width" },
  ];

  const colorValue = (d) => d.species;
  const colorLegendLabel = "Species";
  const filteredData = data.filter((d) => hoveredValue === colorValue(d));

  const siFormat = format(".2s");
  const xAxisTickFormat = (tickValue) => siFormat(tickValue).replace("G", "B");

  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([0, innerHeight])
    .nice();

  const colorScale = scaleOrdinal()
    .domain(data.map(colorValue))
    .range(["#E6842A", "#137880", "#8E6C8A"]);

  return (
    <>
      <div className="menu-container">
        <span className="dropdown-label">X </span>
        <ReactDropdown
          options={attributes}
          value={xAttribute}
          onChange={({ value }) => setXAttribute(value)}
        />

        <span className="dropdown-label">Y </span>
        <ReactDropdown
          options={attributes}
          value={yAttribute}
          onChange={({ value }) => setYAttribute(value)}
        />
      </div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={xAxisTickFormat}
            tickOffset={5}
          />
          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisLabelOffset},${
              innerHeight / 2
            }) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={5} />
          <text
            className="axis-label"
            x={innerWidth / 2}
            y={innerHeight + xAxisLabelOffset}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
          <g transform={`translate(${innerWidth + 60}, ${innerHeight / 2})`}>
            <text x={35} y={-25} className="axis-label" textAnchor="middle">
              {colorLegendLabel}
            </text>
            <ColorLegend
              onHover={setHoveredValue}
              colorScale={colorScale}
              tickSize={circleRadius}
              hoveredValue={hoveredValue}
            />
          </g>
          <g opacity={hoveredValue ? 0.2 : 1}>
            <Marks
              data={data}
              xScale={xScale}
              yScale={yScale}
              colorScale={colorScale}
              xValue={xValue}
              yValue={yValue}
              colorValue={colorValue}
              tooltipFormat={xAxisTickFormat}
              circleRadius={circleRadius}
            />
          </g>
          <Marks
            data={filteredData}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            xValue={xValue}
            yValue={yValue}
            colorValue={colorValue}
            tooltipFormat={xAxisTickFormat}
            circleRadius={circleRadius}
          />
        </g>
      </svg>
    </>
  );
};

export default App;
