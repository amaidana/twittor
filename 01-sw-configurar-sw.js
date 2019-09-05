
// ============================================================================================================
// Configurar el Service Worker
// ============================================================================================================

// Lo primero que hay que hacer es registrar el SW en el app.js


// Lo siguiente es declarar los nombres de los caches
const STATIC_CACHE_NAME    = 'static-v1';
const DYNAMIC_CACHE_NAME   = 'dynamic-v1';
const INMUTABLE_CACHE_NAME = 'inmutable-v1';


// declarar el app shell para el cache estático - este es el corazón de la app
const STATIC_APP_SHELL = [
	'/',
	'/index.html',
	'/css/style.css',
	'/img/favicon.ico',
	'/img/avatars/hulk.jpg',
	'/img/avatars/ironman.jpg',
	'/img/avatars/spiderman.jpg',
	'/img/avatars/thor.jpg',
	'/img/avatars/wolverine.jpg',
	'/js/app.js'
];


// declarar el app shell para el cache inmutable - aqui va lo que no se va a modificar nunca
const INMUTABLE_APP_SHEL = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'/css/animate.css',
	'/js/libs/jquery.js'
];


// instalación
self.addEventListener( 'install', e => {

	// instalando el cache estático
	const staticCache = caches.open( STATIC_CACHE_NAME )
		.then( cache => cache.addAll( STATIC_APP_SHELL ) );


	// instalando el cache inmutable
	const inmutableCache = caches.open( INMUTABLE_CACHE_NAME )
		.then( cache => cache.addAll( INMUTABLE_APP_SHEL ) );


	e.waitUntil( Promise.all( [ staticCache, inmutableCache ] ) );

} );


// borrar los caches anteriores que ya no me sirven
self.addEventListener( 'activate', e => {

	const respuesta = caches.keys()
		.then( keys => {

			keys.forEach( nombreCache => {

				if( nombreCache !== STATIC_CACHE_NAME && nombreCache.includes( 'static' ) ) {

					return caches.delete( nombreCache );

				}

			} );

		} );


	e.waitUntil( respuesta );
	
} );