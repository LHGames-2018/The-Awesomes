import { AIHelper } from '../helper/aiHelper';
import { Player, TileContent } from '../helper/interfaces';
import { Map } from '../helper/map';
import { Point } from '../helper/point';
import { PatheFinder } from '../pathFinding/pahtFinder';

export class Bot {
    protected playerInfo: Player;

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
        return AIHelper.createMoveAction(new Point(0, 1));
    }

    /**
     * Gets called after executeTurn
     * @returns void
     */
    public afterTurn(): void { }

    public getActions(map: Map, path: Point[]): string[] {
        const actions: string[] = [];

        path.forEach(point => {
            if (map.getTileAt(point) === TileContent.Wall) {
                for (let i = 0; i < pathFinder.nbOfTurnsToKill(5, this.playerInfo.AttackPower); i++) {
                    actions.push(AIHelper.createAttackAction(new Point(1, 0)));
                }
                actions.push(AIHelper.createAttackAction(new Point(1, 0)));
            }
        });

        return [];
    }
}
