# 🏛️ ProyectoPregrado – 

**Organización Académica | Universidad Técnica de Ambato – FISEI**
**Carrera:** Ingeniería en Software
**Área:** Gestion de Pruebas y Implantacion de Software

---

## 🎯 Propósito de la Organización

**ProyectoPregrado** es una organización académica creada como parte de un proceso de **experimentación y observación de metodologías de trabajo en ingeniería de software**.

La organización corresponde a un **grupo de control**, cuyo propósito es desarrollar las actividades académicas asignadas mediante un flujo de trabajo independiente, utilizando herramientas externas para organizar, registrar, revisar y documentar las actividades realizadas.

El trabajo se desarrolla sin utilizar la plataforma **Yura**, permitiendo que las actividades sean ejecutadas mediante un flujo de trabajo basado principalmente en **Git y GitHub**.

El objetivo no es desarrollar un producto de software como resultado principal, sino **experimentar con una forma alternativa de organizar y ejecutar las actividades académicas**, generando evidencia suficiente para posteriormente analizar el proceso y los resultados obtenidos.

---

## 🧪 Enfoque de Experimentación

ProyectoPregrado funciona como un **grupo de control dentro de la experimentación académica**.

Las actividades se realizan siguiendo las indicaciones establecidas para el trabajo académico, pero utilizando un entorno externo para gestionar el proceso.

La experimentación contempla:

* Organización de las actividades académicas.
* Registro y seguimiento de tareas.
* Creación y gestión de ramas.
* Registro de cambios mediante commits.
* Uso de Pull Requests.
* Revisión de los cambios realizados.
* Documentación del proceso.
* Generación de evidencias.
* Observación de dificultades y resultados.
* Análisis del flujo de trabajo utilizado.

El grupo mantiene un flujo de trabajo independiente, de manera que los resultados obtenidos puedan ser utilizados posteriormente para analizar el comportamiento del proceso bajo estas condiciones.

---

## 🔬 Condición del Grupo de Control

La organizacion participa en la experimentación bajo una condición diferenciada respecto a otros grupos.

El grupo **no utiliza la plataforma Yura como herramienta de trabajo** y no parte de una experiencia previa sobre su funcionamiento o interfaz. Por esta razón, las actividades se desarrollan mediante herramientas externas y un flujo de trabajo definido para esta experimentación.

Esta condición permite observar el desarrollo de las actividades desde una perspectiva independiente, evitando que el proceso esté condicionado por el uso o conocimiento previo de una plataforma determinada.

El propósito del grupo de control es, por tanto, **generar evidencia del proceso de trabajo realizado bajo estas condiciones**, para que posteriormente pueda ser analizada junto con los resultados de la experimentación.

---

## 🔄 Flujo de Trabajo Experimental

El trabajo se organiza mediante un flujo basado en Git y GitHub.

### 1. Identificación de la actividad

Se determina la actividad académica que debe ser realizada y se establece el objetivo correspondiente.

### 2. Creación de la rama

Cada actividad se desarrolla en una rama independiente:

```text
feature/nombre-de-la-actividad
fix/nombre-de-la-correccion
docs/nombre-de-la-documentacion
test/nombre-de-la-experimentacion
```

### 3. Desarrollo de la actividad

Se ejecuta la actividad correspondiente siguiendo las indicaciones académicas establecidas.

El objetivo es registrar no solamente el resultado, sino también el proceso seguido para alcanzarlo.

### 4. Registro mediante commits

Los cambios realizados se registran mediante commits descriptivos y consistentes.

Se mantiene la siguiente convención:

```text
feat: nueva actividad o funcionalidad
fix: corrección de un problema
docs: modificación de documentación
test: prueba o validación experimental
refactor: reorganización sin cambio funcional
chore: mantenimiento o configuración
```

Ejemplos:

```text
feat: agrega actividad experimental
test: valida flujo de trabajo
docs: documenta resultados de la actividad
fix: corrige documentación de la experimentación
chore: actualiza configuración del repositorio
```

### 5. Pull Request

Al finalizar una actividad, los cambios pueden ser presentados mediante un Pull Request.

El Pull Request permite registrar:

* Actividad realizada.
* Descripción del trabajo.
* Cambios efectuados.
* Evidencias obtenidas.
* Observaciones durante la ejecución.

### 6. Revisión

Los cambios son revisados antes de integrarse a la rama principal.

La revisión permite verificar:

* Cumplimiento de la actividad.
* Organización de los cambios.
* Convención de commits.
* Documentación.
* Evidencias obtenidas.

### 7. Integración

Una vez revisados los cambios, estos se integran en `main`.

