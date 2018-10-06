import { TileContent } from '../helper/interfaces';
import { Tile, ResourceTile } from '../helper/tile';
import { Point } from '../helper/point';


export class Node {
    public point: Point;
    public f: number;
    public g: number;
    public h: number;
    public vh: number;
    public previous: Node;

    public constructor(x: number, y: number, previous: Node = null, f: number = 0, g: number = 0, h: number = 0, vh: number = 0) {
        this.point = new Point(x, y);
        this.f = f;
        this.g = g;
        this.h = h;
        this.vh = vh;
        this.previous = previous;
    }

    public getNeighbors(): Node[] {
        const neighbors: Node[] = [];
        neighbors.push(new Node(this.point.x + 1, this.point.y + 1,  this));
        neighbors.push(new Node(this.point.x + 1, this.point.y - 1,  this));
        neighbors.push(new Node(this.point.x - 1, this.point.y - 1,  this));
        neighbors.push(new Node(this.point.x - 1, this.point.y + 1,  this));

        return neighbors;
    }
}
