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
import style from './style.less';
import { FolderItem, FileItem, ContractItem } from './items';
import { IProjectItem, ProjectItemTypes } from '../../../../models';

interface IProps {
    tree: IProjectItem;
    onToggleTreeItem(id: string): void;
    onOpenFile(id: string): void;
    onRenameItem(id: string, name: string): void;
    onCreateItem(parentId: string, type: ProjectItemTypes, name: string): void;
    onDeleteItem(id: string): void;

    onConfigureContract(file: IProjectItem): void;
    onCompileContract(file: IProjectItem): void;
    onDeployContract(file: IProjectItem): void;
    onInteractContract(file: IProjectItem): void;
}

export class Explorer extends React.Component<IProps> {

    onRenameItem = (id: string, currName: string) => {
        const name = prompt('Enter new name.', currName);
        if (name) {
            this.props.onRenameItem(id, name);
        }
    }

    onCreateItem = (parentId: string, type: ProjectItemTypes) => {
        const name = prompt('Enter a name.');
        if (name) {
            this.props.onCreateItem(parentId, type, name);
        }
    }

    onDeleteItem = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            this.props.onDeleteItem(id);
        }
    }

    renderTree(itemData: IProjectItem, actions: any) {
        if (itemData.deleted) {
            return null;
        }

        const childHtml = itemData.children.map(i => this.renderTree(i, actions));

        if (itemData.type === ProjectItemTypes.File) {
            if (itemData.name.toLowerCase().endsWith('.sol')) {
                return (
                    <ContractItem key={ itemData.id }
                        data={ itemData }

                        onToggle={ actions.onToggleTreeItem }
                        onClick={ actions.onOpenFile }
                        onRenameClick={ (id: string) => this.onRenameItem(id, itemData.name) }
                        onDeleteClick={ (id: string) => this.onDeleteItem(id, itemData.name) }

                        onConfigureClick={ actions.onConfigureContract }
                        onCompileClick={ actions.onCompileContract }
                        onDeployClick={ actions.onDeployContract }
                        onInteractClick={ actions.onInteractContract } />
                );
            } else {
                return (
                    <FileItem key={ itemData.id }
                        data={ itemData }
                        onClick={ actions.onOpenFile }
                        onRenameClick={ (id: string) => this.onRenameItem(id, itemData.name) }
                        onDeleteClick={ (id: string) => this.onDeleteItem(id, itemData.name) } />
                );
            }
        } else if (itemData.type === ProjectItemTypes.Folder) {
            return (
                <FolderItem key={ itemData.id }
                        data={ itemData }
                        onClick={ (i: IProjectItem) => actions.onToggleTreeItem(i.id) }
                        onToggle={ actions.onToggleTreeItem }

                        onCreateItemClick={ this.onCreateItem }
                        onImportFileClick={ actions.onImportFile }
                        onRenameClick={ (id: string) => this.onRenameItem(id, itemData.name) }
                        onDeleteClick={ (id: string) => this.onDeleteItem(id, itemData.name) }>
                        { childHtml }
                </FolderItem>
            );
        } else {
            throw new Error('Unsupported item type');
        }
    }

    render() {
        const treeHtml = this.props.tree ? this.renderTree(this.props.tree, this.props) : null;
        return (
            <div className={ style.treeContainer }>
                { treeHtml }
            </div>
        );
    }
}