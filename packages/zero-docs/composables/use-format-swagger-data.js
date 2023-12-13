// /////////////////////////////////////////////////////////////////////// Notes
// -----------------------------------------------------------------------------
// anything referenced in comments in Title Case is part of the Swagger
//  specification and details can be found in the docs
//  https://spec.openapis.org/oas/v2.0

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////// getSecurityHeaders
const getSecurityHeaders = (security, securityDefinitions) => {
  console.log('security ', security)
  let securityHeaders = false
  if (security) {
    security.forEach(securityRequirements => {
      Object.keys(securityRequirements).forEach(securityScheme => {
        // console.log('securityDefinitions[securityScheme] ', securityDefinitions[securityScheme])
        const name = securityDefinitions[securityScheme].name
        securityHeaders
          ? securityHeaders[name] = {
              type: securityDefinitions[securityScheme].type,
              description: securityDefinitions[securityScheme].description,
              required: true
            }
          : securityHeaders = {}
            securityHeaders[name] = {
            type: securityDefinitions[securityScheme].type,
            description: securityDefinitions[securityScheme].description,
            required: true
            }
      })
    })
  }
  console.log('securityHeaders ', securityHeaders)
  return securityHeaders
}
// //////////////////////////////////////////////////// getHeadersAndQueryParams
const getHeadersAndQueryParams = (parameters, definitions) => {
  let paramHeaders = false
  let queryParams = false
  let bodyParams = false
  let pathParams = false
  if (parameters) {
    parameters.forEach(async (param) => {
      const name = param.name
      switch (param.in) {
        case 'header':
          paramHeaders
            ? paramHeaders[name] = {
              type: param.type,
              description: param.description,
              required: param.required
            }
            : paramHeaders = {}
              paramHeaders[name] = {
                type: param.type,
                description: param.description,
                required: param.required
              }
          break
        case 'query':
          queryParams
            ? queryParams[name] = {
                type: param.type,
                description: param.description,
                required: param.required
              }
            : queryParams = {}
              queryParams[name] = {
              type: param.type,
              description: param.description,
              required: param.required
              }
          break
        case 'body':
          const type = requestTypeStringFromSchema(param.schema, definitions)
          bodyParams = {}
          bodyParams[name] = {
            type,
            description: param.description,
            required: param.required
            }
          break
        case 'path':
          pathParams
            ? pathParams[name] = {
              type: param.type,
              description: param.description,
              required: param.required
            }
            : pathParams = {}
              pathParams[name] = {
              type: param.type,
              description: param.description,
              required: param.required
              }
          break
        // other param (Parameter Object) possible value of param.in are 'formData'
      }
    })
  }
  return { paramHeaders, queryParams, bodyParams, pathParams }
}

// ///////////////////////////////////////////////// requestTypeStringFromSchema
const requestTypeStringFromSchema = (schemaObject, definitions) => {
  const createTypeString = (schema, defs) => {
    if (schema.type) {
      let typeString = Array.isArray(schema.type)
        ? schema.type.reduce((str, primitiveType, i, array) => {
          if (i === array.length - 1) {
            return str.concat(primitiveType)
          }
          return str.concat(primitiveType, ' or ')
        }, '')
        : schema.type
      if (typeString.includes('array')) {
        const itemsSchema = resolveRef(schema.items.$ref, defs) || schema.items.type
        typeof itemsSchema === 'string'
          ? typeString = typeString.concat(' of ', itemsSchema, 's')
          : typeString = typeString.concat(' of ', itemsSchema.type, 's')
      }
      return typeString
    }
  }
  // ------------- if Schema Object is $ref, resolve $ref then build type string
  if (schemaObject.$ref) {
    const resolvedSchemaRef = resolveRef(schemaObject.$ref, definitions)
    return createTypeString(resolvedSchemaRef, definitions)
  }
  // ------------------------------------------ otherwise just build type string
  return createTypeString(schemaObject, definitions)
}

// ////////////////////////////////////////////////////////////////// resolveRef
const resolveRef = (ref, definitions) => {
  if (typeof ref === 'undefined') { return false }
  const refPath = ref.slice(14).split('/')
  let refValue = refPath.reduce((value, key) => value[key], definitions)
  return refValue
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useFormatSwaggerData = (swaggerObject, definitionsSchema) => {
  const { swagger, info, host, basePath, paths, preview } = swaggerObject
  // parameters and responses are other variables that are referencable via $ref
  // using them will require updating parts of the composable
  const { definitions, parameters, responses, securityDefinitions } = definitionsSchema
  let headers
  let queryParameters
  let bodyParameters
  let pathParameters
  const responseCodes = {}
  Object.keys(paths).forEach((path) => {
    Object.keys(paths[path]).forEach(requestMethod => {
      // const pathSlug = path.slice(1)
      const requestMethodConfig = paths[path][requestMethod]
      console.log('requestMethodConfig ', requestMethodConfig)
      // ------------ overview + preview: compile header values and query params
      const { paramHeaders, queryParams, bodyParams, pathParams } = getHeadersAndQueryParams(requestMethodConfig.parameters || false, definitions)
      const securityHeaders = getSecurityHeaders(requestMethodConfig.security || false, securityDefinitions)
      headers = securityHeaders ? {...securityHeaders} : false
      headers &&= paramHeaders ? {...headers, ...paramHeaders} : headers
      queryParameters = queryParams ? {...queryParams} : false
      bodyParameters = bodyParams ? {...bodyParams} : false
      pathParameters = pathParams ? {...pathParams} : false
      Object.keys(requestMethodConfig?.responses).forEach(code => {
        const response = requestMethodConfig.responses[code]
      //   // -------------------------------- overview: compile HTTP request codes
        responseCodes[code] = response.description
      })
    })
  })
  return { overview: { headers, queryParameters, bodyParameters, pathParameters, responseCodes }, preview }
}
