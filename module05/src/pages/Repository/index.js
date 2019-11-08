import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';

import { Loading, Owner } from './styles';

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

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img
            src={repositories.owner.avatar_url}
            alt={repositories.owner.login}
          />
          <h1>{repositories.name}</h1>
          <p>{repositories.description}</p>
        </Owner>
      </Container>
    );
  }
}
