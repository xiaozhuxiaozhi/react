import React, {Fragment, Placeholder, PureComponent} from 'react';
import {unstable_deferredUpdates} from 'react-dom';
import {createResource} from 'simple-cache-provider';
import {cache} from '../cache';
import Spinner from './Spinner';
import ContributorListPage from './ContributorListPage';

const UserPageResource = createResource(() => import('./UserPage'));

function UserPageLoader(props) {
  const UserPage = UserPageResource.read(cache).default;
  return <UserPage {...props} />;
}

export default class App extends PureComponent {
  state = {
    currentId: null,
    showDetail: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.showDetail !== this.state.showDetail ||
      prevState.currentId !== this.state.currentId
    ) {
      window.scrollTo(0, 0);
    }
  }

  handleUserClick = id => {
    this.setState({
      currentId: id,
    });
    unstable_deferredUpdates(() => {
      this.setState({
        showDetail: true,
      });
    });
  };

  handleBackClick = () =>
    this.setState({
      currentId: null,
      showDetail: false,
    });

  render() {
    const {currentId, showDetail} = this.state;
    return showDetail
      ? this.renderDetail(currentId)
      : this.renderList(currentId);
  }

  renderDetail(id) {
    return (
      <div>
        <button
          onClick={this.handleBackClick}
          style={{
            display: 'block',
            marginBottom: '1rem',
          }}>
          Return to list
        </button>
        <Placeholder delayMs={2000} fallback={<Spinner size="large" />}>
          <UserPageLoader id={id} />
        </Placeholder>
      </div>
    );
  }

  renderList(loadingId) {
    return (
      <Placeholder delayMs={1500} fallback={<Spinner size="large" />}>
        <ContributorListPage
          loadingId={loadingId}
          onUserClick={this.handleUserClick}
        />
      </Placeholder>
    );
  }
}
