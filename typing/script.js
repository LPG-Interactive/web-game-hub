const words_en = [
  "network","system","memory","binary","compile","module","script","server","client","buffer","thread","packet","latency","stack","debug","input","output","device","array","object","function","variable","constant","loop","condition","class","method","property","inheritance","encapsulation","polymorphism","abstraction","algorithm","data","structure","queue","list","tree","graph","node","edge","vertex","hash","map","set","sort","search","index","database","query","table","row","column","primary","foreign","key","join","select","insert","update","delete","transaction","commit","rollback","lock","deadlock","cache","session","cookie","request","response","header","body","status","error","exception","try","catch","finally","throw","promise","async","await","callback","event","listener","handler","emit","bind","call","apply","prototype","closure","scope","context","global","local","block","import","export","package","dependency","version","build","test","deploy","release","branch","merge","pull","push","clone","fork","commit","diff","patch","review","issue","bug","feature","refactor","optimize","performance","security","encryption","authentication","authorization","token","api","rest","graphql","endpoint","resource","rate","limit","throttle","timeout","interval","schedule","cron","job","thread","process","fork","spawn","child","parent","signal","pipe","stream","buffer","read","write","open","close","connect","disconnect","listen","accept","send","receive","broadcast","multicast","unicast","route","gateway","firewall","proxy","dns","domain","host","port","protocol","tcp","udp","ip","mac","address","subnet","mask","gateway","router","switch","hub","bridge","modem","bandwidth","throughput","latency","jitter","packet","loss","collision","broadcast","storm","loop","back","interface","adapter","driver","firmware","hardware","software","virtual","physical","cloud","container","docker","kubernetes","orchestrator","service","microservice","monolith","scalable","distributed","replica","shard","partition","load","balancer","failover","redundancy","backup","restore","snapshot","archive","log","monitor","alert","metric","dashboard","visualize","analyze","report","audit","compliance","policy","governance","risk","threat","vulnerability","exploit","patch","update","upgrade","downgrade","rollback","release","cycle","lifecycle","agile","scrum","kanban","sprint","standup","retrospective","planning","grooming","backlog","story","task","bug","issue","ticket","priority","severity","estimate","velocity","burndown","chart","milestone","goal","objective","key","result","kpi","okr","roadmap","timeline","deadline","deliverable","stakeholder","sponsor","customer","user","persona","journey","experience","interface","usability","accessibility","responsive","adaptive","mobile","desktop","web","native","hybrid","cross","platform","framework","library","toolkit","sdk","api","cli","gui","ide","editor","terminal","shell","command","script","automation","integration","continuous","delivery","deployment","pipeline","workflow","job","stage","step","trigger","hook","event","listener","handler","callback","promise","async","await","thread","process","fork","spawn","signal","pipe","stream","buffer","read","write","open","close"
]

