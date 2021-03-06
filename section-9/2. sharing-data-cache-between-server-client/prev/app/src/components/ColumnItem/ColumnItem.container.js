import React from 'react';
import { connect } from 'react-redux';
import ColumnItem from 'components/ColumnItem/ColumnItem';
import { addTeam, setActiveTeam, updateTeamName } from 'src/team/team';
import { createMemberAndDetails, updateMemberName } from 'src/member/member';
import { setActiveLeague, updateLeagueName } from 'src/league/league';
import debounce from 'lodash/debounce';
import cache from 'src/cache.service';

function mapStateToProps(state, ownProps) {
  const { type, items } = ownProps.data;
  const id = items[ownProps.index];
  const item = cache.get(`${type}s`, id);
  const activeId = state[type].active;
  return { item, type, id, activeId };
}

const mapDispatchToProps = {
  addTeam,
  setActiveTeam,
  updateTeamName,
  setActiveLeague,
  updateLeagueName,
  updateMemberName,
  addMember: createMemberAndDetails
};

class ColumnItemContainer extends React.PureComponent {
  addItem = (item, type) => {
    const { addMember, addTeam } = this.props;

    if (type === 'team') {
      addMember({ teamId: item.id });
    } else if (type === 'league') {
      addTeam({ leagueId: item.id });
    }
  };

  setActiveItem = (item, type) => {
    if (type === 'team') {
      this.props.setActiveTeam(item);
    } else if (type === 'league') {
      this.props.setActiveLeague(item);
    }
  };

  updateName = debounce((name, item, type) => {
    if (type === 'member') {
      this.props.updateMemberName(name, item.id);
    } else if (type === 'team') {
      this.props.updateTeamName(name, item.id);
    } else if (type === 'league') {
      this.props.updateLeagueName(name, item.id);
    }
  }, 100);

  render() {
    return (
      <ColumnItem
        {...this.props}
        key={this.props.type + this.props.id}
        updateName={this.updateName}
        addItem={this.props.type !== 'member' && this.addItem}
        setActiveItem={this.props.type !== 'member' && this.setActiveItem}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnItemContainer);
