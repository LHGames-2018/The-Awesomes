import { TileContent } from '../helper/interfaces';
import { Tile, ResourceTile } from '../Helper/tile';
import { Point } from '../helper/point';
import { Player } from '../helper/interfaces';
import { Map } from '../helper/map';
import * as _ from 'underscore';
import { Node } from './node';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

export class PatheFinder {
    // An educated guess of how far it is between two points
    public heuristic(a: Point, b: Point): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    public nbOfTurns(player: Player, map: Map, a: Node, b: Node): number {
        if (map.getTileAt(b.point) === TileContent.Wall) {
            return this.nbOfTurnsToKill(5, player.AttackPower);
        }
        return this.heuristic(a.point, b.point);
    }

    public nbOfTurnsToKill(hp: number, attackPower: number): number {
        return Math.ceil(hp / attackPower) + 1;
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

    public getShortestPath(player: Player, map: Map, start: Point, end: Point) {
        const openSet: Node[] = [];
        const startingNode = new Node(start.x, start.y, null, 0, 0, this.heuristic(start, end), Point.distance(start, end));
        openSet.push(startingNode);

        const closedSet: Node[] = [];

        while (openSet.length > 0) {
            console.log('1');

            console.log('2');
            const current = openSet.pop();

            if (Point.Equals(current.point, end)) {
                console.log('8');

                let actualNode = current;
                const path: Point[] = [];
                path.push(current.point);

                while (actualNode.previous) {
                    const previousNode = actualNode.previous;
                    path.unshift(previousNode.point);
                    actualNode = previousNode;
                }

                return path;
            }

            const neighbors = current.getNeighbors();
            console.log('9');

            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                console.log('10');

                const tempG = current.g + this.nbOfTurns(player, map, neighbor, current);

                if ((this.containsObject(closedSet, neighbor) && tempG < neighbor.g) ||
                    (this.containsObject(openSet, neighbor) && tempG < neighbor.g)) {
                    continue;
                } else {
                    console.log('11');
                    neighbor.g = tempG;
                    neighbor.h = neighbor.g + this.heuristic(neighbor.point, end);
                    neighbor.previous = current;
                    openSet.push(neighbor);
                }

                closedSet.push(current);
            }

            return null;
        }
    }
}
