import { Context, Contract } from 'fabric-contract-api';
import { Confirmations } from './confirmations';
export declare class ConfirmationsContract extends Contract {
    confirmationsExists(ctx: Context, confirmationsId: string): Promise<boolean>;
    Createconfirmations(ctx: Context, confirmationsId: string, value: number): Promise<string>;
    readConfirmations(ctx: Context, confirmationsId: string): Promise<Confirmations>;
}
