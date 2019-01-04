import React from 'react';
import Loading from '../common/Loading';
import { handleResponse } from '../../helpers';
import { API_URL } from '../../config';
import Table from './Table';
import Pagination from './Pagination'

class List extends React.Component {
  constructor () {
    super();

    this.state = {
      loading: false,
      currencies: [],
      error: null,
      totalPages: 0,
      page: 1,
    };
  }

  componentDidMount() {
    this.fetchCurrencies();
  }

  fetchCurrencies(){
    this.setState({ loading: true });
    const { page } = this.state;
    fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
      .then(handleResponse)
      .then((data) => {
        this.setState({ currencies: data.currencies,loading: false, totalPages: data.totalPages });
      })
      .catch((error) => {
        this.setState({ error: error.errorMessage,loading: false });
      });
  }

  handlePaginationClick = (direction) => {
    let nextPage = this.state.page;

    nextPage = direction === 'next' ? nextPage + 1 : nextPage - 1;

    this.setState({ page: nextPage}, () => {this.fetchCurrencies()})
  }

  render() {
    const { loading, currencies, page, totalPages} = this.state;
    if (loading) {
      return <div className="loading-container"><Loading width='28px' height='28px' /></div>
    }
    return (
      <div>
        <Table currencies={currencies}/>
        <Pagination page={page} totalPages={totalPages} handlePaginationClick={this.handlePaginationClick}/>
      </div>
    )
  }
}

export default List;
