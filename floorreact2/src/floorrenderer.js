import React, { Component } from 'react';
import floor from "./Paths2.svg";
import ReactSVG from 'react-svg';
import Victor from 'victor';

class FloorRenderer extends React.Component {
    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <ReactSVG src={floor}
                          beforeInjection={svg => {
                              svg.classList.add('svg-class-name')
                              svg.setAttribute('width', '');
                              svg.setAttribute('height', '');
                              svg.setAttribute('style', 'width: 100%; height: 100%; position: relative');
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

class Tile {
    constructor(name){
        this.neighbours = [null, null, null, null];
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

    //var tiles = [];
    var tiles = new Array(170).fill(null).map(item =>(new Array(170).fill(null)));

    var bounds = new Bound();
    var ivecs;
    var newbounds = new Bound();

    for (var i = 0; i < dom.length; i++){
        var poly = dom[i * 2 + 1];
        if (poly) {
            if (poly.nodeName == 'polygon') {
                var points = poly.getAttribute('points');
                var coords = points.split(' ');

                var mid = calc_mid(coords);

                bounds.update(mid[0] + "," + mid[1]);

                var spos = sort_point(coords);

                //console.log(points);
                if (i == 0) {

                    ivecs = calc_vectors(spos);
                    //console.log(spos);
                    console.log(ivecs);
                    //console.log(XYtoUV(spos[0], ivecs));
                    //console.log(XYtoUV(new Victor(0,0), ivecs));
                    //console.log(XYtoUV(new Victor(ivecs[1].x * 2 + ivecs[0].x,ivecs[1].y * 2 + ivecs[0].y), ivecs));
                    //tilesize = [Math.abs(parseFloat(coords[0].split(',')[0]) - mid[0]) * 2.0,
                    //    Math.abs(parseFloat(coords[0].split(',')[1]) - mid[1]) * 2.0];
                }

                var uvcoords = XYtoUV(new Victor(mid[0], mid[1]), ivecs);
                //tiles[20][41] = 1;
                tiles[100 + parseInt(Math.floor(uvcoords.x))][100 + parseInt(Math.floor(uvcoords.y))] = new Tile("Test");
                if (i == 0) {
                    console.log("Coords:");
                    console.log(Math.floor(uvcoords.x));
                    console.log(Math.floor(uvcoords.y));
                }
                newbounds.update(Math.floor(uvcoords.x)+","+Math.floor(uvcoords.y));
                //console.log(Math.floor(uvcoords.x));
                //console.log(Math.floor(uvcoords.y));
            }
            //console.log(poly.nodeName);
        }

        //var points = poly.getAttribute('points');
        //console.log(dom[i * 2 + 1]);
    }

    var graph = createGraph();



    for (var u = 0; u < tiles.length; u++){
        for (var v = 0; v < tiles[0].length; v++){
            if(tiles[u][v] != null) {
                if(tiles[u][v - 1] != null){
                    tiles[u][v].neighbours[0] = tiles[u][v - 1];
                }
                if(tiles[u + 1][v] != null){
                    tiles[u][v].neighbours[1] = tiles[u + 1][v];
                }
                if(tiles[u][v + 1] != null){
                    tiles[u][v].neighbours[2] = tiles[u][v + 1];
                }
                if(tiles[u - 1][v] != null){
                    tiles[u][v].neighbours[3] = tiles[u - 1][v];
                }
                for (var n = 0; n < 4; n++) {
                    if (tiles[u][v].neighbours[n] != null){
                        graph.addLink(tiles[u][v], tiles[u][v].neighbours[n], {weight: 1});
                    }
                }
            }

        }
    }


    var pathFinder = aStar(graph, {
        distance(a, b, link) {
            return link.data.weight;
        }
    });
    let path = pathFinder.find(tiles[72][141], tiles[72][141].neighbours[0]);
    console.log(path);

    //var dotContent = toDot(graph);

    //console.log(dotContent);
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

function calc_vectors(points) {
    //var u = new Victor(points[1] - points[0]);
    var u = new Victor(points[1].x - points[0].x, points[1].y - points[0].y);
    //var v = new Victor(points[3] - points[0]);
    var v = new Victor(points[3].x - points[0].x, points[3].y - points[0].y);
    return [u,v];
}

function XYtoUV(inp, ivec) {
    var den = 1.0 / (ivec[0].x * ivec[1].y - ivec[0].y * ivec[1].x);
    var u = ivec[1].y * inp.x - ivec[1].x * inp.y;
    var v = - ivec[0].y * inp.x + ivec[0].x * inp.y;

    return new Victor(den * u, den * v);

    //inp.x / ivec[0].x;
    //inp.y / ivec[0].x;
    /*var a = ivec[0];
    var b = ivec[1];

    var xvec = new Victor(1.0 / (2.0 * a.x), 1.0 / (2.0 * a.y));
    var yvec = new Victor(- (a.x * xvec.x) / b.x, - (a.y * xvec.y) / b.y);

    return new Victor(inp.x * xvec.x + inp.y * xvec.y, inp.x * yvec.x + inp.y * yvec.y);*/
}

function sort_point(points) {
    var v = [];
    v[0] = new Victor(parseFloat(points[0].split(',')[0]), parseFloat(points[0].split(',')[1]));
    v[1] = new Victor(parseFloat(points[1].split(',')[0]), parseFloat(points[1].split(',')[1]));
    v[2] = new Victor(parseFloat(points[2].split(',')[0]), parseFloat(points[2].split(',')[1]));
    v[3] = new Victor(parseFloat(points[3].split(',')[0]), parseFloat(points[3].split(',')[1]));
    var sorted = [];
    var xmin = +Infinity;
    var xmax = -Infinity;
    var ymin = +Infinity;
    var ymax = -Infinity;
    for (var i = 0; i < 4; i++){
        if (v[i].x < xmin) {
            xmin = v[i].x;
            sorted[0] = v[i];
        }
        if (v[i].x > xmax) {
            xmax = v[i].x;
            sorted[2] = v[i];
        }
        if (v[i].y < ymin) {
            ymin = v[i].y;
            sorted[1] = v[i];
        }
        if (v[i].y > ymax) {
            ymax = v[i].y;
            sorted[3] = v[i];
        }
    }

    return sorted;
}

export default FloorRenderer;
