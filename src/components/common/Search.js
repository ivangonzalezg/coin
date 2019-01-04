import React, { Component } from 'react';
import { API_URL } from '../../config';
import { handleResponse} from '../../helpers';
import Loading from './Loading';
import { withRouter } from 'react-router-dom'
import './Search.css'

export class Search extends Component {
    constructor() {
        super();

        this.state = {
            searchResults: [],
            searchQuery: '',
            loading: false
        }
    }

    handleChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        this.setState({ [inputName]: inputValue})
         
        if (!inputValue) {
            return '';
        }

        this.setState({ loading: true});

        fetch(`${API_URL}/autocomplete?searchQuery=${inputValue}`)
        .then(handleResponse)
        .then((data) => {
            this.setState({ loading: false, searchResults: data });
        })
        .catch((error) => {
            this.setState({ error: error.errorMessage,loading: false });
        });
    }

    handleRedirect = (currencyId) => {
        this.setState({ searchQuery: '', searchResults: [] })
        this.props.history.push(`/currency/${currencyId}`)
    }

    renderSearchResults() {
        const { searchResults, searchQuery, loading } =this.state;
        if (!searchQuery){
            return '';
        }
        if (searchResults.length > 0) {
            return (
                <div className="Search-result-container">
                    {searchResults.map(result => (
                        <div key={result.id} className="Search-result" onClick={() => this.handleRedirect(result.id)} >
                            {result.name} ({result.symbol})
                        </div>
                    ))}
                </div>
            )
        }
        if (!loading) {
            return (
                <div className="Search-result-container">
                    <div className="Search-no-result">
                        No results found.
                    </div>
                </div>
            )
        }
    }

    render() {
        const { loading, searchQuery } = this.state; 
        return (
            <div className="Search">
                <span className="Search-icon"></span>
                <input className="Search-input" type="text" name="searchQuery" onChange={this.handleChange} placeholder="Currency name" value={searchQuery}/>
                {loading &&
                    <div className="Search-loading"><Loading width='12px' height='12px' /></div>
                }
                {this.renderSearchResults()}
            </div>
        )
    }
}

export default withRouter(Search);
