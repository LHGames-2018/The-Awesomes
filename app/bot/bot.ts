import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { Tile } from '../helper/tile';

export class Bot {
    protected playerInfo: Player;
    private isOccupied: boolean = false;
    private chosenTile: Tile = null;

    /**
     * Gets called before ExecuteTurn. This is where you get your bot's state.
     * @param  {Player} playerInfo Your bot's current state.
     * @returns void
     */
    public beforeTurn(playerInfo: Player): void {
        this.playerInfo = playerInfo;
        if(this.isOccupied === null)
            this.isOccupied = false;
    }
    /**
     * This is where you decide what action to take.
     * @param  {Map} map The gamemap.
     * @param  {Player[]} visiblePlayers The list of visible players.
     * @returns string The action to take(instanciate them with AIHelper)
     */
    public executeTurn(map: Map, visiblePlayers: Player[]): string {
        // Determine what action you want to take.
        console.log(100);
        if (!this.isOccupied) {
            console.log(101);
            let array = new Array;
            console.log(102);
            for(let i = -map.visibleDistance; i < map.visibleDistance; i++) {
                console.log(103);
                for(let j = -map.visibleDistance; j < map.visibleDistance; j++) {
                    let tile : Tile = map.getTileAt(new Point(this.playerInfo.Position.x + i,                                                             this.playerInfo.Position.y + j));
                    console.log(tile);
                    if (tile.TileType === TileContent.Resource)
                        array.push(tile);
                }
            }
            console.log(array);
            array.sort((tile1 : Tile, tile2: Tile) => {
                return Point.distance(this.playerInfo.Position, tile1.Position) 
                    - Point.distance(this.playerInfo.Position, tile2.Position);

            });
            this.chosenTile = array[0];
            this.isOccupied = true;
        }
        // Player is on the left
        if (this.playerInfo.Position.x < this.chosenTile.Position.x - 1) {
            console.log(1);
            return AIHelper.createMoveAction(new Point(1, 0));
        }
        //Player is on the right
        if (this.playerInfo.Position.x > this.chosenTile.Position.x + 1) {
            console.log(this.playerInfo.Position.x + " " + this.chosenTile.Position.x);
            return AIHelper.createMoveAction(new Point(-1, 0));
        }
        //Player is above
        if (this.playerInfo.Position.y < this.chosenTile.Position.y) {
            console.log(3);
            return AIHelper.createMoveAction(new Point(0, 1));
        }
        //Player is under
        if (this.playerInfo.Position.y > this.chosenTile.Position.y) {
            console.log(4);
            return AIHelper.createMoveAction(new Point(0, -1));
        }

        return AIHelper.createCollectAction(new Point(this.playerInfo.Position.x - this.chosenTile.Position.x, this.playerInfo.Position.y - this.chosenTile.Position.y));
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
