import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent, PurchasableItem } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { Tile } from '../helper/tile';
import { PathFinder } from '../pathFinding/pahtFinder';

export class Bot {
    protected playerInfo: Player;
    private isOccupied = false;
    private goalPoint: Point = null;
    private goalType: TileContent = null;
    private pathFinder: PathFinder = new PathFinder();
    private path: Point[] = [];
    private action = 0;
    /**
     * Gets called before ExecuteTurn. This is where you get your bot's state.
     * @param  {Player} playerInfo Your bot's current state.
     * @returns void
     */
    public beforeTurn(playerInfo: Player): void {
        this.playerInfo = playerInfo;
        if (this.isOccupied === null) {
            this.isOccupied = false;
        }
    }
    /**
     * This is where you decide what action to take.
     * @param  {Map} map The gamemap.
     * @param  {Player[]} visiblePlayers The list of visible players.
     * @returns string The action to take(instanciate them with AIHelper)
     */
    public executeTurn(map: Map, visiblePlayers: Player[]): string {
        // Determine what action you want to take.
        if (this.playerInfo.CarriedResources === this.playerInfo.CarryingCapacity) {
            this.goalPoint = this.findHomeClosestPoint(map);
            this.goalType = TileContent.House;
            this.path = this.pathFinder.getShortestPath(this.playerInfo, map, this.playerInfo.Position, this.goalPoint);
            this.action = 0;
            this.isOccupied = true;
        }
        if (!this.isOccupied) {
            console.log('What am i gonna do?');
            this.goalPoint = this.findClosestRessource(map);
            console.log('im a go there:');
            console.log(this.goalPoint);
            this.goalType = TileContent.Resource;
            this.path = this.pathFinder.getShortestPath(this.playerInfo, map, this.playerInfo.Position, this.goalPoint);
            console.log(this.path);
            this.action = 0;
            this.isOccupied = true;
        }
        return this.getAction(map);
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void {
        return;
    }

    private findClosestRessource(map: Map): Point {
        const array = new Array;
        for (let i = -map.visibleDistance; i < map.visibleDistance; i++) {
            for (let j = -map.visibleDistance; j < map.visibleDistance; j++) {
                const tile: Tile = map.getTileAt(new Point(this.playerInfo.Position.x + i, this.playerInfo.Position.y + j));
                if (tile.TileType === TileContent.Resource) {
                    array.push(tile);
                }
            }
        }
        array.sort((tile1: Tile, tile2: Tile) => {
            return Point.distance(new Point(10, 10), tile1.Position)
                - Point.distance(new Point(10, 10), tile2.Position);
        });
        if (array.length === 0) {
            throw new Error('No ressources found in the visible area');
        }
        return new Point(array[0].Position.x + this.playerInfo.Position.x - 10, array[0].Position.y + this.playerInfo.Position.y - 10);
    }

    private findHomeClosestPoint(map: Map): Point {
        let distX = this.playerInfo.HouseLocation.x - this.playerInfo.Position.x;
        let distY = this.playerInfo.HouseLocation.y - this.playerInfo.Position.y;
        if (distX > 10) {
            distX = 10;
        } else if (distX < -10) {
            distX = -10;
        }
        if (distY > 10) {
            distY = 10;
        } else if (distY < -10) {
            distY = -10;
        }
        return new Point(this.playerInfo.Position.x + distX, this.playerInfo.Position.y + distY);
    }

    public getAction(map: Map): string {
        const newPosition = this.newPosition(this.playerInfo.Position, this.path[this.action]);
        if (this.action === this.path.length - 2) {
            if (map.getTileAt(newPosition).TileType === TileContent.Resource) {
                return AIHelper.createCollectAction(this.path[this.action]);
            } else {
                this.isOccupied = false;
                return AIHelper.createMoveAction(this.path[this.action]);
            }
        }
        if (map.getTileAt(newPosition).TileType === TileContent.Wall) {
            return AIHelper.createAttackAction(this.path[this.action]);
        }
        if (map.getTileAt(newPosition).TileType === TileContent.Player) {
            return AIHelper.createAttackAction(this.path[this.action]);
        }
        if (map.getTileAt(newPosition).TileType === TileContent.Shop) {
            return AIHelper.createPurchaseAction(PurchasableItem.Backpack);
        }
        return AIHelper.createMoveAction(this.path[this.action++]);
    }
    public newPosition(a: Point, b: Point): Point {
        return new Point(a.x + b.x, a.y + b.y);
    }
}
