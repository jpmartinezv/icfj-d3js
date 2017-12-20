var container = d3.select('.main');
var options = {
    'width': 1000,
    'height': 500,
};

var svg = container
    .append('svg')
    .attr('id', 'svg-id')
    .attr('width', options.width)
    .attr('height', options.height);

svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', options.width)
    .attr('height', options.height)
    .style('fill', 'rgb(165, 165, 165)');

svg
    .append('text')
    .attr('class', 'title')
    .text('Clase D3js')
    .attr('x', options.width / 2)
    .attr('y', 50)
    .style('fill', '#fff')
    .attr('text-anchor', 'middle');

svg
    .append('circle')
    .attr('cx', options.width / 5)
    .attr('cy', 3 * options.height / 4)
    .attr('r', 50)
    .style('fill', 'green');

svg
    .append('line')
    .attr('x1', 300)
    .attr('y1', 200)
    .attr('x2', 600)
    .attr('y2', 400)
    .style('stroke', 'blue')
    .style('stroke-width', '3px');

svg
    .append('path')
    .attr('d', 'M20,20L100,50')
    .style('fill', 'transparent')
    .style('stroke', 'red')
    .style('stroke-width', '3px');

svg
    .append('path')
    .attr('d', 'M200,200L250,250L50,200Z')
    .style('fill', 'transparent')
    .style('stroke', 'black')
    .style('stroke-width', '3px');

var array1 = [20, 30, 50, 80];

var g_bars = svg
    .append('g')
    .attr('transform', 'translate(' + [options.width / 2, 150] + ')');

var bars = g_bars.selectAll('.bar')
    .data(array1)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d, i) {
        return i * 50;
    })
    .attr('y', 0)
    .attr('width', 30)
    .attr('height', 0)
    .style('fill', '#111')
    .transition()
    .duration(1000)
    .attr('height', function (d, i) {
        return d;
    });

var values = g_bars.selectAll('.value')
    .data(array1)
    .enter()
    .append('text')
    .text(function (d) {
        return d;
    })
    .attr('class', 'value')
    .attr('x', function (d, i) {
        return i * 50 + 15;
    })
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('fill', '#111')
    .transition()
    .duration(1000)
    .attr('y', function (d, i) {
        return d + 20;
    });

// G Group

var array2 = [{ id: 1, value: 40 }, { id: 2, value: 80 }, { id: 3, value: 20 }, { id: 4, value: 30 }];

var scale_x = d3.scaleLinear().range([0, 200]).domain([0, 80]);
var color = d3.scaleOrdinal(d3.schemeCategory10);
// // var color = d3.scaleOrdinal(d3.schemePastel2);
// var color = d3.scaleSequential(d3.interpolateMagma).domain([0, 80]);

var g_bars2 = svg
    .append('g')
    .attr('transform', 'translate(' + [3 * options.width / 4, 250] + ')');

var bars2 = g_bars2.selectAll('.g-bar')
    .data(array2, function (d) {
        return d.id;
    })
    .enter()
    .append('g')
    .attr('class', 'g-bar')
    .attr('transform', function (d, i) {
        return 'translate(' + (i * 50) + ',' + 0 + ')';
    })
    .attr('opacity', 1);

bars2
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 30)
    .attr('height', 0)
    .style('fill', function (d, i) {
        return color(i);
        // return color(d.value);
    })
    .transition()
    .duration(1000)
    .attr('height', function (d, i) {
        return scale_x(d.value);
    });

bars2
    .append('text')
    .text(function (d) {
        return d.value;
    })
    .attr('class', 'value')
    .attr('x', function (d, i) {
        return 15;
    })
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('fill', '#111')
    .transition()
    .duration(1000)
    .attr('y', function (d, i) {
        return scale_x(d.value) + 20;
    });

setTimeout(function () {
    var bars2 = g_bars2.selectAll('.g-bar')
        .data(array2.splice(1, 2), function (d) {
            return d.id;
        });

    bars2
        .transition()
        .duration(500)
        .attr('transform', function (d, i) {
            return 'translate(' + (i * 50) + ',' + 0 + ')';
        });

    bars2.exit()
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .remove();
}, 2000);

bars2
    .on('mousemove', function (d, i) {
        var coordinates = d3.mouse(svg.node());

        var tooltip = d3.select('.tooltip');

        tooltip
            .text('tooltip')
            .style('left', coordinates[0] + 'px')
            .style('top', coordinates[1] + 'px')
            .style('display', 'block');
    })
    .on('mouseout', function () {
        var tooltip = d3.select('.tooltip');
        tooltip
            .style('display', 'none');
    });