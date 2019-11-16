import React, { Component } from 'react';
import floor from "./Paths2.svg";
import ReactSVG from 'react-svg';

class FloorRenderer extends React.Component {
    render() {
        return (
            <div style={{width: "192px", height: "108px"}}>
                <ReactSVG src={floor}
                          beforeInjection={svg => {
                              svg.classList.add('svg-class-name')
                              svg.setAttribute('width', '');
                              svg.setAttribute('height', '');
                              svg.setAttribute('style', 'width: 50%; height: 50%; position: relative');
                              svg.setAttribute('viewBox', '-286 -789 2478 1517');
                              //svg.setAttribute('viewBox', '-326 -286 2438 2478')
                          }}
                          afterInjection={(error, svg) => {
                              if (error) {
                                  console.error(error)
                                  return
                              }
                              console.log(svg)
                              console.log(svg.getElementById('caras_bordes.Plane.001').childNodes[1].getAttribute('points'));

                              var svg_elements = svg.getElementById('caras_bordes.Plane.001').childNodes;
                              extract_graph_from_svg(svg_elements);
                          }}
                />
        </div>
        );
    }
}

class tile {
    constructor(name){
        //this.neighbours = [];
        this.name = name;
    }
}

class Bound {

    constructor(){
        this.min_x = +Infinity;
        this.min_y = +Infinity;
        this.max_x = -Infinity;
        this.max_y = -Infinity;
    }

    update(point){
        var coords = point.split(',');
        if (parseFloat(coords[0]) < this.min_x) {
            this.min_x = parseFloat(coords[0]);
        }
        if (parseFloat(coords[1]) < this.min_y) {
            this.min_y = parseFloat(coords[1]);
        }
        if (parseFloat(coords[0]) > this.max_x) {
            this.max_x = parseFloat(coords[0]);
        }
        if (parseFloat(coords[1]) > this.max_y) {
            this.max_y = parseFloat(coords[1]);
        }
    }

    print(){
        console.log(this.min_x);
        console.log(this.max_x);
        console.log(this.min_y);
        console.log(this.max_y);
    }
}

function extract_graph_from_svg(dom){
    var aStar = require('ngraph.path').aStar;
    var createGraph = require('ngraph.graph');
    var toDot = require('ngraph.todot');

    var tiles = [];

    var bounds = new Bound();
    var tilesize = [];

    for (var i = 0; i < dom.length; i++){
        var poly = dom[i * 2 + 1];
        if (poly) {
            if (poly.nodeName == 'polygon') {
                var points = poly.getAttribute('points');
                var coords = points.split(' ');

                var mid = calc_mid(coords);

                bounds.update(mid[0] + "," + mid[1]);

                console.log(points);
                if (i == 0) {
                    tilesize = [Math.abs(parseFloat(coords[0].split(',')[0]) - mid[0]) * 2.0,
                        Math.abs(parseFloat(coords[0].split(',')[1]) - mid[1]) * 2.0];
                }
            }
            console.log(poly.nodeName);
        }

        //var points = poly.getAttribute('points');
        //console.log(dom[i * 2 + 1]);
    }
    console.log(tilesize[0]);
    console.log(tilesize[1]);
    bounds.print();
    for (var i = 0; i < dom.length; i++) {
        var poly = dom[i * 2 + 1];
        if (poly) {
            if (poly.nodeName == 'polygon') {

            }
        }
    }


    let graph = createGraph();

    graph.addLink('a', 'b', {weight: 10});
    graph.addLink('a', 'c', {weight: 10});
    graph.addLink('c', 'd', {weight: 5});
    graph.addLink('b', 'd', {weight: 10});

    var pathFinder = aStar(graph, {
        distance(a, b, link) {
            return link.data.weight;
        }
    });
    let path = pathFinder.find('a', 'd');

    var dotContent = toDot(graph);

}

function calc_mid(coords) {
    var x = 0;
    var y = 0;
    x += parseFloat(coords[0].split(',')[0]);
    x += parseFloat(coords[1].split(',')[0]);
    x += parseFloat(coords[2].split(',')[0]);
    x += parseFloat(coords[3].split(',')[0]);

    y += parseFloat(coords[0].split(',')[1]);
    y += parseFloat(coords[1].split(',')[1]);
    y += parseFloat(coords[2].split(',')[1]);
    y += parseFloat(coords[3].split(',')[1]);

    return [(x * 0.25), (y * 0.25)];
}

function sort(points) {

}

export default FloorRenderer;
