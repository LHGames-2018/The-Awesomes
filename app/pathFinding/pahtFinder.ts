import { TileContent } from '../helper/interfaces';
import { Tile, ResourceTile } from '../Helper/tile';
import { Point } from '../helper/point';
import { Player } from '../helper/interfaces';
import { Map } from '../helper/map';
import * as _ from 'underscore';


function AStarPathFinder(player: Player, importedMap: Map, start: Point, end: Point, allowDiagonals: boolean = false) {
    const map: Map = importedMap;
    let lastCheckedNode = start;
    const openSet: Point[] = [];
    // openSet starts with beginning node only
    openSet.push(start);
    // openSet.push(map.tiles[start.x][start.y]);

    const closedSet: Point[] = [];
    // const start = start;
    // const end = end;
    // const allowDiagonals = allowDiagonals;

    // An educated guess of how far it is between two points

    const heuristic = function(a: Point, b: Point) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };

    // Function to delete element from the array
    const removeFromArray = function(arr: Point[], point: Point) {
        // Could use indexOf here instead to be more efficient
        for (let i = arr.length - 1; i >= 0; i--) {
            if (Point.Equals(arr[i], point)) {
                arr.splice(i, 1);
            }
        }
    };

    // Run one finding step.
    // returns 0 if search ongoing
    // returns 1 if goal reached
    // returns -1 if no solution
    const step = function() {

        if (openSet.length > 0) {

            // Best next option
            let winner = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
                //if we have a tie according to the standard heuristic
                if (openSet[i].f === openSet[winner].f) {
                    //Prefer to explore options with longer known paths (closer to goal)
                    if (openSet[i].g > openSet[winner].g) {
                        winner = i;
                    }
                    //if we're using Manhattan distances then also break ties
                    //of the known distance measure by using the visual heuristic.
                    //This ensures that the search concentrates on routes that look
                    //more direct. This makes no difference to the actual path distance
                    //but improves the look for things like games or more closely
                    //approximates the real shortest path if using grid sampled data for
                    //planning natural paths.
                    if (!allowDiagonals) {
                        if (openSet[i].g == openSet[winner].g &&
                            openSet[i].vh < openSet[winner].vh) {
                            winner = i;
                        }
                    }
                }
            }
            const current = openSet[winner];
            lastCheckedNode = current;

            // Did I finish?
            if (current === end) {
                console.log("DONE!");
                return 1;
            }

            // Best option moves from openSet to closedSet
            removeFromArray(openSet, current);
            closedSet.push(current);

            // Check all the neighbors
            const neighbors = current.getNeighbors();

            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];

                // Valid next spot?
                if (!_.contains(closedSet, neighbor)) {
                    // Is this a better path than before?
                    let tempG = current.g + heuristic(neighbor, current);

                    // Is this a better path than before?
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        // No, it's not a better path
                        continue;
                    }

                    neighbor.g = tempG;
                    neighbor.h = heuristic(neighbor, end);
                    if (!allowDiagonals) {
                        neighbor.vh = Point.distance(neighbor, end);
                    }
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }

            }
            return 0;
            // Uh oh, no solution
        } else {
            console.log('no solution');
            return -1;
        }
    };
}
