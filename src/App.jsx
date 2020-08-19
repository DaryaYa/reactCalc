import React from 'react';
import './App.css';
import History from './Components/history/History';
import Total from './Components/total/Total';
import Operation from './Components/operation/Operation';

class App extends React.Component {
  state = {
    transactions: JSON.parse(localStorage.getItem('calcMoney')) || [],
    description: "",
    amount: "",
    resultIncome: 0,
    resultExpanses: 0,
    total: 0,
  };

  componentDidMount() {
    this.getTotalBalance();
  }

  componentDidUpdate() {
    this.addLocalStorage();
  }

  addTransaction = (flag) => {
    const transactions = [...this.state.transactions];
    const transaction = {
      id: +`${Date.now()}`,
      description: this.state.description,
      amount: this.state.amount,
      flag,
    };

    transactions.push(transaction);

    this.setState(
      {
        transactions,
        description: "",
        amount: "",
      }, this.getTotalBalance)  
  };

  addAmount = (e) => {
    this.setState({
      amount: parseFloat(e.target.value),
    });
  };

  addDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  getIncome = () =>
    this.state.transactions.reduce(
      (acc, item) => (item.flag ? acc + item.amount : acc),
      0
    );

  getExpenses = () =>
    this.state.transactions.reduce(
      (acc, item) => (!item.flag ? acc + item.amount : acc),
      0
    );

  getTotalBalance() {
    const resultIncome = this.getIncome();
    const resultExpanses = this.getExpenses();

    const total = resultIncome - resultExpanses;

    this.setState({
      resultIncome,
      resultExpanses,
      total,
    })
  }

  addLocalStorage = () => {
    localStorage.setItem('calcMoney', JSON.stringify(this.state.transactions));
  }

  delTransaction = key => {
   const transactions = this.state.transactions.filter(item => item.id !== key);
   this.setState({ transactions }, this.getTotalBalance);
  }

  render() {
    return (
      <>
        <header>
          <h1>Кошелек</h1>
          <h2>Калькулятор расходов</h2>
        </header>

        <main>
          <div className="container">
            <Total
              resultIncome={this.state.resultIncome}
              resultExpanses={this.state.resultExpanses}
              total={this.state.total}
            />
            <History
              transactions={this.state.transactions}
              delTransaction={this.delTransaction}
            />
            <Operation
              addTransaction={this.addTransaction}
              addAmount={this.addAmount}
              addDescription={this.addDescription}
              description={this.state.description}
              amount={this.state.amount}
            />
          </div>
        </main>
      </>
    );
  }
}

export default App;
