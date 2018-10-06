import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { PathFinder } from '../pathFinding/pahtFinder';

export class Bot {
    protected playerInfo: Player;
    private pathFinder: PathFinder = new PathFinder();
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

        console.log(this.pathFinder.getShortestPath(this.playerInfo, map, new Point(10, 10), new Point(15, 7)));
        return ''; // AIHelper.createMoveAction(new Point(0, 1));
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void {
        console.log('afterTurn');
    }

    public getActions(map: Map, path: Point[]): string[] {
        const actions: string[] = [];

        for (let i = 0; i < path.length - 1; i++) {

            if ( i = path.length - 2) {
                if (map.getTileAt(path[path.length - 1]) === TileContent.Resource) {
                    actions.push(AIHelper.createCollectAction(path[i]));
                } else {
                    actions.push(AIHelper.createMoveAction(path[path.length - 2]));
                }
            } else if (map.getTileAt(path[i]) === TileContent.Wall) {
                for (let j = 0; j < this.pathFinder.nbOfTurnsToKill(5, this.playerInfo.AttackPower); j++) {
                    actions.push(AIHelper.createAttackAction(path[i]));
                }
                actions.push(AIHelper.createMoveAction(path[i]));
            } else {
                // if (map.getTileAt(path[i]) === TileContent.Empty) {
                    actions.push(AIHelper.createMoveAction(path[i]));
                // }
            }
        }

        return [];
    }
}
