import React, { Component } from 'react';
import floor from "./Paths2.svg";
import roof from "./roof2.svg";
import walls from "./Walls2.svg";
import linetemplate from "./line_template.svg";
import combined_struct from "./complete.svg";
import ReactSVG from 'react-svg';
import Victor from 'victor';

class FloorRenderer extends React.Component {
    render() {
        return (
            <div style={{width: "25%", height: "25%"}}>
                <ReactSVG src={combined_struct}
                          beforeInjection={svg => {
                              svg.classList.add('svg-class-name')
                              svg.setAttribute('width', '');
                              svg.setAttribute('height', '');
                              svg.setAttribute('style', 'left: 0px; top: 0px; width: 70%; height: 70%; position: absolute');
                              //svg.setAttribute('viewBox', '-1011.954 -361.3192 4461.9694 2965.88');
                              svg.setAttribute('viewBox', '-1311.954 -761.3192 4761.9694 4088.5184');
                          }}
                          afterInjection={(error, svg) => {
                              if (error) {
                                  console.error(error)
                                  return
                              }
                              console.log(svg)
                              console.log(svg.getElementById('caras_bordes.Plane.001').childNodes[1].getAttribute('points'));

                              var svg_elements = svg.getElementById('caras_bordes.Plane.001').childNodes;
                              this.travel_path = extract_graph_from_svg(svg_elements);
                              beautify_graph(svg);
                              console.log("Loaded scene");
                              setup_route(this.svg_path, this.travel_path);
                          }}
                />
                <ReactSVG src={linetemplate}
                          beforeInjection={svg => {
                              svg.classList.add('svg-class-name')
                              svg.setAttribute('width', '');
                              svg.setAttribute('height', '');
                              svg.setAttribute('style', 'left: 0px; top: 0px; width: 70%; height: 70%; position: absolute');
                              //svg.setAttribute('viewBox', '-1011.954 -361.3192 4461.9694 2965.88');
                              svg.setAttribute('viewBox', '-1311.954 -761.3192 4761.9694 4088.5184');
                          }}
                          afterInjection={(error, svg) => {
                              this.svg_path = svg;
                              console.log("Loaded path");
                          }}
                />

        </div>
        );
    }
}

class Tile {
    constructor(name, dom, mid){
        this.neighbours = [null, null, null, null];
        this.name = name;
        this.me = dom;
        this.mid = mid;
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

function setup_route(svg_line, path) {
    svg_line = svg_line.childNodes[1];
    console.log(svg_line);
    var points = [];
    for (var i = 0; i < path.length; i++) {
        console.log(path[i].id.mid);
        points[i] = path[i].id.mid.x + "," + path[i].id.mid.y;
    }
    svg_line.setAttribute('points', points);
    //console.log("Testout")
    //console.log(line);
}

function beautify_graph(svg) {
    var floor = svg.getElementById('caras_bordes.Plane.001').childNodes;

    var path_color = "rgb(230, 230, 230)";
    var wall_color = "rgb(80, 80, 80)";
    var roof_color = "rgb(130, 130, 130)";

    for (var i = 0; i < floor.length; i++){
        var poly = floor[i * 2 + 1];
        if (poly) {
            if (poly.nodeName == 'polygon') {
                poly.setAttribute('fill', path_color);
            }
        }
    }

    var walls = svg.getElementById('caras_bordes.Plane').childNodes;
    for (var i = 0; i < walls.length; i++){
        var poly = walls[i * 2 + 1];
        if (poly) {
            if (poly.nodeName == 'polygon') {
                poly.setAttribute('fill', wall_color);
                poly.setAttribute('stroke', wall_color);
                poly.setAttribute('opacity', '1.0');
                poly.setAttribute('stroke-opacity', '1.0');
            }
        }
    }

    var roofs = svg.getElementById('caras_bordes.Plane.004').childNodes;
    for (var i = 0; i < roofs.length; i++){
        var poly = roofs[i * 2 + 1];
        if (poly) {
            if (poly.nodeName == 'polygon') {
                poly.setAttribute('fill', roof_color);
                poly.setAttribute('stroke', roof_color);
                poly.setAttribute('opacity', '1.0');
                poly.setAttribute('stroke-opacity', '1.0');

            }
        }
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

                bounds.update(coords[0]);
                bounds.update(coords[1]);
                bounds.update(coords[2]);
                bounds.update(coords[3]);
                //bounds.update(mid[0] + "," + mid[1]);

                var spos = sort_point(coords);

                //console.log(points);
                if (i == 0) {

                    ivecs = calc_vectors(spos);
                    //console.log(spos);
                    //console.log(ivecs);
                    //console.log(XYtoUV(spos[0], ivecs));
                    //console.log(XYtoUV(new Victor(0,0), ivecs));
                    //console.log(XYtoUV(new Victor(ivecs[1].x * 2 + ivecs[0].x,ivecs[1].y * 2 + ivecs[0].y), ivecs));
                    //tilesize = [Math.abs(parseFloat(coords[0].split(',')[0]) - mid[0]) * 2.0,
                    //    Math.abs(parseFloat(coords[0].split(',')[1]) - mid[1]) * 2.0];
                }

                var uvcoords = XYtoUV(new Victor(mid[0], mid[1]), ivecs);
                //tiles[20][41] = 1;
                tiles[100 + parseInt(Math.floor(uvcoords.x))][100 + parseInt(Math.floor(uvcoords.y))] =
                    new Tile("Test", poly, new Victor(mid[0], mid[1]));
                /*if (i == 0) {
                    console.log("Coords:");
                    console.log(Math.floor(uvcoords.x));
                    console.log(Math.floor(uvcoords.y));
                }*/
                poly.setAttribute('data', Math.floor(uvcoords.x) + "," + Math.floor(uvcoords.y));
                newbounds.update(Math.floor(uvcoords.x)+","+Math.floor(uvcoords.y));
                //console.log(Math.floor(uvcoords.x));
                //console.log(Math.floor(uvcoords.y));
            }
            //console.log(poly.nodeName);
        }

        //var points = poly.getAttribute('points');
        //console.log(dom[i * 2 + 1]);
    }

    bounds.print();

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
    let path = pathFinder.find(tiles[98][148], tiles[60][132]);
    console.log(path);

    //var dotContent = toDot(graph);

    //console.log(dotContent);
    return path;
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
