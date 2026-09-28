import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Apple, ArrowDownToLine, Check, ChevronDown, Flower2, Leaf, Plus, Search, ShoppingBasket, Sparkles, Trash2, X } from 'lucide-react'
import { initialItems } from './data/initialItems'
import { categories, type Category, type ShoppingItem } from './types/shopping'
import './App.css'

type Filter = 'Tudo' | Category
const storageKey = 'flor-de-feira-items'
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function loadItems(): ShoppingItem[] {
  try {
    const savedItems = localStorage.getItem(storageKey)
    return savedItems ? JSON.parse(savedItems) as ShoppingItem[] : initialItems
  } catch {
    return initialItems
  }
}

function App() {
  const [items, setItems] = useState<ShoppingItem[]>(loadItems)
  const [activeFilter, setActiveFilter] = useState<Filter>('Tudo')
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1 un')
  const [category, setCategory] = useState<Category>('Hortifruti')
  const [price, setPrice] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(items)), [items])

  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesCategory = activeFilter === 'Tudo' || item.category === activeFilter
    return matchesCategory && item.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
  }), [activeFilter, items, search])

  const remainingItems = items.filter((item) => !item.purchased)
  const total = remainingItems.reduce((sum, item) => sum + item.price, 0)
  const purchasedCount = items.length - remainingItems.length

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    const parsedPrice = Number(price.replace(',', '.')) || 0
    setItems((current) => [{ id: crypto.randomUUID(), name: name.trim(), quantity: quantity.trim() || '1 un', category, price: parsedPrice, purchased: false }, ...current])
    setName('')
    setPrice('')
    setQuantity('1 un')
    setFormOpen(false)
  }

  function togglePurchased(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, purchased: !item.purchased } : item))
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Flor de Feira, início"><span className="brand-mark"><Flower2 size={23} strokeWidth={1.7} /></span><span>flor de feira<span className="brand-dot">.</span></span></a>
        <div className="topbar-right"><span className="today-label">SEGUNDA-FEIRA, 28 SET</span><span className="avatar">B</span></div>
      </header>

      <section className="welcome" id="inicio">
        <div className="welcome-copy">
          <p className="eyebrow"><Sparkles size={14} /> SUA SEMANA, MAIS LEVE</p>
          <h1>Uma lista bonita,<br /><em>uma vida mais leve.</em></h1>
          <p className="welcome-subtitle">O que falta na despensa? Organize suas compras com carinho.</p>
          <button className="primary-button welcome-button" type="button" onClick={() => setFormOpen(true)}><Plus size={18} /> Adicionar item</button>
        </div>
        <div className="market-art" aria-label="Ilustração de frutas frescas em uma cesta" role="img">
          <div className="sun-disc" /><div className="market-note"><span>feito com</span><strong>carinho <span className="tiny-heart">♥</span></strong></div>
          <div className="fruit fruit-peach" /><div className="fruit fruit-tomato" /><div className="fruit fruit-lemon" />
          <div className="leaf-shape leaf-one" /><div className="leaf-shape leaf-two" /><div className="leaf-shape leaf-three" />
          <div className="basket"><span /></div><div className="art-caption"><Leaf size={13} /> fresquinho da semana</div>
        </div>
      </section>

      <section className="summary-row" aria-label="Resumo da lista">
        <div className="summary-intro"><span className="summary-icon"><ShoppingBasket size={19} /></span><div><strong>Sua listinha</strong><span>{items.length} {items.length === 1 ? 'item' : 'itens'} no total</span></div></div>
        <div className="summary-stat"><span>AINDA NA LISTA</span><strong>{remainingItems.length.toString().padStart(2, '0')} <small>itens</small></strong></div>
        <div className="summary-stat total-stat"><span>VALOR ESTIMADO</span><strong>{currency.format(total)}</strong></div>
        <div className="progress-stat"><div className="progress-label"><span>PROGRESSO</span><strong>{items.length ? Math.round(purchasedCount / items.length * 100) : 0}%</strong></div><div className="progress-track"><span style={{ width: `${items.length ? purchasedCount / items.length * 100 : 0}%` }} /></div><small>{purchasedCount} de {items.length} comprados</small></div>
      </section>

      <section className="list-section" aria-labelledby="list-heading">
        <div className="list-heading-row"><div><p className="eyebrow section-eyebrow">SEU CANTINHO ORGANIZADO</p><h2 id="list-heading">Lista de compras <span>({remainingItems.length})</span></h2></div>
          <div className="list-actions"><label className="search-field"><Search size={16} /><input aria-label="Buscar item" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar item..." />{search && <button type="button" aria-label="Limpar busca" onClick={() => setSearch('')}><X size={14} /></button>}</label><button className="add-small" type="button" onClick={() => setFormOpen(true)}><Plus size={16} /><span>Novo item</span></button></div>
        </div>

        {formOpen && <form className="add-form" onSubmit={addItem}>
          <label className="form-name">O que vamos comprar?<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Morangos fresquinhos" required /></label>
          <label>Quantidade<input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="1 un" /></label>
          <label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value as Category)}>{categories.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label>Preço (R$)<input inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0,00" /></label>
          <button className="primary-button submit-button" type="submit"><Check size={16} /> Adicionar</button>
          <button className="close-form" type="button" aria-label="Fechar formulário" onClick={() => setFormOpen(false)}><X size={18} /></button>
        </form>}

        <nav className="category-tabs" aria-label="Filtrar por categoria">
          {(['Tudo', ...categories] as Filter[]).map((tab) => <button className={activeFilter === tab ? 'category-tab active' : 'category-tab'} type="button" key={tab} onClick={() => setActiveFilter(tab)}>{tab === 'Hortifruti' && <Apple size={14} />}{tab}<span>{tab === 'Tudo' ? items.length : items.filter((item) => item.category === tab).length}</span></button>)}
          <button className="sort-button" type="button" onClick={() => setItems((current) => [...current].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))}>A–Z <ChevronDown size={14} /></button>
        </nav>

        <div className="shopping-list">
          {visibleItems.length ? visibleItems.map((item) => <article className={item.purchased ? 'shopping-item purchased' : 'shopping-item'} key={item.id}>
            <button className="check-button" type="button" aria-label={item.purchased ? `Desmarcar ${item.name}` : `Marcar ${item.name} como comprado`} onClick={() => togglePurchased(item.id)}>{item.purchased && <Check size={13} />}</button>
            <span className={`item-illustration ${item.category.toLowerCase()}`}><CategoryIcon category={item.category} /></span>
            <div className="item-copy"><strong>{item.name}</strong><span>{item.quantity} <i>·</i> <span className={`category-label ${item.category.toLowerCase()}`}>{item.category}</span></span></div>
            <strong className="item-price">{currency.format(item.price)}</strong>
            <button className="remove-button" type="button" aria-label={`Remover ${item.name}`} onClick={() => removeItem(item.id)}><Trash2 size={16} /></button>
          </article>) : <div className="empty-state"><span><ShoppingBasket size={23} /></span><strong>Nenhum item por aqui</strong><p>{search ? 'Tente outro nome ou limpe a busca.' : 'Adicione algo gostoso para começar sua lista.'}</p>{!search && <button className="text-button" onClick={() => setFormOpen(true)} type="button">Adicionar primeiro item <Plus size={15} /></button>}</div>}
        </div>
        <div className="list-footer"><span><span className="footer-dot" /> Tudo salvo automaticamente</span><button type="button" onClick={() => setItems((current) => current.filter((item) => !item.purchased))} disabled={!purchasedCount}><ArrowDownToLine size={14} /> Limpar comprados</button></div>
      </section>
      <footer className="page-footer"><span>Um carinho para sua rotina <span className="footer-heart">♥</span></span><span>FLOR DE FEIRA · 2026</span></footer>
    </main>
  )
}

function CategoryIcon({ category }: { category: Category }) {
  if (category === 'Hortifruti') return <Apple size={21} strokeWidth={1.5} />
  if (category === 'Padaria') return <span className="bread-icon">⌁</span>
  if (category === 'Mercearia') return <ShoppingBasket size={20} strokeWidth={1.5} />
  if (category === 'Laticínios') return <span className="milk-icon">◡</span>
  return <Flower2 size={20} strokeWidth={1.5} />
}

export default App