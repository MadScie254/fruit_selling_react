import { useState } from 'react'
import './App.css'

function App() {
  const [cart, setCart] = useState([])

  const fruits = [
    { id: 1, name: 'Apple', price: 2.99, emoji: '🍎' },
    { id: 2, name: 'Banana', price: 1.99, emoji: '🍌' },
    { id: 3, name: 'Orange', price: 3.49, emoji: '🍊' },
    { id: 4, name: 'Strawberry', price: 4.99, emoji: '🍓' },
    { id: 5, name: 'Grape', price: 3.99, emoji: '🍇' },
    { id: 6, name: 'Watermelon', price: 6.99, emoji: '🍉' },
  ]

  const addToCart = (fruit) => {
    setCart([...cart, fruit])
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const total = cart.reduce((sum, fruit) => sum + fruit.price, 0)

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 Fruit Market</h1>
        <p className="subtitle">Fresh fruits delivered to your door</p>
      </header>

      <div className="container">
        <section className="fruits-section">
          <h2>Available Fruits</h2>
          <div className="fruits-grid">
            {fruits.map((fruit) => (
              <div key={fruit.id} className="fruit-card">
                <div className="fruit-emoji">{fruit.emoji}</div>
                <h3>{fruit.name}</h3>
                <p className="price">${fruit.price.toFixed(2)}</p>
                <button onClick={() => addToCart(fruit)} className="add-btn">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <aside className="cart-section">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <span>{item.emoji} {item.name}</span>
                    <div className="item-controls">
                      <span className="item-price">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="total">
                  <strong>Total:</strong>
                  <strong className="total-amount">${total.toFixed(2)}</strong>
                </div>
                <button className="checkout-btn">Checkout</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

export default App
