import { AIHelper } from '../helper/aiHelper';
import { Player } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { PatheFinder } from '../pathFinding/pahtFinder';

export class Bot {
    protected playerInfo: Player;
    private pathFinder: PatheFinder = new PatheFinder();
    /**
     * Gets called before ExecuteTurn. This is where you get your bot's state.
     * @param  {Player} playerInfo Your bot's current state.
     * @returns void
     */
    public beforeTurn(playerInfo: Player): void {
        this.playerInfo = playerInfo;





    }
    /**
     * This is where you decide what action to take.
     * @param  {Map} map The gamemap.
     * @param  {Player[]} visiblePlayers The list of visible players.
     * @returns string The action to take(instanciate them with AIHelper)
     */
    public executeTurn(map: Map, visiblePlayers: Player[]): string {
        // Determine what action you want to take.
        console.log(this.playerInfo.Position);

        console.log(this.pathFinder.getShortestPath(this.playerInfo, map, this.playerInfo.Position, new Point(9, 39)));
        return ''; // AIHelper.createMoveAction(new Point(0, 1));
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void {
        console.log('afterTurn');
     }
}
