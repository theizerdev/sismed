import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import atencionB38d10 from './atencion'
/**
* @see \App\Http\Controllers\Admin\CitaController::index
 * @see app/Http/Controllers/Admin/CitaController.php:33
 * @route '/admin/citas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/citas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::index
 * @see app/Http/Controllers/Admin/CitaController.php:33
 * @route '/admin/citas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::index
 * @see app/Http/Controllers/Admin/CitaController.php:33
 * @route '/admin/citas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CitaController::index
 * @see app/Http/Controllers/Admin/CitaController.php:33
 * @route '/admin/citas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::index
 * @see app/Http/Controllers/Admin/CitaController.php:33
 * @route '/admin/citas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::index
 * @see app/Http/Controllers/Admin/CitaController.php:33
 * @route '/admin/citas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CitaController::index
 * @see app/Http/Controllers/Admin/CitaController.php:33
 * @route '/admin/citas'
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
* @see \App\Http\Controllers\Admin\CitaController::slots
 * @see app/Http/Controllers/Admin/CitaController.php:162
 * @route '/admin/citas/slots'
 */
export const slots = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slots.url(options),
    method: 'get',
})

slots.definition = {
    methods: ["get","head"],
    url: '/admin/citas/slots',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::slots
 * @see app/Http/Controllers/Admin/CitaController.php:162
 * @route '/admin/citas/slots'
 */
slots.url = (options?: RouteQueryOptions) => {
    return slots.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::slots
 * @see app/Http/Controllers/Admin/CitaController.php:162
 * @route '/admin/citas/slots'
 */
slots.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: slots.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CitaController::slots
 * @see app/Http/Controllers/Admin/CitaController.php:162
 * @route '/admin/citas/slots'
 */
slots.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: slots.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::slots
 * @see app/Http/Controllers/Admin/CitaController.php:162
 * @route '/admin/citas/slots'
 */
    const slotsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: slots.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::slots
 * @see app/Http/Controllers/Admin/CitaController.php:162
 * @route '/admin/citas/slots'
 */
        slotsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: slots.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CitaController::slots
 * @see app/Http/Controllers/Admin/CitaController.php:162
 * @route '/admin/citas/slots'
 */
        slotsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: slots.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    slots.form = slotsForm
/**
* @see \App\Http\Controllers\Admin\CitaController::store
 * @see app/Http/Controllers/Admin/CitaController.php:180
 * @route '/admin/citas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/citas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::store
 * @see app/Http/Controllers/Admin/CitaController.php:180
 * @route '/admin/citas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::store
 * @see app/Http/Controllers/Admin/CitaController.php:180
 * @route '/admin/citas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::store
 * @see app/Http/Controllers/Admin/CitaController.php:180
 * @route '/admin/citas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::store
 * @see app/Http/Controllers/Admin/CitaController.php:180
 * @route '/admin/citas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\CitaController::update
 * @see app/Http/Controllers/Admin/CitaController.php:257
 * @route '/admin/citas/{cita}'
 */
export const update = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/citas/{cita}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::update
 * @see app/Http/Controllers/Admin/CitaController.php:257
 * @route '/admin/citas/{cita}'
 */
update.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return update.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::update
 * @see app/Http/Controllers/Admin/CitaController.php:257
 * @route '/admin/citas/{cita}'
 */
update.put = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::update
 * @see app/Http/Controllers/Admin/CitaController.php:257
 * @route '/admin/citas/{cita}'
 */
    const updateForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::update
 * @see app/Http/Controllers/Admin/CitaController.php:257
 * @route '/admin/citas/{cita}'
 */
        updateForm.put = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CitaController::mover
 * @see app/Http/Controllers/Admin/CitaController.php:307
 * @route '/admin/citas/{cita}/mover'
 */
export const mover = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: mover.url(args, options),
    method: 'patch',
})

