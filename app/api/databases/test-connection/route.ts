import { type NextRequest, NextResponse } from "next/server"
import { createDatabaseConnection } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { connectionString, dbType } = await request.json()

    if (!connectionString || !dbType) {
      return NextResponse.json({ error: "Faltan parámetros requeridos: connectionString, dbType" }, { status: 400 })
    }

    const startTime = Date.now()

    // Intentar crear conexión
    const connection = await createDatabaseConnection(dbType, connectionString)

    // Probar la conexión con una consulta simple
    await connection.executeQuery("SELECT 1 as test")

    // Cerrar la conexión
    await connection.close()

    const connectionTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      message: "Conexión exitosa",
      connectionTime,
      dbType,
    })
  } catch (error) {
    console.error("Error probando conexión:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      },
      { status: 500 },
    )
  }
}
