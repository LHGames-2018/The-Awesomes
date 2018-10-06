import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { Tile } from '../helper/tile';

export class Bot {
    protected playerInfo: Player;
    private isOccupied: boolean = false;
    private chosenTile: Tile = null;
    private xMovement: number = 0;
    private yMovement: number = 0;

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
        if (!this.isOccupied) {
            let array = new Array;
            for(let i = -map.visibleDistance; i < map.visibleDistance; i++) {
                for(let j = -map.visibleDistance; j < map.visibleDistance; j++) {
                    let tile : Tile = map.getTileAt(new Point(this.playerInfo.Position.x + i,                                                             this.playerInfo.Position.y + j));
                    if (tile.TileType === TileContent.Resource)
                        array.push(tile);
                }
            }
            console.log(array);
            array.sort((tile1 : Tile, tile2: Tile) => {
                return Point.distance(new Point(10,10), tile1.Position) 
                    - Point.distance(new Point(10,10), tile2.Position);

            });
            this.chosenTile = array[0];
            this.xMovement = 10 - this.chosenTile.Position.x;
            this.yMovement = 10 - this.chosenTile.Position.y;
            this.isOccupied = true;
        }
        // Player is on the left
        if (this.xMovement < -1) {
            console.log(1);
            this.xMovement++;
            return AIHelper.createMoveAction(new Point(1, 0));
        }
        //Player is on the right
        if (this.xMovement > 1) {
            console.log(2);
            this.xMovement--;
            return AIHelper.createMoveAction(new Point(-1, 0));
        }
        //Player is above
        if (this.yMovement < 0) {
            console.log(3);
            this.yMovement++;
            return AIHelper.createMoveAction(new Point(0, 1));
        }
        //Player is under
        if (this.yMovement > 0) {
            console.log(4);
            this.yMovement++;
            return AIHelper.createMoveAction(new Point(0, -1));
        }

        return AIHelper.createCollectAction(new Point(-this.xMovement, this.yMovement));
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }
}
