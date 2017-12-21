var myMap = function (options) {
    var self = {};

    for (var key in options) {
        self[key] = options[key];
    }

    self.parent_select = "#" + self.parent_id;
    self.color = d3.scaleOrdinal(d3.schemeCategory20);

    self.projection = d3.geoMercator()
        .scale(1700)
        .center([-74.063644, 4.624335])
        .translate([self.width / 2, self.height / 2]);

    /* Init */
    self.init = function () {
        self.svg = d3.select(self.parent_select)
            .append('svg')
            .attr('width', self.width)
            .attr('height', self.height);

        self.bg = self.svg.append('g');
        self.g = self.svg.append('g');

        self.path = d3.geoPath(self.projection);
        self.zoom = d3.zoom()
            .on("zoom", function () {
                self.g.attr("transform", d3.event.transform);
            });

        self.svg.call(self.zoom);
    };

    /* Prerender */
    self.prerender = function (topology) {
        var geojson = topojson.feature(topology, topology.objects.COL_adm1);

        self.g.selectAll("path")
            .data(geojson.features)
            .enter().append("path")
            .attr("d", self.path)
            .attr('fill', '#111')
            .on('mouseover', function (d, i) {
                var el = d3.select(this);
                el
                    .transition()
                    .duration(150)
                    .attr('fill', 'red');
            })
            .on('mousemove', function (d, i) {
                var tooltip = d3.select('.tooltip');
                var coordinates = d3.mouse(self.svg.node());

                tooltip
                    .text(d.properties.NAME_1)
                    .style('left', coordinates[0] + 'px')
                    .style('top', coordinates[1] + 'px')
                    .style('display', 'block');
            })
            .on('mouseout', function (d, i) {
                var el = d3.select(this);
                el
                    .transition()
                    .duration(150)
                    .attr('fill', '#111');

                d3.select("#tooltip").style('display', 'none');
            });

        self.bg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', self.width)
            .attr('height', self.height)
            .attr('fill', '#ddd');
    };

    /* Render */
    self.render = function () {
    };

    self.init();
    return self;
};

var my_map = myMap({
    parent_id: 'map',
    width: $(window).width(),
    height: $(window).height()
});

d3.json('colombia-departments.json', function (err, data) {
    if (err) throw err;
    my_map.prerender(data);
    my_map.render();
});