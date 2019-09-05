
// ============================================================================================================
// Archivo auxiliar del Service Worker
// Me permite transladar lógica de programación hacia este lado
// ============================================================================================================


// guardar en el cache dinámico
function actualizaCacheDinamico( dynamicCache, request, response ) {

	if( response.ok ) { // si hay información para almacenar en el cache

		return caches.open( dynamicCache )
			.then( cache => {

				// almacenar en el cache la request
				cache.put( request, response.clone() );

				return response.clone();

			} );

	} else { // si no hay información - fallo el cache y la red

		return response;

	}

}