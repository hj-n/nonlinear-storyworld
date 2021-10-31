import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import testData from "./json/test.json";
import ManageData from "../functions/ManageData";

const Narrative = (props) => {

  const svgRef = useRef(null);
  const md = new ManageData(testData);

  useEffect(() => {

    // data preparation
    md.parse();
    md.setDrawData();
    const [drawData, xMax, yMax] = md.getDrawData();

    console.log(drawData, xMax, yMax);


    // svg preparation
    const scale = d3.scaleLinear().domain([0, xMax]).range([0, props.size]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.select(svgRef.current)
      .attr("width", props.size + props.margin * 2)
      .attr("height", scale(yMax) + props.margin * 2);

    const g = d3.select(svgRef.current)
                .append("g")
                .attr("transform", `translate(${props.margin}, ${props.margin})`);


    // rendering
    const storylines = g.selectAll(".storyline")
                        .data(drawData)
                        .enter()
                        .append("g")
                        .attr("class", "storyline")
                        .attr("transform", (_, i) => `translate(0, ${3 * i})`)
                        .style("stroke", (_, i) => color(i))
                        .style("opacity", 0.5)
                        .style("stroke-width", props.stroke)
                        .style("stroke-linecap", "round");

    storylines.selectAll("line")
              .data(d => d.seq)
              .enter()
              .append("line")
              .attr("x1", d => scale(d[0][0]))
              .attr("x2", d => scale(d[0][1]))
              .attr("y1", d => scale(d[1][0]))
              .attr("y2", d => scale(d[1][1]))
              .on("mouseover", function() {
     
                d3.select(this.parentNode)
                  .style("stroke-width", props.stroke * 1.5)
                  .style("opacity", 0.8);
              })
              .on("mouseout", function() {
                d3.select(this.parentNode)
                  .style("stroke-width", props.stroke)
                  .style("opacity", 0.5)
              })
              .on("click", function() {
                const name = d3.select(this.parentNode).data()[0].name;
                updateStorylines(name);
              })

    function updateStorylines(name) {
      md.changeMainIdx(name);
      md.setDrawData();
      const [drawData, xMax, yMax] = md.getDrawData();

      console.log(drawData)

      const scale = d3.scaleLinear().domain([0, xMax]).range([0, props.size]);

      d3.select(svgRef.current)
        .transition()
        .duration(1500)
        .attr("height", scale(yMax) + props.margin * 2);
      
      const storylines = g.selectAll(".storyline")
                          .data(drawData);

      storylines.selectAll("line")
                .data(d => d.seq)
                .join(
                  enter => {},
                  update => {
                    update.transition()
                          .duration(1500)
                          .attr("x1", d => scale(d[0][0]))
                          .attr("x2", d => scale(d[0][1]))
                          .attr("y1", d => scale(d[1][0]))
                          .attr("y2", d => scale(d[1][1]))
                  },
                  exit => {}
                );
    }

  });


 
  return (
    <div>
      <svg ref={svgRef} />
    </div>
  )
}

export default Narrative;