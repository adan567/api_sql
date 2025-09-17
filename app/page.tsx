import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Download, Shield, Zap, Code, FileText } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
              <Link href="#documentation" className="text-muted-foreground hover:text-foreground transition-colors">
                Documentación
              </Link>
              <Link href="/testing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pruebas
              </Link>
              <Link href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
                Soporte
              </Link>
              <Button asChild>
                <Link href="#get-started">Comenzar</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            API v1.0 - Disponible ahora
          </Badge>
          <h2 className="text-5xl font-bold text-balance mb-6">
            Ejecuta consultas SQL y exporta a CSV
            <span className="text-accent"> sin compartir credenciales</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto">
            Una API ligera y segura que permite ejecutar consultas SQL sobre tus propias bases de datos y recibir los
            resultados en formato CSV. Funciona con tu conexión existente.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#get-started">
                <Zap className="mr-2 h-5 w-5" />
                Comenzar ahora
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/testing">
                <FileText className="mr-2 h-5 w-5" />
                Probar API
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">¿Por qué elegir SQLtoCSV API?</h3>
            <p className="text-muted-foreground text-lg">
              Diseñada para desarrolladores que valoran la seguridad y la simplicidad
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Seguridad Total</CardTitle>
                <CardDescription>
                  No necesitas compartir credenciales. Usa tu propia conexión de base de datos.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Rápido y Ligero</CardTitle>
                <CardDescription>API optimizada para consultas rápidas y exportación eficiente a CSV.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Code className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Fácil Integración</CardTitle>
                <CardDescription>Se integra perfectamente con cualquier aplicación existente.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Download className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Exportación CSV</CardTitle>
                <CardDescription>
                  Convierte automáticamente los resultados SQL a formato CSV listo para usar.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Database className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Multi-Base de Datos</CardTitle>
                <CardDescription>
                  Compatible con PostgreSQL, MySQL, SQLite y más bases de datos populares.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Documentación Clara</CardTitle>
                <CardDescription>Documentación completa con ejemplos de código y casos de uso.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="get-started" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Comenzar es muy fácil</h3>
            <p className="text-muted-foreground text-lg">Tres simples pasos para empezar a usar SQLtoCSV API</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <CardTitle>Configura tu conexión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configura los parámetros de conexión a tu base de datos en tu backend.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <CardTitle>Envía tu consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Realiza una petición POST con tu consulta SQL a nuestro endpoint.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <CardTitle>Recibe el CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Obtén los resultados de tu consulta en formato CSV listo para descargar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Database className="h-6 w-6 text-accent" />
              <span className="font-semibold">SQLtoCSV API</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#terms" className="hover:text-foreground transition-colors">
                Términos de Servicio
              </Link>
              <Link href="#privacy" className="hover:text-foreground transition-colors">
                Política de Privacidad
              </Link>
              <Link href="#support" className="hover:text-foreground transition-colors">
                Soporte
              </Link>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 SQLtoCSV API. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
