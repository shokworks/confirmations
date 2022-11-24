/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { ConfirmationsContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('ConfirmationsContract', () => {

    let contract: ConfirmationsContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new ConfirmationsContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"confirmations 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"confirmations 1002 value"}'));
    });

    describe('#confirmationsExists', () => {

        it('should return true for a confirmations', async () => {
            await contract.confirmationsExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a confirmations that does not exist', async () => {
            await contract.confirmationsExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createConfirmations', () => {

        it('should create a confirmations', async () => {
            await contract.createConfirmations(ctx, '1003', 'confirmations 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"confirmations 1003 value"}'));
        });

        it('should throw an error for a confirmations that already exists', async () => {
            await contract.createConfirmations(ctx, '1001', 'myvalue').should.be.rejectedWith(/The confirmations 1001 already exists/);
        });

    });

    describe('#readConfirmations', () => {

        it('should return a confirmations', async () => {
            await contract.readConfirmations(ctx, '1001').should.eventually.deep.equal({ value: 'confirmations 1001 value' });
        });

        it('should throw an error for a confirmations that does not exist', async () => {
            await contract.readConfirmations(ctx, '1003').should.be.rejectedWith(/The confirmations 1003 does not exist/);
        });

    });

    describe('#updateConfirmations', () => {

        it('should update a confirmations', async () => {
            await contract.updateConfirmations(ctx, '1001', 'confirmations 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"confirmations 1001 new value"}'));
        });

        it('should throw an error for a confirmations that does not exist', async () => {
            await contract.updateConfirmations(ctx, '1003', 'confirmations 1003 new value').should.be.rejectedWith(/The confirmations 1003 does not exist/);
        });

    });

    describe('#deleteConfirmations', () => {

        it('should delete a confirmations', async () => {
            await contract.deleteConfirmations(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a confirmations that does not exist', async () => {
            await contract.deleteConfirmations(ctx, '1003').should.be.rejectedWith(/The confirmations 1003 does not exist/);
        });

    });

});
