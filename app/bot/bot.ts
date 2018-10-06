import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { Tile } from '../helper/tile';

export class Bot {
    protected playerInfo: Player;
    private isOccupied = false;
    private chosenTile: Tile = null;
    private xMovement = 0;
    private yMovement = 0;

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
            this.chosenTile = map.getTileAt(this.playerInfo.HouseLocation);
            this.xMovement = this.playerInfo.Position.x - this.playerInfo.HouseLocation.x;
            this.yMovement = this.playerInfo.Position.y - this.playerInfo.HouseLocation.y;
            this.isOccupied = true;
        } else if (this.chosenTile !== null && map.getTileAt(this.chosenTile.Position).TileType !== TileContent.Resource ) {
            console.log(3);
            this.isOccupied = false;
        }
        if (!this.isOccupied) {
            console.log(4);
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
            this.chosenTile = array[0];
            this.xMovement = 10 - this.chosenTile.Position.x;
            this.yMovement = 10 - this.chosenTile.Position.y;
            this.isOccupied = true;
        }
        // Player is on the left
        if (this.xMovement < -1) {
            this.xMovement++;
            return AIHelper.createMoveAction(new Point(1, 0));
        }
        // Player is on the right
        if (this.xMovement > 1) {
            this.xMovement--;
            return AIHelper.createMoveAction(new Point(-1, 0));
        }
        // Player is above
        if (this.yMovement < 0) {
            this.yMovement++;
            return AIHelper.createMoveAction(new Point(0, 1));
        }
        // Player is under
        if (this.yMovement > 0) {
            this.yMovement++;
            return AIHelper.createMoveAction(new Point(0, -1));
        }
        if (this.chosenTile.TileType === TileContent.House) {
            return AIHelper.createMoveAction(new Point(this.playerInfo.HouseLocation.x - this.playerInfo.Position.x, 0));
        }
        return AIHelper.createCollectAction(new Point(-this.xMovement, this.yMovement));
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
            return array[0].Position;
    }

    private findHomeClosestPoint(map: Map): Point {
        const point: Point = new Point(0, 0);
        point.x = this.playerInfo.HouseLocation.x - this.playerInfo.Position.x + 10;
        point.y = this.playerInfo.HouseLocation.y - this.playerInfo.Position.y + 10;
        if (point.x > 20) {
            point.x = 20;
        }
        if (point.x < 0) {
            point.x = 0;
        }
        if (point.y > 20) {
            point.y = 20;
        }
        if (point.y < 0) {
            point.x = 0;
        }
        return point;
    }
}