mover.definition = {
    methods: ["patch"],
    url: '/admin/citas/{cita}/mover',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::mover
 * @see app/Http/Controllers/Admin/CitaController.php:307
 * @route '/admin/citas/{cita}/mover'
 */
mover.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return mover.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::mover
 * @see app/Http/Controllers/Admin/CitaController.php:307
 * @route '/admin/citas/{cita}/mover'
 */
mover.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: mover.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::mover
 * @see app/Http/Controllers/Admin/CitaController.php:307
 * @route '/admin/citas/{cita}/mover'
 */
    const moverForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: mover.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::mover
 * @see app/Http/Controllers/Admin/CitaController.php:307
 * @route '/admin/citas/{cita}/mover'
 */
        moverForm.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: mover.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    mover.form = moverForm
/**
* @see \App\Http\Controllers\Admin\CitaController::updateEstado
 * @see app/Http/Controllers/Admin/CitaController.php:339
 * @route '/admin/citas/{cita}/estado'
 */
export const updateEstado = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateEstado.url(args, options),
    method: 'patch',
})

updateEstado.definition = {
    methods: ["patch"],
    url: '/admin/citas/{cita}/estado',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::updateEstado
 * @see app/Http/Controllers/Admin/CitaController.php:339
 * @route '/admin/citas/{cita}/estado'
 */
updateEstado.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return updateEstado.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::updateEstado
 * @see app/Http/Controllers/Admin/CitaController.php:339
 * @route '/admin/citas/{cita}/estado'
 */
updateEstado.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateEstado.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::updateEstado
 * @see app/Http/Controllers/Admin/CitaController.php:339
 * @route '/admin/citas/{cita}/estado'
 */
    const updateEstadoForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateEstado.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::updateEstado
 * @see app/Http/Controllers/Admin/CitaController.php:339
 * @route '/admin/citas/{cita}/estado'
 */
        updateEstadoForm.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateEstado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateEstado.form = updateEstadoForm
/**
* @see \App\Http\Controllers\Admin\CitaController::updatePago
 * @see app/Http/Controllers/Admin/CitaController.php:427
 * @route '/admin/citas/{cita}/pago'
 */
export const updatePago = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePago.url(args, options),
    method: 'patch',
})

updatePago.definition = {
    methods: ["patch"],
    url: '/admin/citas/{cita}/pago',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::updatePago
 * @see app/Http/Controllers/Admin/CitaController.php:427
 * @route '/admin/citas/{cita}/pago'
 */
updatePago.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return updatePago.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::updatePago
 * @see app/Http/Controllers/Admin/CitaController.php:427
 * @route '/admin/citas/{cita}/pago'
 */
updatePago.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePago.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::updatePago
 * @see app/Http/Controllers/Admin/CitaController.php:427
 * @route '/admin/citas/{cita}/pago'
 */
    const updatePagoForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePago.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::updatePago
 * @see app/Http/Controllers/Admin/CitaController.php:427
 * @route '/admin/citas/{cita}/pago'
 */
        updatePagoForm.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePago.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePago.form = updatePagoForm
/**
* @see \App\Http\Controllers\Admin\CitaController::destroy
 * @see app/Http/Controllers/Admin/CitaController.php:448
 * @route '/admin/citas/{cita}'
 */
export const destroy = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/citas/{cita}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::destroy
 * @see app/Http/Controllers/Admin/CitaController.php:448
 * @route '/admin/citas/{cita}'
 */
destroy.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return destroy.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::destroy
 * @see app/Http/Controllers/Admin/CitaController.php:448
 * @route '/admin/citas/{cita}'
 */
destroy.delete = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::destroy
 * @see app/Http/Controllers/Admin/CitaController.php:448
 * @route '/admin/citas/{cita}'
 */
    const destroyForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::destroy
 * @see app/Http/Controllers/Admin/CitaController.php:448
 * @route '/admin/citas/{cita}'
 */
        destroyForm.delete = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappReminder
 * @see app/Http/Controllers/Admin/CitaController.php:456
 * @route '/admin/citas/{cita}/send-whatsapp-reminder'
 */
export const sendWhatsappReminder = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappReminder.url(args, options),
    method: 'post',
})

