import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
const edit33428d84926a1bb41ad5a5eefad588c7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit33428d84926a1bb41ad5a5eefad588c7.url(options),
    method: 'get',
})

edit33428d84926a1bb41ad5a5eefad588c7.definition = {
    methods: ["get","head"],
    url: '/admin/especialidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
edit33428d84926a1bb41ad5a5eefad588c7.url = (options?: RouteQueryOptions) => {
    return edit33428d84926a1bb41ad5a5eefad588c7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
edit33428d84926a1bb41ad5a5eefad588c7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit33428d84926a1bb41ad5a5eefad588c7.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
edit33428d84926a1bb41ad5a5eefad588c7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit33428d84926a1bb41ad5a5eefad588c7.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
    const edit33428d84926a1bb41ad5a5eefad588c7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit33428d84926a1bb41ad5a5eefad588c7.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
        edit33428d84926a1bb41ad5a5eefad588c7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit33428d84926a1bb41ad5a5eefad588c7.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
        edit33428d84926a1bb41ad5a5eefad588c7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit33428d84926a1bb41ad5a5eefad588c7.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit33428d84926a1bb41ad5a5eefad588c7.form = edit33428d84926a1bb41ad5a5eefad588c7Form
    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/empresas/{empresa}/especialidades'
 */
const edit953cab207da047e1239c7434271f8369 = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit953cab207da047e1239c7434271f8369.url(args, options),
    method: 'get',
})

edit953cab207da047e1239c7434271f8369.definition = {
    methods: ["get","head"],
    url: '/admin/empresas/{empresa}/especialidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/empresas/{empresa}/especialidades'
 */
edit953cab207da047e1239c7434271f8369.url = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empresa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empresa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empresa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empresa: typeof args.empresa === 'object'
                ? args.empresa.id
                : args.empresa,
                }

    return edit953cab207da047e1239c7434271f8369.definition.url
            .replace('{empresa}', parsedArgs.empresa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/empresas/{empresa}/especialidades'
 */
edit953cab207da047e1239c7434271f8369.get = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit953cab207da047e1239c7434271f8369.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/empresas/{empresa}/especialidades'
 */
edit953cab207da047e1239c7434271f8369.head = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit953cab207da047e1239c7434271f8369.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/empresas/{empresa}/especialidades'
 */
    const edit953cab207da047e1239c7434271f8369Form = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit953cab207da047e1239c7434271f8369.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/empresas/{empresa}/especialidades'
 */
        edit953cab207da047e1239c7434271f8369Form.get = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit953cab207da047e1239c7434271f8369.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/empresas/{empresa}/especialidades'
 */
        edit953cab207da047e1239c7434271f8369Form.head = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit953cab207da047e1239c7434271f8369.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit953cab207da047e1239c7434271f8369.form = edit953cab207da047e1239c7434271f8369Form

/**
* Multiple routes resolve to \App\Http\Controllers\Admin\EmpresaEspecialidadController::edit, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `edit['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const edit = {
    '/admin/especialidades': edit33428d84926a1bb41ad5a5eefad588c7,
    '/admin/empresas/{empresa}/especialidades': edit953cab207da047e1239c7434271f8369,
}

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
const update33428d84926a1bb41ad5a5eefad588c7 = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update33428d84926a1bb41ad5a5eefad588c7.url(options),
    method: 'put',
})

update33428d84926a1bb41ad5a5eefad588c7.definition = {
    methods: ["put"],
    url: '/admin/especialidades',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
update33428d84926a1bb41ad5a5eefad588c7.url = (options?: RouteQueryOptions) => {
    return update33428d84926a1bb41ad5a5eefad588c7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
update33428d84926a1bb41ad5a5eefad588c7.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update33428d84926a1bb41ad5a5eefad588c7.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
    const update33428d84926a1bb41ad5a5eefad588c7Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update33428d84926a1bb41ad5a5eefad588c7.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
        update33428d84926a1bb41ad5a5eefad588c7Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update33428d84926a1bb41ad5a5eefad588c7.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update33428d84926a1bb41ad5a5eefad588c7.form = update33428d84926a1bb41ad5a5eefad588c7Form
    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/empresas/{empresa}/especialidades'
 */
const update953cab207da047e1239c7434271f8369 = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update953cab207da047e1239c7434271f8369.url(args, options),
    method: 'put',
})

update953cab207da047e1239c7434271f8369.definition = {
    methods: ["put"],
    url: '/admin/empresas/{empresa}/especialidades',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/empresas/{empresa}/especialidades'
 */
update953cab207da047e1239c7434271f8369.url = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empresa: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empresa: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empresa: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empresa: typeof args.empresa === 'object'
                ? args.empresa.id
                : args.empresa,
                }

    return update953cab207da047e1239c7434271f8369.definition.url
            .replace('{empresa}', parsedArgs.empresa.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/empresas/{empresa}/especialidades'
 */
update953cab207da047e1239c7434271f8369.put = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update953cab207da047e1239c7434271f8369.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/empresas/{empresa}/especialidades'
 */
    const update953cab207da047e1239c7434271f8369Form = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update953cab207da047e1239c7434271f8369.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/empresas/{empresa}/especialidades'
 */
        update953cab207da047e1239c7434271f8369Form.put = (args: { empresa: number | { id: number } } | [empresa: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update953cab207da047e1239c7434271f8369.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update953cab207da047e1239c7434271f8369.form = update953cab207da047e1239c7434271f8369Form

/**
* Multiple routes resolve to \App\Http\Controllers\Admin\EmpresaEspecialidadController::update, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `update['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const update = {
    '/admin/especialidades': update33428d84926a1bb41ad5a5eefad588c7,
    '/admin/empresas/{empresa}/especialidades': update953cab207da047e1239c7434271f8369,
}

const EmpresaEspecialidadController = { edit, update }

export default EmpresaEspecialidadController