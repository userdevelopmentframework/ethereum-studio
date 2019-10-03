// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
// import style from './style.less';
import { IRawAbiDefinition, Type, IDeployedContract } from '../../../../../../models';
import { Constant } from './types/Constant';
import { Transaction } from './types/Transaction';
import { Payable } from './types/Payable';

interface IProps {
    deployedContract: IDeployedContract;
    call: (deployedContract: IDeployedContract, rawAbiDefinition: IRawAbiDefinition) => void;
}

interface IState {
    abiRawDefinitions: IRawAbiDefinition[];
}

export default class AbiItemList extends React.Component<IProps, IState> {

    state = {
        abiRawDefinitions: this.props.deployedContract.abi.sort(this.compare)
    };

    compare(a: IRawAbiDefinition, b: IRawAbiDefinition) {
        const isConstantA = a.constant;
        const isConstantB = b.constant;
        return (isConstantA === isConstantB) ? 0 : isConstantA ? -1 : 1;
    }

    call = (rawAbiDefinition: IRawAbiDefinition) => {
        const { call, deployedContract } = this.props;
        call(deployedContract, rawAbiDefinition);
    }

    renderAbiDefinition(rawAbiDefinition: IRawAbiDefinition) {
        if (rawAbiDefinition.constant) {
            return <Constant
                        call={this.call}
                        rawAbiDefinition={rawAbiDefinition}
                    />;
        } else if (rawAbiDefinition.type === Type.Function && !rawAbiDefinition.payable) {
            return <Transaction
                        call={this.call}
                        data={rawAbiDefinition}
                    />;
        } else if (rawAbiDefinition.type === Type.Function && rawAbiDefinition.payable) {
            return <Payable
                        data={rawAbiDefinition}
                    />;
        }
    }

    render() {
        const { abiRawDefinitions } = this.state;

        return (
            <div>
                {
                    abiRawDefinitions.map((rawAbiDefinition, index) => {
                    return (
                            <div key={index}>
                                { this.renderAbiDefinition(rawAbiDefinition) }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}