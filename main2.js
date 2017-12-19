var container = d3.select('.main');
var svg = container
    .append('svg')
    .attr('id', 'svg1')
    .attr('width', 1000)
    .attr('height', 800);

svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1000)
    .attr('height', 800)
    .style('fill', 'rgb(165, 165, 165)');

svg
    .append('text')
    .attr('class', 'title')
    .text('Clase D3js')
    .attr('x', 100)
    .attr('y', 100)
    // .style('fill', '#fff')
    .attr('text-anchor', 'middle');

svg
    .append('circle')
    .attr('cx', 500)
    .attr('cy', 600)
    .attr('r', 50)
    .style('fill', 'green');


// svg
//     .append('line')
//     .attr('x1', 300)
//     .attr('y1', 200)
//     .attr('x2', 600)
//     .attr('y2', 400)
//     .style('stroke', 'blue')
//     .style('stroke-width', '3px');


svg
    .append('path')
    .attr('d', 'M20,20Q100,50,200,350Z')
    .style('fill', 'white')
    .style('stroke', 'red')
    .style('stroke-width', '3px');

var array1 = [20, 30, 50, 100, 45];

var scale = d3.scaleLinear().domain([0, 80]).range([0, 200]);
// var color = d3.scaleOrdinal(d3.schemeCategory10);
var color = d3.scaleOrdinal(d3.schemePastel2);

var g = svg.append("g")
    .attr('transform', 'translate(' + [200, 200] + ')');

g
    .selectAll('.bar')
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
    .attr('fill', function (d, i) {
        return color(i);
    })
    .transition()
    .duration(2000)
    .attr('height', function (d) { return scale(d); });

g
    .selectAll('.value')
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
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .transition()
    .duration(2000)
    .attr('y', function (d) { return scale(d) + 15; });


d3.json('data.json', function (data) {
    render(data);
});

function render(data) {
    var array2 = data;
    var g2 = svg.append("g")
        .attr('transform', 'translate(' + [600, 200] + ')');

    var barras = g2.selectAll('.barra')
        .data(array2, function (d) {
            return d.id;
        })
        .enter()
        .append('g')
        .attr('class', 'barra')
        .attr('opacity', 1)
        .attr('transform', function (d, i) {
            return 'translate(' + [50 * i, 0] + ')';
        })
        .on('click', function (d, i) {
            var tooltip = d3.select("#tooltip");
            var coordinates = d3.mouse(svg.node());

            tooltip
                .text(d.value)
                .style('left', coordinates[0] + 'px')
                .style('top', coordinates[1] + 'px')
                .style('display', 'block');
        })
        .on('mouseout', function (d, i) {
            var tooltip = d3.select("#tooltip");
            tooltip
                .style('display', 'none');
        });

    barras
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 30)
        .attr('height', function (d) {
            return d.value;
        })
        .on('click', function (d, i) {
            console.log(d, i);
        })
        ;

    barras
        .append('text')
        .attr('class', 'value')
        .attr('x', 0)
        .attr('y', function (d) {
            return d.value + 15;
        })
        .text(function (d) {
            return d.value;
        })
        ;

    setTimeout(function () {
        array2 = array2.splice(1, 2);
        console.log(array2);

        var n = array2.length;

        barras = g2.selectAll('.barra')
            .data(array2, function (d) {
                return d.id;
            });

        barras
            .transition()
            .duration(500)
            .attr('transform', function (d, i) {
                return 'translate(' + [(200 / n) * i, 0] + ')';
            });

        barras
            .selectAll('rect')
            .transition()
            .duration(500)
            .attr('width', function (d, i) {
                return 0.8 * (200 / n);
            });

        barras.exit()
            .transition()
            .duration(500)
            .attr('opacity', 0)
            .remove();

    }, 2000);
}