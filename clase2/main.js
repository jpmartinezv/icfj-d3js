var forceLayout = function (options) {
    var self = {};

    for (var key in options) {
        self[key] = options[key];
    }

    self.parent_select = "#" + self.parent_id;
    self.color = d3.scaleOrdinal(d3.schemeCategory20);

    /* Init */
    self.init = function () {
        self.svg = d3.select(self.parent_select)
            .append('svg')
            .attr('width', self.width)
            .attr('height', self.height);

        self.g = self.svg.append('g');

        self.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide()
                .radius(function (d) {
                    return 15 + d.group;
                    // return 7 + 3 * d.group;
                })
                .strength(0.85)
            )
            .force("center", d3.forceCenter(self.width / 2, self.height / 2));
    };

    /* Prerender */
    self.prerender = function (graph) {

        self.link = self.svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

        self.node = self.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", function (d) {
                return 10 + d.group;
                // return 5 + 3 * d.group;
            })
            .attr("fill", function (d) { return self.color(d.group); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        self.node.append("title")
            .text(function (d) { return d.id; });

        self.simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        self.simulation.force("link")
            .links(graph.links);

        function ticked() {
            self.link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            self.node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }
    };

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

    /* Render */
    self.render = function () {
    };

    self.init();
    return self;
};

var force_layout = forceLayout({
    parent_id: 'network',
    width: $(window).width(),
    height: $(window).height()
});

d3.json('data.json', function (err, data) {
    if (err) throw err;
    force_layout.prerender(data);
    force_layout.render();
});