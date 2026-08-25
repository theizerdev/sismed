import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::index
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/especialidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::index
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::index
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::index
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::index
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::index
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::index
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:18
 * @route '/admin/especialidades'
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
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/especialidades',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\EmpresaEspecialidadController::update
 * @see app/Http/Controllers/Admin/EmpresaEspecialidadController.php:53
 * @route '/admin/especialidades'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
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
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const especialidades = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
}

export default especialidades