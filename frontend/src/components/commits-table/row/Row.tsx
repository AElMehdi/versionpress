/// <reference path='../../common/Commits.d.ts' />

import * as React from 'react';
import { observer } from 'mobx-react';

import CommitDetails from '../commit-details/CommitDetails';
import CommitSummary from '../commit-summary/CommitSummary';
import Error from './Error';
import DetailsLevel from '../../../enums/DetailsLevel';

import { changeDetailsLevel } from '../../../actions';
import CommitRow from '../../../entities/CommitRow';

interface RowProps {
  commitRow: CommitRow;
  enableActions: boolean;
  showVisualization: boolean;
  onUndo(hash: string, message: string): void;
  onRollback(hash: string, date: string): void;
  onCommitsSelect(commits: Commit[], isChecked: boolean, isShiftKey: boolean): void;
  onChangeShowVisualization(): void;
}

@observer
export default class Row extends React.Component<RowProps, {}> {

  onDetailsLevelChange = (detailsLevel: DetailsLevel) => {
    const { commitRow } = this.props;
    changeDetailsLevel(detailsLevel, commitRow);
  };

  render() {
    const { commitRow, enableActions, onUndo, onRollback, onCommitsSelect, showVisualization } = this.props;
    const { commit, isSelected, detailsLevel, diff, error, isLoading, visualization } = commitRow;

    return (
      <tbody>
        <CommitSummary
          commit={commit}
          enableActions={enableActions}
          isSelected={isSelected}
          detailsLevel={detailsLevel}
          showVisualization={showVisualization}
          visualization={visualization}
          onUndo={onUndo}
          onRollback={onRollback}
          onCommitsSelect={onCommitsSelect}
          onDetailsLevelChange={this.onDetailsLevelChange}
          onChangeShowVisualization={this.props.onChangeShowVisualization}
        />
        {error
          ? <Error message={error} />
          : <CommitDetails
              commit={commit}
              detailsLevel={detailsLevel}
              diff={diff}
              isLoading={isLoading}
            />
        }
      </tbody>
    );
  }

}
