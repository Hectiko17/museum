import { ref } from 'vue'

export interface Museo {
  id: number
  nombre: string
  provincia: string
  municipio: string
  gmail: string
  telefono: string
  direccion: string
  descripcion?: string
}

export interface Municipio {
  nombre: string
  museos: Museo[]
}

export interface Provincia {
  nombre: string
  municipios: Municipio[]
}

// Datos de Cuba
export const provincias: Provincia[] = [
  {
    nombre: 'Pinar del Río',
    municipios: []
  },
  {
    nombre: 'Artemisa',
    municipios: []
  },
  {
    nombre: 'La Habana',
    municipios: []
  },
  {
    nombre: 'Mayabeque',
    municipios: []
  },
  {
    nombre: 'Matanzas',
    municipios: []
  },
  {
    nombre: 'Villa Clara',
    municipios: []
  },
  {
    nombre: 'Cienfuegos',
    municipios: []
  },
  {
    nombre: 'Sancti Spíritus',
    municipios: []
  },
  {
    nombre: 'Ciego de Ávila',
    municipios: []
  },
  {
    nombre: 'Camagüey',
    municipios: []
  },
  {
    nombre: 'Las Tunas',
    municipios: [
      {
        nombre: 'Las Tunas',
        museos: [
          {
            id: 1,
            nombre: 'Museo Provincial Mayor General Vicente García González',
            provincia: 'Las Tunas',
            municipio: 'Las Tunas',
            gmail: 'museovicente@cultura.cu',
            telefono: '+53 31 34 8012',
            direccion: 'Calle Francisco Varona No. 2, entre Colón y Lico Cruz, Las Tunas',
            descripcion: 'Museo provincial con importantes colecciones históricas y culturales.'
          },
          {
            id: 2,
            nombre: 'Museo Memorial Mártires de Barbados',
            provincia: 'Las Tunas',
            municipio: 'Las Tunas',
            gmail: 'museobarbados@cultura.cu',
            telefono: '+53 31 34 6745',
            direccion: 'Calle Lucas Ortiz No. 15, entre Ángel Guardia y Francisco Vega, Las Tunas',
            descripcion: 'Memorial dedicado a las víctimas del trágico accidente de Barbados.'
          }
        ]
      },
      {
        nombre: 'Puerto Padre',
        museos: [
          {
            id: 3,
            nombre: 'Museo de Historia Municipal de Puerto Padre',
            provincia: 'Las Tunas',
            municipio: 'Puerto Padre',
            gmail: 'museopuertopadre@cultura.cu',
            telefono: '+53 31 51 3290',
            direccion: 'Calle 24 de Febrero No. 8, esquina Maceo, Puerto Padre, Las Tunas',
            descripcion: 'Museo que recoge la historia del municipio Puerto Padre.'
          }
        ]
      },
      {
        nombre: 'Amancio',
        museos: []
      },
      {
        nombre: 'Colombia',
        museos: []
      },
      {
        nombre: 'Jesús Menéndez',
        museos: []
      },
      {
        nombre: 'Jobabo',
        museos: []
      },
      {
        nombre: 'Majibacoa',
        museos: []
      },
      {
        nombre: 'Manatí',
        museos: []
      }
    ]
  },
  {
    nombre: 'Holguín',
    municipios: []
  },
  {
    nombre: 'Granma',
    municipios: []
  },
  {
    nombre: 'Santiago de Cuba',
    municipios: []
  },
  {
    nombre: 'Guantánamo',
    municipios: []
  },
  {
    nombre: 'Isla de la Juventud',
    municipios: []
  }
]

// Función para obtener todos los museos
export const getAllMuseos = (): Museo[] => {
  const todos: Museo[] = []
  provincias.forEach(provincia => {
    provincia.municipios.forEach(municipio => {
      municipio.museos.forEach(museo => {
        todos.push(museo)
      })
    })
  })
  return todos
}

// Función para buscar museos por provincia
export const getMuseosByProvincia = (provinciaNombre: string): Museo[] => {
  const provincia = provincias.find(p => p.nombre === provinciaNombre)
  if (!provincia) return []
  
  const museos: Museo[] = []
  provincia.municipios.forEach(municipio => {
    municipio.museos.forEach(museo => {
      museos.push(museo)
    })
  })
  return museos
}

// Función para buscar museos por municipio
export const getMuseosByMunicipio = (provinciaNombre: string, municipioNombre: string): Museo[] => {
  const provincia = provincias.find(p => p.nombre === provinciaNombre)
  if (!provincia) return []
  
  const municipio = provincia.municipios.find(m => m.nombre === municipioNombre)
  return municipio ? municipio.museos : []
}

// Función para buscar un museo por ID
export const getMuseoById = (id: number): Museo | undefined => {
  const todos = getAllMuseos()
  return todos.find(m => m.id === id)
}