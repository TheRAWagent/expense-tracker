import { useState, useEffect } from 'react'
import './App.css'

function App(): JSX.Element {
  const [transactions, setTransactions] = useState<{ name: string, date: string, description: string, price: number }[]>([])
  const APIURL: string = import.meta.env.VITE_API_URL
  const [balance, setBalance] = useState<number>(0)
  useEffect(() => {
    fetch(`${APIURL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setTransactions(data)
        let sum: number = 0
        transactions.forEach((transaction) => {
          sum += transaction.price
        })
        setBalance(sum)
      })
  }, [])

  const sendData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    fetch(`${APIURL}/addTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        date: date,
        description: description
      })
    })
      .then(res => res.json())
      .then(data => {
        setName('')
        setDate(new Date())
        setDescription('')
        setTransactions(data)
        let sum: number = 0
        transactions.forEach((transaction) => {
          sum += transaction.price
        })
        setBalance(sum)
      })
  }
  const [name, setName] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())
  const [description, setDescription] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'transactionName': setName(e.target.value); break;
      case 'transactionDate': setDate(new Date(e.target.value)); break;
      case 'txnDescription': setDescription(e.target.value); break;
    }
  }
  return (
    <main>
      <div>
        <h1 className='head'>
          <div>
            ⁴₀⁴
          </div>
          <div style={{ color: balance >= 0 ? 'green' : 'red' }}>
            {balance >= 0 ? `₹${balance}` : `-₹${-balance}`}
          </div>
        </h1>
        <form method='POST' onSubmit={sendData}>
          <div className='basic'>
            <input className='expenseName' type="text" name="transactionName" value={name} onChange={handleChange} id="" placeholder='name' />
            <input
              className='expenseDate'
              type="datetime-local"
              name="transactionDate"
              value={date.toISOString().slice(0, 16)}
              onChange={handleChange}
              placeholder='date'
            />
          </div>
          <div className='addDescription'>
            <input type="text" name="txnDescription" id="" placeholder='Description' value={description} onChange={handleChange} />
          </div>
          <div className="addTxnWrapper">
            <button className='addTxnBtn' type="submit">
              <div className="addTxn">Add a new Transaction</div>
            </button>
          </div>
        </form>
        <div className="transactions">
          {transactions.length > 0 && transactions.map((transaction, index) => {
            return (
              <div className="transaction" key={index}>
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className="price"
                    style={{ color: `${transaction.price < 0 ? "red" : "green"}` }}
                  >
                    {transaction.price >= 0 ? "+₹" : "₹"}{transaction.price}</div>
                  <div className="datetime">{`${new Date(transaction.date).toLocaleString()}`}</div>
                </div>
              </div>
            )

          }
          )}
        </div>
      </div>
    </main>
  )
}

export default App