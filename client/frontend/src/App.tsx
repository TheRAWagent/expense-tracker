import { useEffect, useState } from 'react'
import './App.css'
import DateTimePicker from 'react-datetime-picker'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/index';

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function App(): JSX.Element {
  const [transactions, setTransactions] = useState<{ name: string, date: string, description: string, price: number }[]>([])
  const APIURL: string = import.meta.env.VITE_API_URL
  const [balance, setBalance] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [date, setDate] = useState<Date>(new Date())
  const [description, setDescription] = useState<string>('')
  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: APIURL,
        fetch(url, options) {
          return fetch(url, { ...options, });
        },
      }),
    ],
  });
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
  const getData = async () => {
    try {
      const data: any = await client.getTransactions.query();
      setTransactions(data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data: any = await client.addTransaction.query({
        name: name,
        date: date.toISOString(),
        description: description
      });
      // console.log(data);
      setTransactions(data);
      setName('')
      setDate(new Date())
      setDescription('')
    }
    catch (err) {
      console.log(err);
    }
  }
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
            <DateTimePicker value={date} onChange={date => setDate(date ? date : new Date())} className="expenseDate" />
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