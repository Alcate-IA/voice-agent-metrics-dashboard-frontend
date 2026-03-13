import styles from '../styles/Dashboard.module.css'

/**
 * Dashboard header with customer/agent dropdowns and last-update timestamp.
 *
 * Props:
 *   customers           {Array<{id:number|string, name:string}>}
 *   agents              {Array<{id:number|string, name:string}>}
 *   selectedCustomerId  {number|string|null}
 *   selectedAgentId     {number|string|null}
 *   onCustomerChange    {(id: string) => void}
 *   onAgentChange       {(id: string) => void}
 *   lastUpdate          {Date|null}
 */
function Header({
  customers = [],
  agents = [],
  selectedCustomerId,
  selectedAgentId,
  onCustomerChange,
  onAgentChange,
  lastUpdate,
}) {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Voice Agent Metrics</h1>

      <div className={styles.headerControls}>
        <label htmlFor="customer-select" className={styles.selectLabel}>
          Customer
          <select
            id="customer-select"
            className={styles.select}
            value={selectedCustomerId ?? ''}
            onChange={(e) => onCustomerChange(e.target.value)}
            aria-label="Select customer"
          >
            <option value="">All customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="agent-select" className={styles.selectLabel}>
          Agent
          <select
            id="agent-select"
            className={styles.select}
            value={selectedAgentId ?? ''}
            onChange={(e) => onAgentChange(e.target.value)}
            aria-label="Select agent"
            disabled={!selectedCustomerId}
          >
            <option value="">All agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {lastUpdate && (
        <span className={styles.headerLastUpdate}>
          Updated: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </header>
  )
}

export default Header
