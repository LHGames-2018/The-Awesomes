import { TileContent } from '../helper/interfaces';
import { Tile, ResourceTile } from '../helper/tile';
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
        if (map.getTileAt(b.point).TileType === TileContent.Wall) {
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

    public bestNode(list: Node[]): Node {
        let nextNode = list[0];
        list.forEach(node => {
                if (node.h < nextNode.h) {
                    nextNode = new Node(node.point.x, node.point.y, node.previous, node.g, node.h);
                }
            }
        );

        return nextNode;
    }

    public getShortestPath(player: Player, map: Map, start: Point, end: Point) {
        const openSet: Node[] = [];
        const startingNode = new Node(start.x, start.y, null, 0, this.heuristic(start, end));
        openSet.push(startingNode);

        const closedSet: Node[] = [];

        while (openSet.length > 0) {
            const current = this.bestNode(openSet);
            this.removeFromArray(openSet, current);


            if (Point.Equals(current.point, end)) {
                // console.log('fin');
                // console.log(current);

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

            const neighbors = current.getNeighbors();

            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];

                const tempG = current.g + this.nbOfTurns(player, map, neighbor, current);

                if ((this.containsObject(closedSet, neighbor) && tempG < neighbor.g) ||
                    (this.containsObject(openSet, neighbor) && tempG < neighbor.g)) {
                    continue;
                } else {
                    neighbor.g = tempG;
                    neighbor.h = neighbor.g + this.heuristic(neighbor.point, end);
                    neighbor.previous = current;
                    openSet.push(neighbor);
                }

                closedSet.push(current);
            }

        }

        return null;
    }
}
