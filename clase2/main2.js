var redNodos = function (options) {
    var self = {};

    for (var key in options) {
        self[key] = options[key];
    }

    self.parent_select = "#" + self.parent_id;
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    self.icons = {
        '0': 'ronan.png',
        '1': 'ronan.png',
        '2': 'ronan.png',
        '3': 'ronan.png',
        '4': 'ronan.png',
        '5': 'top_daredevil.png',
        '6': 'top_daredevil.png',
        '7': 'top_daredevil.png',
        '8': 'top_daredevil.png',
        '9': 'top_daredevil.png',
        '10': 'top_daredevil.png',
    };

    self.init = function () {
        self.svg = d3.select(self.parent_select)
            .append('svg')
            .attr('width', self.width)
            .attr('height', self.height);

        self.g = self.svg.append('g');

        self.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("collide", d3.forceCollide().radius(function (d) {
                return 10 + d.group;
            }))
            .force("charge", d3.forceManyBody().strength(-80))
            .force("center", d3.forceCenter(self.width / 2, self.height / 2));

        self.zoom = d3.zoom()
            .on("zoom", function () {
                self.g.attr("transform", d3.event.transform);
            });

        self.svg.call(self.zoom);
    };

    self.prerender = function (graph) {
        var link = self.g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

        var node = self.g.append("g")
            .attr("class", "nodes")
            .selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("svg:image")
            .attr('class', 'node')
            .attr("xlink:href", function (d) {
                return self.icons[d.group];
            })
            .attr("height", function (d) {
                return 2 * (10 + d.group);
            })
            .attr("width", function (d) {
                return 2 * (10 + d.group);
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        self.simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        self.simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("x", function (d) {
                    return d.x - (10 + d.group);
                })
                .attr("y", function (d) {
                    return d.y - (10 + d.group);
                });
        }

        function dragstarted(d) {
            if (!d3.event.active) self.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) self.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    };

    self.render = function () {

    };

    self.init();
    return self;
};

var red_nodos = new redNodos({
    parent_id: 'network',
    width: $(window).width(),
    height: $(window).height()
});

d3.json('data.json', function (error, data) {
    red_nodos.prerender(data);
});