const words_es = [
  "red","sistema","memoria","binario","compilar","modulo","script","servidor","cliente","buffer","hilo","paquete","latencia","pila","depurar","entrada","salida","dispositivo","arreglo","objeto","funcion","variable","constante","bucle","condicion","clase","metodo","propiedad","herencia","encapsulamiento","polimorfismo","abstraccion","algoritmo","dato","estructura","cola","lista","arbol","grafo","nodo","arista","vertice","hash","mapa","conjunto","ordenar","buscar","indice","base","datos","consulta","tabla","fila","columna","primaria","foranea","clave","unir","seleccionar","insertar","actualizar","eliminar","transaccion","confirmar","revertir","bloqueo","interbloqueo","cache","sesion","cookie","peticion","respuesta","cabecera","cuerpo","estado","error","excepcion","intentar","capturar","finalmente","lanzar","promesa","asincrono","esperar","callback","evento","escuchador","manejador","emitir","enlazar","llamar","aplicar","prototipo","clausura","alcance","contexto","global","local","bloque","importar","exportar","paquete","dependencia","version","compilar","probar","desplegar","lanzar","rama","fusionar","extraer","empujar","clonar","bifurcar","confirmar","diferencia","parche","revision","problema","bug","caracteristica","refactorizar","optimizar","rendimiento","seguridad","encriptacion","autenticacion","autorizacion","token","api","rest","graphql","punto","recurso","limite","tasa","acelerar","tiempo","espera","intervalo","programar","cron","trabajo","hilo","proceso","bifurcar","generar","hijo","padre","senal","tuberia","flujo","buffer","leer","escribir","abrir","cerrar","conectar","desconectar","escuchar","aceptar","enviar","recibir","difundir","multidifusion","unidifusion","ruta","puerta","enlace","cortafuegos","proxy","dns","dominio","host","puerto","protocolo","tcp","udp","ip","mac","direccion","subred","mascara","puerta","enlace","router","switch","hub","puente","modem","ancho","banda","rendimiento","latencia","jitter","paquete","perdida","colision","tormenta","bucle","interfaz","adaptador","controlador","firmware","hardware","software","virtual","fisico","nube","contenedor","docker","kubernetes","orquestador","servicio","microservicio","monolito","escalable","distribuido","replica","fragmento","particion","balanceador","carga","conmutacion","redundancia","respaldo","restaurar","instantanea","archivo","registro","monitorear","alerta","metrica","tablero","visualizar","analizar","reporte","auditoria","cumplimiento","politica","gobernanza","riesgo","amenaza","vulnerabilidad","explotar","parche","actualizar","mejorar","degradar","revertir","lanzamiento","ciclo","vida","agil","scrum","kanban","sprint","reunion","retrospectiva","planificacion","refinamiento","pendiente","historia","tarea","bug","problema","ticket","prioridad","severidad","estimacion","velocidad","grafica","meta","objetivo","resultado","kpi","okr","hoja","ruta","cronograma","plazo","entregable","interesado","patrocinador","cliente","usuario","persona","viaje","experiencia","interfaz","usabilidad","accesibilidad","responsivo","adaptativo","movil","escritorio","web","nativo","hibrido","multiplataforma","framework","libreria","herramienta","sdk","api","cli","gui","ide","editor","terminal","shell","comando","script","automatizacion","integracion","continua","entrega","despliegue","pipeline","flujo","trabajo","etapa","paso","disparador","gancho","evento","escuchador","manejador","callback","promesa","asincrono","esperar","hilo","proceso","bifurcar","generar","senal","tuberia","flujo","buffer","leer","escribir","abrir","cerrar"
]

let words = []
let currentWord = ''
let wordCount = 0
let startTime = null

const wordEl = document.getElementById('word')
const input = document.getElementById('input')
const stats = document.getElementById('stats')
const langSelect = document.getElementById('lang')
const startBtn = document.getElementById('start-btn')
const languageSelectDiv = document.getElementById('language-select')
const gameAreaDiv = document.getElementById('game-area')

function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)]
  wordEl.textContent = currentWord
  input.value = ''
}

function updateStats() {
  const elapsedSec = (Date.now() - startTime) / 1000
  const wpm = Math.round((wordCount / elapsedSec) * 60)
  stats.textContent = `Words: ${wordCount} | Time: ${elapsedSec.toFixed(1)}s | WPM: ${wpm}`
}

input.addEventListener('input', () => {
  if (input.value === currentWord) {
    wordCount++
    if (!startTime) startTime = Date.now()
    setNewWord()
    updateStats()
  }
})

startBtn.addEventListener('click', () => {
  const lang = langSelect.value
  words = lang === 'en' ? words_en : words_es
  wordCount = 0
  startTime = null
  stats.textContent = `Words: 0 | Time: 0s | WPM: 0`
  languageSelectDiv.style.display = 'none'
  gameAreaDiv.style.display = ''
  input.value = ''
  input.focus()
  setNewWord()
})

langSelect.addEventListener('keydown', e => {
  if (e.key === 'Enter') startBtn.click()
})