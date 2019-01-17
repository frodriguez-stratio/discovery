/* @flow weak */
// import d3 from "d3";
import d3 from "d3";
import dc from "dc";
import moment from "moment";

export const lineAddons = _chart => {
  _chart.fadeDeselectedArea = function() {
    let dots = _chart.chartBodyG().selectAll(".dot");
    let extent = _chart.brush().extent();

    // LinearGradient
    let chart = _chart.chartBodyG().selectAll(".stack-list");

    // set the ranges
    //const x = d3.time.scale().range([0, 1000]);
    const y = d3.scale.linear().range(["100%", 0]);

    // define the line
    //const valueline = d3.svg.line()
    //.x(function(d) { return x(d.date); }) 
    //.y(function(d) { return y(d.close); });

    // Scale the range of the data
    // x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(function(d) { return d.close; })]);

    chart
    .append("svg")
    .append("g")
    chart  
    .append("linearGradient")				
    .attr("id", "line-gradient")			
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", 0)	
    .attr("x2", "100%").attr("y2", "100%")
    .selectAll("stop")						
    .data([								
      {offset: "0%", color: "red"},		
      {offset: "40%", color: "red"},	
      {offset: "40%", color: "black"},		
      {offset: "62%", color: "black"},		
      {offset: "62%", color: "lawngreen"},	
      {offset: "100%", color: "lawngreen"}	
    ])					
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })	
      .attr("stop-color", function(d) { return d.color; });
    _chart.chartBodyG()
          .selectAll(".dc-chart path.line")
          .attr("stroke", "url(#line-gradient)");
    _chart.chartBodyG()          
          .selectAll(".dc-chart path.area")
          .attr("fill", "url(#line-gradient)");


    if (_chart.isOrdinal()) {
      if (_chart.hasFilter()) {
        dots.classed(dc.constants.SELECTED_CLASS, function(d) {
          return _chart.hasFilter(d.x);
        });
        dots.classed(dc.constants.DESELECTED_CLASS, function(d) {
          return !_chart.hasFilter(d.x);
        });
      } else {
        dots.classed(dc.constants.SELECTED_CLASS, false);
        dots.classed(dc.constants.DESELECTED_CLASS, false);
      }
    } else {
      if (!_chart.brushIsEmpty(extent)) {
        let start = extent[0];
        let end = extent[1];
        const isSelected = d => {
          if (moment.isDate(start)) {
            return !(moment(d.x).isBefore(start) || moment(d.x).isAfter(end));
          } else {
            return !(d.x < start || d.x >= end);
          }
        };
        dots.classed(dc.constants.DESELECTED_CLASS, d => !isSelected(d));
        dots.classed(dc.constants.SELECTED_CLASS, d => isSelected(d));

      } else {
        dots.classed(dc.constants.DESELECTED_CLASS, false);
        dots.classed(dc.constants.SELECTED_CLASS, false);
      }
    }
    
  };

  _chart.createGradient = function(svg,id,stops) {

    let svgNS = svg.namespaceURI;
    let grad  = document.createElementNS(svgNS,'linearGradient');
    grad.setAttribute('id',id);
    
    for (let i=0; i<stops.length; i++) {

      let attrs = stops[i];
      let stop = document.createElementNS(svgNS,'stop');

      for (let attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          stop.setAttribute(attr,attrs[attr]);
        }
      }

      grad.appendChild(stop);

    }

  }

  return _chart;
};
