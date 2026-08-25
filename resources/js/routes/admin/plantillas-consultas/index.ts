import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::index
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:18
 * @route '/admin/plantillas-consultas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/plantillas-consultas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::index
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:18
 * @route '/admin/plantillas-consultas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::index
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:18
 * @route '/admin/plantillas-consultas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::index
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:18
 * @route '/admin/plantillas-consultas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::index
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:18
 * @route '/admin/plantillas-consultas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::index
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:18
 * @route '/admin/plantillas-consultas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::index
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:18
 * @route '/admin/plantillas-consultas'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::store
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:73
 * @route '/admin/plantillas-consultas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/plantillas-consultas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::store
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:73
 * @route '/admin/plantillas-consultas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::store
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:73
 * @route '/admin/plantillas-consultas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::store
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:73
 * @route '/admin/plantillas-consultas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::store
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:73
 * @route '/admin/plantillas-consultas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::reset
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:127
 * @route '/admin/plantillas-consultas/especialidades/{especialidad}/reset'
 */
export const reset = (args: { especialidad: number | { id: number } } | [especialidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(args, options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/admin/plantillas-consultas/especialidades/{especialidad}/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::reset
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:127
 * @route '/admin/plantillas-consultas/especialidades/{especialidad}/reset'
 */
reset.url = (args: { especialidad: number | { id: number } } | [especialidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { especialidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { especialidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    especialidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        especialidad: typeof args.especialidad === 'object'
                ? args.especialidad.id
                : args.especialidad,
                }

    return reset.definition.url
            .replace('{especialidad}', parsedArgs.especialidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::reset
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:127
 * @route '/admin/plantillas-consultas/especialidades/{especialidad}/reset'
 */
reset.post = (args: { especialidad: number | { id: number } } | [especialidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::reset
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:127
 * @route '/admin/plantillas-consultas/especialidades/{especialidad}/reset'
 */
    const resetForm = (args: { especialidad: number | { id: number } } | [especialidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reset.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PlantillaConsultaController::reset
 * @see app/Http/Controllers/Admin/PlantillaConsultaController.php:127
 * @route '/admin/plantillas-consultas/especialidades/{especialidad}/reset'
 */
        resetForm.post = (args: { especialidad: number | { id: number } } | [especialidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reset.url(args, options),
            method: 'post',
        })
    
    reset.form = resetForm
const plantillasConsultas = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
reset: Object.assign(reset, reset),
}

export default plantillasConsultas