/// <reference path='./Commits.d.ts' />

import * as React from 'react';

import CommitsTableRowSummary from './CommitsTableRowSummary.react';
import CommitsTableRowDetails from './CommitsTableRowDetails.react';

interface CommitsTableRowProps extends React.Props<JSX.Element> {
  commit: Commit;
  enableActions: boolean;
  isSelected: boolean;
  onUndo: React.MouseEventHandler;
  onRollback: React.MouseEventHandler;
  onCommitSelect: (commits: Commit[], check: boolean, shiftKey: boolean) => void;
  diffProvider: {getDiff: (hash: string) => Promise<string>};
}

interface CommitsTableRowState {
  detailsLevel?: string;
  diff?: string;
  error?: string;
  isLoading?: boolean;
}

export default class CommitsTableRow extends React.Component<CommitsTableRowProps, CommitsTableRowState> {

  state = {
    detailsLevel: 'none',
    diff: null,
    error: null,
    isLoading: false
  }

  onDetailsLevelChange = (detailsLevel: string) => {
    if (detailsLevel === 'full-diff' && !this.state.diff) {
      this.setState({
        isLoading: true
      });

      this.props.diffProvider.getDiff(this.props.commit.hash)
        .then(diff => this.setState(
          {
            detailsLevel: detailsLevel,
            diff: diff,
            error: null,
            isLoading: false,
          })
        ).catch(err => {
        this.setState({
          detailsLevel: detailsLevel,
          error: err.message,
          isLoading: false
        });
      });
    } else {
      this.setState({
        detailsLevel: detailsLevel,
        error: null,
        isLoading: false
      });
    }
  };

  renderError() {
    return (
      <tr className='details-row error'>
        <td colSpan={6}>{this.state.error}</td>
      </tr>
    );
  }

  render() {
    return (
      <tbody>
        <CommitsTableRowSummary
          commit={this.props.commit}
          enableActions={this.props.enableActions}
          isSelected={this.props.isSelected}
          onUndo={this.props.onUndo}
          onRollback={this.props.onRollback}
          onCommitSelect={this.props.onCommitSelect}
          onDetailsLevelChanged={this.onDetailsLevelChange}
          detailsLevel={this.state.detailsLevel}
        />
        {this.state.error
          ? this.renderError()
          : <CommitsTableRowDetails
              commit={this.props.commit}
              detailsLevel={this.state.detailsLevel}
              diff={this.state.diff}
              isLoading={this.state.isLoading}
            />
        }
      </tbody>
    );
  }

}
