import { type NextRequest, NextResponse } from "next/server"
import { createDatabaseConnection } from "@/lib/database"
import { convertToCSV } from "@/lib/csv-utils"

export async function POST(request: NextRequest) {
  try {
    const { query, connectionString, dbType } = await request.json()

    // Validar parámetros requeridos
    if (!query || !connectionString || !dbType) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: query, connectionString, dbType" },
        { status: 400 },
      )
    }

    // Validar que la consulta sea de tipo SELECT (por seguridad)
    const trimmedQuery = query.trim().toLowerCase()
    if (!trimmedQuery.startsWith("select")) {
      return NextResponse.json({ error: "Solo se permiten consultas SELECT por razones de seguridad" }, { status: 400 })
    }

    const startTime = Date.now()

    // Crear conexión a la base de datos
    const connection = await createDatabaseConnection(dbType, connectionString)

    // Ejecutar la consulta
    const data = await connection.executeQuery(query)

    // Cerrar la conexión
    await connection.close()

    const executionTime = Date.now() - startTime

    // Convertir los datos a CSV
    const csvData = convertToCSV(data)

    return NextResponse.json({
      data,
      csvData,
      rowCount: data.length,
      executionTime,
      success: true,
    })
  } catch (error) {
    console.error("Error ejecutando consulta SQL:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor",
        success: false,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "SQLtoCSV API - Endpoint para ejecutar consultas SQL",
    version: "1.0.0",
    methods: ["POST"],
    requiredFields: ["query", "connectionString", "dbType"],
    supportedDatabases: ["postgresql", "mysql", "sqlite", "mssql"],
  })
}
