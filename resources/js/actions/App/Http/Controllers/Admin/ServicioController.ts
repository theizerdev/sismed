import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ServicioController::index
 * @see app/Http/Controllers/Admin/ServicioController.php:17
 * @route '/admin/servicios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/servicios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ServicioController::index
 * @see app/Http/Controllers/Admin/ServicioController.php:17
 * @route '/admin/servicios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ServicioController::index
 * @see app/Http/Controllers/Admin/ServicioController.php:17
 * @route '/admin/servicios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ServicioController::index
 * @see app/Http/Controllers/Admin/ServicioController.php:17
 * @route '/admin/servicios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ServicioController::index
 * @see app/Http/Controllers/Admin/ServicioController.php:17
 * @route '/admin/servicios'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ServicioController::index
 * @see app/Http/Controllers/Admin/ServicioController.php:17
 * @route '/admin/servicios'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ServicioController::index
 * @see app/Http/Controllers/Admin/ServicioController.php:17
 * @route '/admin/servicios'
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
* @see \App\Http\Controllers\Admin\ServicioController::store
 * @see app/Http/Controllers/Admin/ServicioController.php:76
 * @route '/admin/servicios'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/servicios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ServicioController::store
 * @see app/Http/Controllers/Admin/ServicioController.php:76
 * @route '/admin/servicios'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ServicioController::store
 * @see app/Http/Controllers/Admin/ServicioController.php:76
 * @route '/admin/servicios'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ServicioController::store
 * @see app/Http/Controllers/Admin/ServicioController.php:76
 * @route '/admin/servicios'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ServicioController::store
 * @see app/Http/Controllers/Admin/ServicioController.php:76
 * @route '/admin/servicios'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\ServicioController::update
 * @see app/Http/Controllers/Admin/ServicioController.php:124
 * @route '/admin/servicios/{servicio}'
 */
export const update = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/servicios/{servicio}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ServicioController::update
 * @see app/Http/Controllers/Admin/ServicioController.php:124
 * @route '/admin/servicios/{servicio}'
 */
update.url = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { servicio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { servicio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    servicio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        servicio: typeof args.servicio === 'object'
                ? args.servicio.id
                : args.servicio,
                }

    return update.definition.url
            .replace('{servicio}', parsedArgs.servicio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ServicioController::update
 * @see app/Http/Controllers/Admin/ServicioController.php:124
 * @route '/admin/servicios/{servicio}'
 */
update.put = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ServicioController::update
 * @see app/Http/Controllers/Admin/ServicioController.php:124
 * @route '/admin/servicios/{servicio}'
 */
    const updateForm = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ServicioController::update
 * @see app/Http/Controllers/Admin/ServicioController.php:124
 * @route '/admin/servicios/{servicio}'
 */
        updateForm.put = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\ServicioController::toggleStatus
 * @see app/Http/Controllers/Admin/ServicioController.php:146
 * @route '/admin/servicios/{servicio}/toggle-status'
 */
export const toggleStatus = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

toggleStatus.definition = {
    methods: ["patch"],
    url: '/admin/servicios/{servicio}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\ServicioController::toggleStatus
 * @see app/Http/Controllers/Admin/ServicioController.php:146
 * @route '/admin/servicios/{servicio}/toggle-status'
 */
toggleStatus.url = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { servicio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { servicio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    servicio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        servicio: typeof args.servicio === 'object'
                ? args.servicio.id
                : args.servicio,
                }

    return toggleStatus.definition.url
            .replace('{servicio}', parsedArgs.servicio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ServicioController::toggleStatus
 * @see app/Http/Controllers/Admin/ServicioController.php:146
 * @route '/admin/servicios/{servicio}/toggle-status'
 */
toggleStatus.patch = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\ServicioController::toggleStatus
 * @see app/Http/Controllers/Admin/ServicioController.php:146
 * @route '/admin/servicios/{servicio}/toggle-status'
 */
    const toggleStatusForm = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ServicioController::toggleStatus
 * @see app/Http/Controllers/Admin/ServicioController.php:146
 * @route '/admin/servicios/{servicio}/toggle-status'
 */
        toggleStatusForm.patch = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\Admin\ServicioController::destroy
 * @see app/Http/Controllers/Admin/ServicioController.php:158
 * @route '/admin/servicios/{servicio}'
 */
export const destroy = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/servicios/{servicio}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ServicioController::destroy
 * @see app/Http/Controllers/Admin/ServicioController.php:158
 * @route '/admin/servicios/{servicio}'
 */
destroy.url = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { servicio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { servicio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    servicio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        servicio: typeof args.servicio === 'object'
                ? args.servicio.id
                : args.servicio,
                }

    return destroy.definition.url
            .replace('{servicio}', parsedArgs.servicio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ServicioController::destroy
 * @see app/Http/Controllers/Admin/ServicioController.php:158
 * @route '/admin/servicios/{servicio}'
 */
destroy.delete = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ServicioController::destroy
 * @see app/Http/Controllers/Admin/ServicioController.php:158
 * @route '/admin/servicios/{servicio}'
 */
    const destroyForm = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ServicioController::destroy
 * @see app/Http/Controllers/Admin/ServicioController.php:158
 * @route '/admin/servicios/{servicio}'
 */
        destroyForm.delete = (args: { servicio: number | { id: number } } | [servicio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ServicioController = { index, store, update, toggleStatus, destroy }

export default ServicioController