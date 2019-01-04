import React from 'react';
import './Detail.css';
import '../notfound/NotFound.css';
import { API_URL } from '../../config';
import { handleResponse, renderChangePorcent } from '../../helpers';
import { Link } from 'react-router-dom';
import Loading from '../common/Loading';

class Detail extends React.Component {

    constructor () {
        super();

        this.state = {
            currency: {},
            error: false,
            loading: false,
        };
    }

    componentDidMount = () => {
        const currentyId = this.props.match.params.id;
        this.fetchCurrency(currentyId);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            const newCurrencyId = nextProps.match.params.id;
            this.fetchCurrency(newCurrencyId);
            
        }
    }

    fetchCurrency(currentyId) {
        this.setState({ loading: true });
        fetch(`${API_URL}/cryptocurrencies/${currentyId}`)
        .then(handleResponse)
        .then((currency) => {
            this.setState({ currency: currency, loading: false, error: false})
        })
        .catch((error) => {
            this.setState({ loading: false, error: true });
        });
    }
      
    render () {
        const { loading, currency, error } = this.state;
        if (loading) {
            return  <div className="loading-container"><Loading /></div>
        }
        if (error) {
            return (
                <div className="NotFound">
                    <h1 className="NotFound-title">Currency with given id not found.</h1>
                    <Link to="/" className="NotFound-link">Go to homepage</Link>    
                </div>
            )
        }
        return (
            <div className="Detail">
                <h1 className="Detail-heading">
                    {currency.name} ({currency.symbol})
                </h1>
                <div className="Detail-container">
                    <div className="Detail-item">
                        Price <span className="Detail-value">$ {currency.price}</span>
                    </div>
                    <div className="Detail-item">
                        Rank <span className="Detail-value">{currency.rank}</span>
                    </div>   
                    <div className="Detail-item">
                        24HourChange <span className="Detail-value">{renderChangePorcent(currency.percentChange24h)}</span>
                    </div>             
                    <div className="Detail-item">
                        <span className="Detail-title">Market cap</span>
                        <span className="Detail-dollar">$</span>
                        {currency.marketCap}
                    </div>                    
                    <div className="Detail-item">
                        <span className="Detail-title">24H Volume</span>
                        <span className="Detail-dollar">$</span>
                        {currency.volume24h}
                    </div>                    
                    <div className="Detail-item">
                        <span className="Detail-title">Total supply</span>
                        <span className="Detail-dollar">$</span>
                        {currency.totalSupply}
                    </div>                  
                </div>
            </div>
        );
    }
}

export default Detail;