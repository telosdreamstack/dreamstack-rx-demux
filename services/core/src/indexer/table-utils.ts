import { chaingraph_table_registry } from './whitelists'
import { EosioReaderTableRowsStreamData } from '@blockmatic/eosio-ship-reader'

export const getTableRegistry = (row: EosioReaderTableRowsStreamData) => {
  const table_registry = chaingraph_table_registry.find(
    ({ code, scope, table }) => {
      return code === row.code && scope === row.scope && table === row.table
    },
  )
  if (!table_registry) {
    throw new Error('No table registry found, something is not right')
  }
  return table_registry
}

export const getPrimaryKey = (row: EosioReaderTableRowsStreamData) => {
  const table_registry = getTableRegistry(row)

  let primary_key: string

  switch (table_registry.table_key) {
    case 'singleton':
      primary_key = 'singleton'
      break

    case 'standard_token':
      primary_key = row.value.balance.split(' ')[1]
      break

    default:
      primary_key = row.value[table_registry.table_key]
      break
  }

  return primary_key
}

export const getChainGraphTableRowData = (
  row: EosioReaderTableRowsStreamData,
) => {
  const variables = {
    chain_id: row.chain_id,
    contract: row.code,
    table: row.table,
    scope: row.scope,
    primary_key: getPrimaryKey(row),
    data: row.value,
  }

  return variables
}