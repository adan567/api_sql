export function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return ""
  }

  // Obtener las columnas del primer registro
  const columns = Object.keys(data[0])

  // Crear el header del CSV
  const header = columns.map((col) => escapeCSVField(col)).join(",")

  // Crear las filas del CSV
  const rows = data.map((row) => columns.map((col) => escapeCSVField(row[col])).join(","))

  // Combinar header y filas
  return [header, ...rows].join("\n")
}

function escapeCSVField(field: any): string {
  if (field === null || field === undefined) {
    return ""
  }

  const stringField = String(field)

  // Si el campo contiene comas, comillas o saltos de línea, debe ir entre comillas
  if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
    // Escapar las comillas duplicándolas
    const escapedField = stringField.replace(/"/g, '""')
    return `"${escapedField}"`
  }

  return stringField
}

export function downloadCSV(csvData: string, filename = "export.csv"): void {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function validateCSVData(data: any[]): { isValid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { isValid: false, error: "Los datos deben ser un array" }
  }

  if (data.length === 0) {
    return { isValid: false, error: "No hay datos para exportar" }
  }

  // Verificar que todos los registros tengan la misma estructura
  const firstRowKeys = Object.keys(data[0])
  for (let i = 1; i < data.length; i++) {
    const currentRowKeys = Object.keys(data[i])
    if (currentRowKeys.length !== firstRowKeys.length || !currentRowKeys.every((key) => firstRowKeys.includes(key))) {
      return {
        isValid: false,
        error: `Inconsistencia en la estructura de datos en la fila ${i + 1}`,
      }
    }
  }

  return { isValid: true }
}