sendWhatsappReminder.definition = {
    methods: ["post"],
    url: '/admin/citas/{cita}/send-whatsapp-reminder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappReminder
 * @see app/Http/Controllers/Admin/CitaController.php:456
 * @route '/admin/citas/{cita}/send-whatsapp-reminder'
 */
sendWhatsappReminder.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return sendWhatsappReminder.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappReminder
 * @see app/Http/Controllers/Admin/CitaController.php:456
 * @route '/admin/citas/{cita}/send-whatsapp-reminder'
 */
sendWhatsappReminder.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappReminder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappReminder
 * @see app/Http/Controllers/Admin/CitaController.php:456
 * @route '/admin/citas/{cita}/send-whatsapp-reminder'
 */
    const sendWhatsappReminderForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendWhatsappReminder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappReminder
 * @see app/Http/Controllers/Admin/CitaController.php:456
 * @route '/admin/citas/{cita}/send-whatsapp-reminder'
 */
        sendWhatsappReminderForm.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendWhatsappReminder.url(args, options),
            method: 'post',
        })
    
    sendWhatsappReminder.form = sendWhatsappReminderForm
/**
* @see \App\Http\Controllers\Admin\CitaController::uploadResultado
 * @see app/Http/Controllers/Admin/CitaController.php:589
 * @route '/admin/citas/{cita}/resultados'
 */
export const uploadResultado = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadResultado.url(args, options),
    method: 'post',
})

uploadResultado.definition = {
    methods: ["post"],
    url: '/admin/citas/{cita}/resultados',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::uploadResultado
 * @see app/Http/Controllers/Admin/CitaController.php:589
 * @route '/admin/citas/{cita}/resultados'
 */
uploadResultado.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return uploadResultado.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::uploadResultado
 * @see app/Http/Controllers/Admin/CitaController.php:589
 * @route '/admin/citas/{cita}/resultados'
 */
uploadResultado.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadResultado.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::uploadResultado
 * @see app/Http/Controllers/Admin/CitaController.php:589
 * @route '/admin/citas/{cita}/resultados'
 */
    const uploadResultadoForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadResultado.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::uploadResultado
 * @see app/Http/Controllers/Admin/CitaController.php:589
 * @route '/admin/citas/{cita}/resultados'
 */
        uploadResultadoForm.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadResultado.url(args, options),
            method: 'post',
        })
    
    uploadResultado.form = uploadResultadoForm
/**
* @see \App\Http\Controllers\Admin\CitaController::deleteResultado
 * @see app/Http/Controllers/Admin/CitaController.php:633
 * @route '/admin/citas/resultados/{archivo}'
 */
export const deleteResultado = (args: { archivo: number | { id: number } } | [archivo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteResultado.url(args, options),
    method: 'delete',
})

