"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Play, Download, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function TestingPage() {
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;")
  const [connectionString, setConnectionString] = useState("")
  const [dbType, setDbType] = useState("postgresql")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExecuteQuery = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          connectionString,
          dbType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error ejecutando la consulta")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCSV = () => {
    if (!result?.csvData) return

    const blob = new Blob([result.csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `query-result-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error copiando al portapapeles:", err)
    }
  }

  const exampleQueries = [
    {
      name: "Consulta básica",
      query: "SELECT * FROM users LIMIT 10;",
      description: "Obtiene los primeros 10 usuarios",
    },
    {
      name: "Consulta con JOIN",
      query: "SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id LIMIT 5;",
      description: "Une usuarios con sus posts",
    },
    {
      name: "Agregación",
      query: "SELECT COUNT(*) as total_users, AVG(age) as avg_age FROM users;",
      description: "Estadísticas de usuarios",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold text-foreground">SQLtoCSV API</h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Inicio
              </Link>
              <Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors">
                Documentación
              </Link>
              <span className="text-accent font-medium">Pruebas</span>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Interfaz de Pruebas</h2>
          <p className="text-muted-foreground text-lg">
            Prueba la API SQLtoCSV ejecutando consultas SQL y exportando los resultados a CSV
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Query Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configuración de Conexión
                </CardTitle>
                <CardDescription>Configura los parámetros de tu base de datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dbType">Tipo de Base de Datos</Label>
                    <Select value={dbType} onValueChange={setDbType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="sqlite">SQLite</SelectItem>
                        <SelectItem value="mssql">SQL Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="connectionString">Cadena de Conexión</Label>
                    <Input
                      id="connectionString"
                      type="password"
                      placeholder="postgresql://user:pass@host:port/db"
                      value={connectionString}
                      onChange={(e) => setConnectionString(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Consulta SQL
                </CardTitle>
                <CardDescription>Escribe tu consulta SQL aquí</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="SELECT * FROM table_name LIMIT 10;"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-32 font-mono"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleExecuteQuery} disabled={isLoading || !query || !connectionString}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ejecutando...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Ejecutar Consulta
                      </>
                    )}
                  </Button>
                  {result && (
                    <Button variant="outline" onClick={handleDownloadCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar CSV
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {(result || error) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {error ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    Resultado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : (
                    <Tabs defaultValue="preview" className="w-full">
                      <TabsList>
                        <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                        <TabsTrigger value="csv">CSV</TabsTrigger>
                        <TabsTrigger value="json">JSON</TabsTrigger>
                      </TabsList>
                      <TabsContent value="preview" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{result?.rowCount || 0} filas</Badge>
                          <Badge variant="outline">{result?.executionTime || 0}ms</Badge>
                        </div>
                        {result?.data && result.data.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-border">
                              <thead>
                                <tr className="bg-muted">
                                  {Object.keys(result.data[0]).map((key) => (
                                    <th key={key} className="border border-border p-2 text-left font-medium">
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {result.data.slice(0, 10).map((row: any, index: number) => (
                                  <tr key={index} className="hover:bg-muted/50">
                                    {Object.values(row).map((value: any, cellIndex) => (
                                      <td key={cellIndex} className="border border-border p-2">
                                        {String(value)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {result.data.length > 10 && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Mostrando 10 de {result.data.length} filas
                              </p>
                            )}
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="csv">
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">{result?.csvData}</pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-transparent"
                            onClick={() => copyToClipboard(result?.csvData || "")}
                          >
                            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="json">
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                            {JSON.stringify(result?.data, null, 2)}
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-transparent"
                            onClick={() => copyToClipboard(JSON.stringify(result?.data, null, 2))}
                          >
                            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Examples Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultas de Ejemplo</CardTitle>
                <CardDescription>Haz clic para usar estas consultas de ejemplo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {exampleQueries.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 border border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setQuery(example.query)}
                  >
                    <h4 className="font-medium text-sm">{example.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{example.description}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-2 block">{example.query}</code>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Las credenciales no se almacenan</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Conexión directa desde tu backend</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Consultas ejecutadas de forma segura</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
