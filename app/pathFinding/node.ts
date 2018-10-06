import { TileContent } from '../helper/interfaces';
import { Tile, ResourceTile } from '../helper/tile';
import { Point } from '../helper/point';


export class Node {
    public point: Point;
    public g: number;
    public h: number;
    public previous: Node;

    public constructor(x: number, y: number, previous: Node = null, g: number = 0, h: number = 0) {
        this.point = new Point(x, y);
        this.g = g;
        this.h = h;
        this.previous = previous;
    }

    public getNeighbors(): Node[] {
        const neighbors: Node[] = [];
        neighbors.push(new Node(this.point.x + 1, this.point.y,  this));
        neighbors.push(new Node(this.point.x - 1, this.point.y,  this));
        neighbors.push(new Node(this.point.x, this.point.y - 1,  this));
        neighbors.push(new Node(this.point.x, this.point.y + 1,  this));

        return neighbors;
    }
}
