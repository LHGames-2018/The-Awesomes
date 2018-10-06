import { TileContent } from '../helper/interfaces';
import { Tile, ResourceTile } from '../Helper/tile';
import { Point } from '../helper/point';
import { Player } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Node } from './node';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

export class PathFinder {
    // An educated guess of how far it is between two points
    public heuristic(a: Point, b: Point): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    public nbOfTurns(player: Player, map: Map, a: Node, b: Node): number {
        if (map.getTileAt(b.point) === TileContent.Wall) {
            return this.nbOfTurnsToKill(5, player.AttackPower) + 1;
        }
        return this.heuristic(a.point, b.point);
    }

    public nbOfTurnsToKill(hp: number, attackPower: number): number {
        return Math.ceil(hp / attackPower);
    }


    // Function to delete element from the array
    public removeFromArray(arr: Node[], node: Node) {
        // Could use indexOf here instead to be more efficient
        for (let i = arr.length - 1; i >= 0; i--) {
            if (Point.Equals(arr[i].point, node.point)) {
                arr.splice(i, 1);
            }
        }
    }

    public containsObject(list: Node[], obj: Node): boolean {
        for (let i = 0; i < list.length; i++) {
            if (Point.Equals(list[i].point, obj.point)) {
                return true;
            }
        }

        return false;
    }

    // Run one finding step.
    // returns 0 if search ongoing
    // returns 1 if goal reached
    // returns -1 if no solution
    public getShortestPath(player: Player, map: Map, start: Point, end: Point) {
        const openSet: Node[] = [];
        const startingNode = new Node(start.x, start.y, null, 0, 0, this.heuristic(start, end), Point.distance(start, end));
        openSet.push(startingNode);

        const closedSet: Node[] = [];
        let lastCheckedNode: Node = startingNode;

        while (openSet.length > 0) {
            console.log('1');
            // Best next option
            let winner = 0;
            for (let i = 1; i < openSet.length; i++) {
                console.log('2');

                if (openSet[i].f < openSet[winner].f) {
                    console.log('3');

                    winner = i;
                }
                // if we have a tie according to the standard heuristic
                if (openSet[i].f === openSet[winner].f) {
                    console.log('4');

                    // Prefer to explore options with longer known paths (closer to goal)
                    if (openSet[i].g > openSet[winner].g) {
                        console.log('5');

                        winner = i;
                    }
                    // if we're using Manhattan distances then also break ties
                    // of the known distance measure by using the visual heuristic.
                    // This ensures that the search concentrates on routes that look
                    // more direct. This makes no difference to the actual path distance
                    // but improves the look for things like games or more closely
                    // approximates the real shortest path if using grid sampled data for
                    // planning natural paths.
                    if (openSet[i].g === openSet[winner].g &&
                        openSet[i].vh < openSet[winner].vh) {
                            console.log('6');

                        winner = i;
                    }
                }
            }

            const current = openSet[winner];
            lastCheckedNode = current;
            console.log('7');

            // Did I finish?
            if (Point.Equals(current.point, end)) {
                console.log('8');

                let actualNode = current;
                const path: Point[] = [];
                path.push(current.point);

                while (actualNode.previous) {
                    const previousNode = actualNode.previous;
                    path.unshift(new Point(actualNode.point.x - previousNode.point.x, actualNode.point.y - previousNode.point.y));
                    actualNode = previousNode;
                }

                return path;
            }

            // Best option moves from openSet to closedSet
            this.removeFromArray(openSet, current);
            closedSet.push(current);

            // Check all the neighbors
            const neighbors = current.getNeighbors();
            console.log('9');

            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                console.log('10');

                // Valid next spot?
                if (!this.containsObject(closedSet, neighbor)) {
                    // Is this a better path than before?
                    console.log('11');

                    const tempG = current.g + this.nbOfTurns(player, map, neighbor, current);

                    // Is this a better path than before?
                    if (!this.containsObject(openSet, neighbor)) {
                        console.log('12');

                        openSet.push(neighbor);
                    } else if (tempG >= neighbor.g) {
                        // No, it's not a better path
                        continue;
                    }

                    neighbor.g = tempG;
                    neighbor.h = this.heuristic(neighbor.point, end);
                    neighbor.vh = Point.distance(neighbor.point, end);

                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }

            }

            return null;
        }
    }
}
