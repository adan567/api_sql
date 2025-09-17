export interface DatabaseConnection {
  executeQuery(query: string): Promise<any[]>
  close(): Promise<void>
}

class PostgreSQLConnection implements DatabaseConnection {
  private client: any

  constructor(connectionString: string) {
    const { Client } = require("pg")
    this.client = new Client({ connectionString })
  }

  async executeQuery(query: string): Promise<any[]> {
    await this.client.connect()
    const result = await this.client.query(query)
    return result.rows
  }

  async close(): Promise<void> {
    await this.client.end()
  }
}

class MySQLConnection implements DatabaseConnection {
  private connection: any

  constructor(connectionString: string) {
    const mysql = require("mysql2/promise")
    // Parse connection string for MySQL
    const url = new URL(connectionString.replace("mysql://", "http://"))
    this.connection = mysql.createConnection({
      host: url.hostname,
      port: Number.parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    })
  }

  async executeQuery(query: string): Promise<any[]> {
    const [rows] = await this.connection.execute(query)
    return rows as any[]
  }

  async close(): Promise<void> {
    await this.connection.end()
  }
}

class SQLiteConnection implements DatabaseConnection {
  private db: any

  constructor(connectionString: string) {
    const sqlite3 = require("sqlite3").verbose()
    // Extract database path from connection string
    const dbPath = connectionString.replace("sqlite://", "").replace("sqlite3://", "")
    this.db = new sqlite3.Database(dbPath)
  }

  async executeQuery(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, [], (err: any, rows: any[]) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

class SQLServerConnection implements DatabaseConnection {
  private connection: any
  private config: any

  constructor(connectionString: string) {
    const { ConnectionPool } = require("tedious")
    // Parse SQL Server connection string
    const url = new URL(connectionString.replace("mssql://", "http://"))
    this.config = {
      server: url.hostname,
      port: Number.parseInt(url.port) || 1433,
      authentication: {
        type: "default",
        options: {
          userName: url.username,
          password: url.password,
        },
      },
      options: {
        database: url.pathname.slice(1),
        encrypt: true,
        trustServerCertificate: true,
      },
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    const { ConnectionPool, Request } = require("tedious")
    const pool = new ConnectionPool(this.config)

    return new Promise((resolve, reject) => {
      pool.on("connect", () => {
        const request = new Request(query, (err: any) => {
          if (err) {
            reject(err)
          }
        })

        const rows: any[] = []
        request.on("row", (columns: any[]) => {
          const row: any = {}
          columns.forEach((column) => {
            row[column.metadata.colName] = column.value
          })
          rows.push(row)
        })

        request.on("requestCompleted", () => {
          resolve(rows)
          pool.close()
        })

        pool.execSql(request)
      })

      pool.on("connectFailed", (err: any) => {
        reject(err)
      })

      pool.connect()
    })
  }

  async close(): Promise<void> {
    // Connection is closed in executeQuery for SQL Server
    return Promise.resolve()
  }
}

export async function createDatabaseConnection(dbType: string, connectionString: string): Promise<DatabaseConnection> {
  switch (dbType.toLowerCase()) {
    case "postgresql":
    case "postgres":
      return new PostgreSQLConnection(connectionString)

    case "mysql":
      return new MySQLConnection(connectionString)

    case "sqlite":
    case "sqlite3":
      return new SQLiteConnection(connectionString)

    case "mssql":
    case "sqlserver":
      return new SQLServerConnection(connectionString)

    default:
      throw new Error(`Tipo de base de datos no soportado: ${dbType}`)
  }
}
