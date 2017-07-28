'use strict';

module.exports = (() => {
  let apiEndpoint = 'https://play.dhis2.org/demo/api/26'; // default
  let generateHtmlReport = true;

  const LOG_DEBUG_MODE = 'debug';
  const ALL_AUTHORITY = 'ALL';
  const RESOURCE_TYPES = {
    OPTION_SET: 'option set',
    DATA_ELEMENT: 'data element',
    ORGANISATION_UNIT: 'organisation unit',
    DATASET: 'dataset',
    CATEGORY_COMBINATION: 'category combination',
    INDICATOR: 'indicator',
    CATEGORY_OPTION: 'category option',
    CATEGORY: 'category'
  };

  const onDebugMode = process.env.DHIS2_LOG_MODE === LOG_DEBUG_MODE;

  const isAuthorisedTo = (authority, userRoles = []) => {
    if (authority && userRoles.length > 0) {
      for (const index in userRoles) {
        const authorities = userRoles[index].authorities || [];
        if (authorities.includes(ALL_AUTHORITY) || authorities.includes(authority)) {
          return true;
        }
      }
    }

    return false;
  };

  const debug = (message) => {
    if (message && onDebugMode) {
      console.debug(message);
    }
  };

  const generateResourceTypeEndpoint = (resourceType) => {
    let endpoint = '';
    switch (resourceType) {
      case RESOURCE_TYPES.OPTION_SET:
        endpoint = apiEndpoint + '/optionSets';
        break;
      case RESOURCE_TYPES.ORGANISATION_UNIT:
        endpoint = apiEndpoint + '/organisationUnits';
        break;
      case RESOURCE_TYPES.DATA_ELEMENT:
        endpoint = apiEndpoint + '/dataElements';
        break;
      case RESOURCE_TYPES.DATASET:
        endpoint = apiEndpoint + '/dataSets';
        break;
      case RESOURCE_TYPES.CATEGORY_COMBINATION:
        endpoint = apiEndpoint + '/categoryCombos';
        break;
      case RESOURCE_TYPES.INDICATOR:
        endpoint = apiEndpoint + '/indicators';
        break;
      case RESOURCE_TYPES.CATEGORY_OPTION:
        endpoint = apiEndpoint + '/categoryOptions';
        break;
      case RESOURCE_TYPES.CATEGORY:
        endpoint = apiEndpoint + '/categories';
        break;
      default:
        throw new Error('There is no resource type defined for: ' + resourceType);
    }

    return endpoint;
  };

  return {
    resourceTypes: RESOURCE_TYPES,
    debug: debug,
    apiEndpoint: (newApiEndpoint) => {
      if (newApiEndpoint) {
        apiEndpoint = newApiEndpoint;
      } else {
        return apiEndpoint;
      }
    },
    generateHtmlReport: (generate) => {
      if (typeof generate === 'undefined') {
        return generateHtmlReport;
      } else {
        generateHtmlReport = generate;
      }
    },
    isAuthorisedToAddDataElementWith: (userRoles = []) => {
      return isAuthorisedTo('F_DATAELEMENT_PUBLIC_ADD', userRoles);
    },
    isAuthorisedToAddOrganisationUnitWith: (userRoles = []) => {
      return isAuthorisedTo('F_ORGANISATIONUNIT_ADD', userRoles);
    },
    isAuthorisedToAddOptionSetWith: (userRoles = []) => {
      return isAuthorisedTo('F_OPTIONSET_PUBLIC_ADD', userRoles);
    },
    isAuthorisedToDeleteOptionSetWith: (userRoles = []) => {
      return isAuthorisedTo('F_OPTIONSET_DELETE', userRoles);
    },
    isAuthorisedToAddDataSetWith: (userRoles = []) => {
      return isAuthorisedTo('F_DATASET_PUBLIC_ADD', userRoles);
    },
    isAuthorisedToAddCategoryComboWith: (userRoles = []) => {
      return authorityExistsInUserRoles('F_CATEGORY_COMBO_PUBLIC_ADD', userRoles);
    },
    isAuthorisedToAddCategoryOptionWith: (userRoles = []) => {
      return authorityExistsInUserRoles('F_CATEGORY_OPTION_PUBLIC_ADD', userRoles);
    },
    isAuthorisedToAddCategoryWith: (userRoles = []) => {
      return authorityExistsInUserRoles('F_CATEGORY_PUBLIC_ADD', userRoles);
    },
    initializePromiseUrlUsingWorldContext: (world, url) => {
      debug('URL: ' + url);
      debug('METHOD: ' + world.method);
      debug('REQUEST DATA: ' + JSON.stringify(world.requestData, null, 2));
      return world.axios({
        method: world.method || 'get',
        url: url,
        data: world.requestData || {},
        auth: world.authRequestObject
      });
    },
    generateUniqIds: (numberOfIds) => {
      const currentTimestamp = Math.floor(Date.now() / 100);    // 11 digits
      const ids = [];
      const numberOfIdsTemp = numberOfIds || 1;
      for (let seed = 0; seed < numberOfIdsTemp; seed++) {
        ids.push('' + (currentTimestamp - seed));
      }

      return numberOfIds ? ids : ids[0];
    },
    generateUrlForResourceType: (resourceType) => {
      return generateResourceTypeEndpoint(resourceType);
    },
    generateUrlForResourceTypeWithId: (resourceType, resourceId) => {
      const endpoint = generateResourceTypeEndpoint(resourceType);

      if (resourceId) {
        return endpoint + '/' + resourceId;
      }

      return endpoint;
    },
    generateUrlToEndpointWithParams: (resourceType, paramsDictionary = {}) => {
      let url = generateResourceTypeEndpoint(resourceType);
      if (paramsDictionary && Object.keys(paramsDictionary).length > 0) {
        url += '?';
      }

      for (const key in paramsDictionary) {
        url = url + 'filter=' + key + ':eq:' + paramsDictionary[key] + '&';
      }

      return url;
    }
  };
})();
