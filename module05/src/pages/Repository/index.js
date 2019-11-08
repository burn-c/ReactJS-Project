import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repositories: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repositories: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repositories);

    const [repositories, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`),
      {
        params: {
          state: 'open',
          per_page: 5,
        },
      },
    ]);

    this.setState({
      repositories: repositories.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repositories, issues, loading } = this.state;
    return <h1>Repository</h1>;
  }
}