deleteResultado.definition = {
    methods: ["delete"],
    url: '/admin/citas/resultados/{archivo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::deleteResultado
 * @see app/Http/Controllers/Admin/CitaController.php:633
 * @route '/admin/citas/resultados/{archivo}'
 */
deleteResultado.url = (args: { archivo: number | { id: number } } | [archivo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { archivo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { archivo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    archivo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        archivo: typeof args.archivo === 'object'
                ? args.archivo.id
                : args.archivo,
                }

    return deleteResultado.definition.url
            .replace('{archivo}', parsedArgs.archivo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::deleteResultado
 * @see app/Http/Controllers/Admin/CitaController.php:633
 * @route '/admin/citas/resultados/{archivo}'
 */
deleteResultado.delete = (args: { archivo: number | { id: number } } | [archivo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteResultado.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::deleteResultado
 * @see app/Http/Controllers/Admin/CitaController.php:633
 * @route '/admin/citas/resultados/{archivo}'
 */
    const deleteResultadoForm = (args: { archivo: number | { id: number } } | [archivo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteResultado.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::deleteResultado
 * @see app/Http/Controllers/Admin/CitaController.php:633
 * @route '/admin/citas/resultados/{archivo}'
 */
        deleteResultadoForm.delete = (args: { archivo: number | { id: number } } | [archivo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteResultado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteResultado.form = deleteResultadoForm
/**
* @see \App\Http\Controllers\Admin\CitaController::updateEstadoServicio
 * @see app/Http/Controllers/Admin/CitaController.php:647
 * @route '/admin/citas/{cita}/estado-servicio'
 */
export const updateEstadoServicio = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateEstadoServicio.url(args, options),
    method: 'patch',
})

updateEstadoServicio.definition = {
    methods: ["patch"],
    url: '/admin/citas/{cita}/estado-servicio',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::updateEstadoServicio
 * @see app/Http/Controllers/Admin/CitaController.php:647
 * @route '/admin/citas/{cita}/estado-servicio'
 */
updateEstadoServicio.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return updateEstadoServicio.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::updateEstadoServicio
 * @see app/Http/Controllers/Admin/CitaController.php:647
 * @route '/admin/citas/{cita}/estado-servicio'
 */
updateEstadoServicio.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateEstadoServicio.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::updateEstadoServicio
 * @see app/Http/Controllers/Admin/CitaController.php:647
 * @route '/admin/citas/{cita}/estado-servicio'
 */
    const updateEstadoServicioForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateEstadoServicio.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::updateEstadoServicio
 * @see app/Http/Controllers/Admin/CitaController.php:647
 * @route '/admin/citas/{cita}/estado-servicio'
 */
        updateEstadoServicioForm.patch = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateEstadoServicio.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateEstadoServicio.form = updateEstadoServicioForm
/**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappResultados
 * @see app/Http/Controllers/Admin/CitaController.php:663
 * @route '/admin/citas/{cita}/send-whatsapp-resultados'
 */
export const sendWhatsappResultados = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappResultados.url(args, options),
    method: 'post',
})

sendWhatsappResultados.definition = {
    methods: ["post"],
    url: '/admin/citas/{cita}/send-whatsapp-resultados',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappResultados
 * @see app/Http/Controllers/Admin/CitaController.php:663
 * @route '/admin/citas/{cita}/send-whatsapp-resultados'
 */
sendWhatsappResultados.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return sendWhatsappResultados.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappResultados
 * @see app/Http/Controllers/Admin/CitaController.php:663
 * @route '/admin/citas/{cita}/send-whatsapp-resultados'
 */
sendWhatsappResultados.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendWhatsappResultados.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappResultados
 * @see app/Http/Controllers/Admin/CitaController.php:663
 * @route '/admin/citas/{cita}/send-whatsapp-resultados'
 */
    const sendWhatsappResultadosForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendWhatsappResultados.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CitaController::sendWhatsappResultados
 * @see app/Http/Controllers/Admin/CitaController.php:663
 * @route '/admin/citas/{cita}/send-whatsapp-resultados'
 */
        sendWhatsappResultadosForm.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendWhatsappResultados.url(args, options),
            method: 'post',
        })
    
    sendWhatsappResultados.form = sendWhatsappResultadosForm
/**
* @see \App\Http\Controllers\Admin\PreconsultaAdminController::generarPreconsulta
 * @see app/Http/Controllers/Admin/PreconsultaAdminController.php:93
 * @route '/admin/citas/{cita}/generar-preconsulta'
 */
export const generarPreconsulta = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarPreconsulta.url(args, options),
    method: 'post',
})

generarPreconsulta.definition = {
    methods: ["post"],
    url: '/admin/citas/{cita}/generar-preconsulta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PreconsultaAdminController::generarPreconsulta
 * @see app/Http/Controllers/Admin/PreconsultaAdminController.php:93
 * @route '/admin/citas/{cita}/generar-preconsulta'
 */
generarPreconsulta.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return generarPreconsulta.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PreconsultaAdminController::generarPreconsulta
 * @see app/Http/Controllers/Admin/PreconsultaAdminController.php:93
 * @route '/admin/citas/{cita}/generar-preconsulta'
 */
generarPreconsulta.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generarPreconsulta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PreconsultaAdminController::generarPreconsulta
 * @see app/Http/Controllers/Admin/PreconsultaAdminController.php:93
 * @route '/admin/citas/{cita}/generar-preconsulta'
 */
    const generarPreconsultaForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generarPreconsulta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PreconsultaAdminController::generarPreconsulta
 * @see app/Http/Controllers/Admin/PreconsultaAdminController.php:93
 * @route '/admin/citas/{cita}/generar-preconsulta'
 */
        generarPreconsultaForm.post = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generarPreconsulta.url(args, options),
            method: 'post',
        })
    
    generarPreconsulta.form = generarPreconsultaForm
/**
* @see \App\Http\Controllers\Admin\ConsultaMedicaController::atencion
 * @see app/Http/Controllers/Admin/ConsultaMedicaController.php:133
 * @route '/admin/citas/{cita}/atencion'
 */
export const atencion = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: atencion.url(args, options),
    method: 'get',
})

atencion.definition = {
    methods: ["get","head"],
    url: '/admin/citas/{cita}/atencion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConsultaMedicaController::atencion
 * @see app/Http/Controllers/Admin/ConsultaMedicaController.php:133
 * @route '/admin/citas/{cita}/atencion'
 */
atencion.url = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cita: typeof args.cita === 'object'
                ? args.cita.id
                : args.cita,
                }

    return atencion.definition.url
            .replace('{cita}', parsedArgs.cita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConsultaMedicaController::atencion
 * @see app/Http/Controllers/Admin/ConsultaMedicaController.php:133
 * @route '/admin/citas/{cita}/atencion'
 */
atencion.get = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: atencion.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConsultaMedicaController::atencion
 * @see app/Http/Controllers/Admin/ConsultaMedicaController.php:133
 * @route '/admin/citas/{cita}/atencion'
 */
atencion.head = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: atencion.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConsultaMedicaController::atencion
 * @see app/Http/Controllers/Admin/ConsultaMedicaController.php:133
 * @route '/admin/citas/{cita}/atencion'
 */
    const atencionForm = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: atencion.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConsultaMedicaController::atencion
 * @see app/Http/Controllers/Admin/ConsultaMedicaController.php:133
 * @route '/admin/citas/{cita}/atencion'
 */
        atencionForm.get = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: atencion.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConsultaMedicaController::atencion
 * @see app/Http/Controllers/Admin/ConsultaMedicaController.php:133
 * @route '/admin/citas/{cita}/atencion'
 */
        atencionForm.head = (args: { cita: number | { id: number } } | [cita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: atencion.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    atencion.form = atencionForm
const citas = {
    index: Object.assign(index, index),
slots: Object.assign(slots, slots),
store: Object.assign(store, store),
update: Object.assign(update, update),
mover: Object.assign(mover, mover),
updateEstado: Object.assign(updateEstado, updateEstado),
updatePago: Object.assign(updatePago, updatePago),
destroy: Object.assign(destroy, destroy),
sendWhatsappReminder: Object.assign(sendWhatsappReminder, sendWhatsappReminder),
uploadResultado: Object.assign(uploadResultado, uploadResultado),
deleteResultado: Object.assign(deleteResultado, deleteResultado),
updateEstadoServicio: Object.assign(updateEstadoServicio, updateEstadoServicio),
sendWhatsappResultados: Object.assign(sendWhatsappResultados, sendWhatsappResultados),
generarPreconsulta: Object.assign(generarPreconsulta, generarPreconsulta),
atencion: Object.assign(atencion, atencionB38d10),
}

export default citas