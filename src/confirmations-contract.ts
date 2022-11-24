/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Confirmations } from './confirmations';

@Info({title: 'ConfirmationsContract', description: 'My Smart Contract' })
export class ConfirmationsContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async confirmationsExists(ctx: Context, confirmationsId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(confirmationsId);
        return (!!buffer && buffer.length > 0);
    }

  @Transaction(false)
  public async Createconfirmations(ctx: Context, confirmationsId: string, value: number): Promise<string>{
   try{ 
    const existsconfirmation = await this.confirmationsExists(ctx, confirmationsId);
    if (existsconfirmation) {
      const Confirmationsrecord = await ctx.stub.getState(confirmationsId);
      const acc: Confirmations = JSON.parse(Confirmationsrecord.toString());
      acc.Value = value; 
      await ctx.stub.putState(confirmationsId, Buffer.from(JSON.stringify(acc)));
      return;  
    }  
    else {
      const confirmations = new Confirmations();
      confirmations.Value = value;
      const buffer = Buffer.from(JSON.stringify(confirmations));
      await ctx.stub.putState(confirmationsId, buffer);
      return;
    }
  }
  catch {
    throw new Error(JSON.stringify({error:7020, descripcion:'Fallo la creación de la politica'}));
  }
  }
      
    @Transaction(false)
    @Returns('Confirmations')
    public async readConfirmations(ctx: Context, confirmationsId: string): Promise<Confirmations> {
        const exists = await this.confirmationsExists(ctx, confirmationsId);
        if (!exists) {
          throw new Error(JSON.stringify({error:7000, descripcion:'Politica de confirmacion no esta disponible'}));
        }
        const buffer = await ctx.stub.getState(confirmationsId);
        const confirmations = JSON.parse(buffer.toString()) as Confirmations;
        return confirmations;
    }

}
