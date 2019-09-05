
// ============================================================================================================
// Cache con network fallback
// ============================================================================================================


// importaciones
importScripts( 'js/sw-utils.js' );


const STATIC_CACHE_NAME    = 'static-v1';
const DYNAMIC_CACHE_NAME   = 'dynamic-v1';
const INMUTABLE_CACHE_NAME = 'inmutable-v1';


const STATIC_APP_SHELL = [
	//'/',
	'index.html',
	'css/style.css',
	'img/favicon.ico',
	'img/avatars/hulk.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/spiderman.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/wolverine.jpg',
	'js/app.js'
];


const INMUTABLE_APP_SHEL = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'css/animate.css',
	'js/libs/jquery.js'
];


self.addEventListener( 'install', e => {

	// instalando el cache estático
	const staticCache = caches.open( STATIC_CACHE_NAME )
		.then( cache => cache.addAll( STATIC_APP_SHELL ) );


	// instalando el cache inmutable
	const inmutableCache = caches.open( INMUTABLE_CACHE_NAME )
		.then( cache => cache.addAll( INMUTABLE_APP_SHEL ) );


	e.waitUntil( Promise.all( [ staticCache, inmutableCache ] ) );

} );


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


// network fallback - busca en el cache y si no existe se va a la red
self.addEventListener( 'fetch', e => {

	const respuesta = caches.match( e.request )
		.then( resp => {

			if( resp ) { // si existe la respuesta en el cache

				return resp; // regresa la respuesta del cache

			} else { // si no existe la respuesta en el cache

				// console.log( e.request.url );

				// va a buscar el recurso a la red
				return fetch( e.request )
					.then( newResp => {

						return actualizaCacheDinamico( DYNAMIC_CACHE_NAME, e.request, newResp );

					} );

			}

		} );

	e.respondWith( respuesta );

} );