```text
Actividad
    │
    ▼
Creación de rama
    │
    ▼
Ejecución
    │
    ▼
Commit
    │
    ▼
Pull Request
    │
    ▼
Revisión
    │
    ▼
Integración
    │
    ▼
Evidencia y análisis
```

---

## 🧾 Estándar de Commits

Para mantener la trazabilidad de las actividades realizadas, **MyCSW utiliza una convención estructurada para los mensajes de commit**.

La estructura general es:

```text
tipo: descripción breve del cambio
```

### Tipos permitidos

| Tipo       | Uso                                                          |
| ---------- | ------------------------------------------------------------ |
| `feat`     | Incorporación de una nueva actividad o elemento experimental |
| `fix`      | Corrección de errores o problemas                            |
| `docs`     | Modificaciones de documentación                              |
| `test`     | Pruebas o validaciones                                       |
| `refactor` | Reorganización sin modificar el propósito                    |
| `chore`    | Configuración y mantenimiento                                |

### Reglas

* Utilizar un tipo válido.
* Separar el tipo de la descripción mediante `:`.
* Mantener la descripción breve y específica.
* Describir claramente la acción realizada.
* Evitar mensajes ambiguos.
* Mantener una relación clara entre el commit y la actividad realizada.

### Ejemplos

```text
feat: agrega actividad de experimentacion
test: valida proceso de integracion
docs: documenta resultados obtenidos
fix: corrige evidencia de la actividad
chore: actualiza estructura del repositorio
```

---

## 📌 Gestión de Actividades

Las actividades pueden registrarse mediante **GitHub Issues**, permitiendo mantener una relación entre la actividad académica y las acciones realizadas dentro del repositorio.

El flujo de trazabilidad es:

```text
Issue
  ↓
Rama
  ↓
Commits
  ↓
Pull Request
  ↓
Revisión
  ↓
Merge
  ↓
Evidencia
  ↓
Análisis
```

Esto permite identificar qué actividad fue realizada, qué cambios se efectuaron y qué resultados fueron obtenidos durante la experimentación.

---

## 🔍 Experimentación

La experimentación se desarrolla bajo una condición de trabajo independiente de la plataforma Yura.

El grupo utiliza GitHub como entorno para gestionar las actividades, registrar los cambios y generar evidencia del proceso.

Durante la experimentación se busca observar aspectos como:

* Organización de las actividades.
* Facilidad para registrar el trabajo realizado.
* Trazabilidad de las modificaciones.
* Organización mediante ramas.
* Gestión de cambios mediante commits.
* Revisión mediante Pull Requests.
* Documentación de las actividades.
* Tiempo y esfuerzo requerido para completar las actividades.
* Dificultades encontradas durante el proceso.
* Evidencias generadas.

La experimentación permitirá disponer de información objetiva sobre el proceso seguido por el grupo bajo las condiciones establecidas.

---

## 📊 Resultados Esperados

Los resultados esperados se encuentran relacionados principalmente con la **observación y análisis del proceso de trabajo**.

Se espera obtener:

* Evidencia de las actividades realizadas.
* Registro organizado de los cambios.
* Trazabilidad entre actividades, ramas, commits y Pull Requests.
* Aplicación consistente del estándar de commits.
* Evidencia del proceso de revisión e integración.
* Registro de dificultades encontradas.
* Observaciones sobre el flujo de trabajo utilizado.
* Información que pueda ser utilizada posteriormente para el análisis de la experimentación.

**El resultado principal no será un producto de software terminado, sino la evidencia y el análisis del proceso experimentado.**

---

## 🔧 Herramientas Utilizadas

| Categoría              | Herramienta              |
| ---------------------- | ------------------------ |
| Control de versiones   | **Git**                  |
| Repositorio            | **GitHub**               |
| Gestión de actividades | **GitHub Issues**        |
| Integración            | **GitHub Pull Requests** |
| Documentación          | **Markdown**             |
| Gestión de ramas       | **Git**                  |

Las herramientas son utilizadas como soporte para la experimentación y para la generación de evidencia del proceso.

---

## 📚 Naturaleza Académica

**MyCSW** se desarrolla con fines académicos dentro de la **Universidad Técnica de Ambato – Facultad de Ingeniería en Sistemas, Electrónica e Industrial**.

La organización constituye un espacio de experimentación destinado a aplicar los conocimientos adquiridos durante las actividades académicas y observar el comportamiento de un flujo de trabajo gestionado mediante herramientas externas.

El trabajo realizado se centra en **experimentar, registrar, observar y analizar**, más que en la construcción de un producto de software como objetivo principal.

---

## 🧾 Licencia

Este proyecto se desarrolla con fines **educativos y académicos** dentro de la carrera de **Ingeniería en Software** de la Universidad Técnica de Ambato.

