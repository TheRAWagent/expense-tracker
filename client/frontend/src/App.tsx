import { useEffect, useState} from 'react'
import './App.css'

function App(): JSX.Element {
  const [transactions, setTransactions] = useState<{ name: string, date: string, description: string, price: number }[]>([])
  const APIURL: string = import.meta.env.VITE_API_URL
  const [balance, setBalance] = useState<number>(0)
  useEffect(() => {
    getData()
  }, [])
  useEffect(() => {
    let total = 0
    transactions.forEach(transaction => {
      total += transaction.price
    })
    setBalance(total)
  }
  , [transactions])
    const getData=async ()=>{
      await fetch(`${APIURL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => setTransactions(data))
    }

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetch(`${APIURL}/addTransaction`, {
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
      .then(async data => {
        setName('')
        setDate(new Date())
        setDescription('')
        setTransactions(data)
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
              type="datetime"
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