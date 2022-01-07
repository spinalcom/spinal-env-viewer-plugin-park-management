import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE,
} from "spinal-env-viewer-graph-service";
import { ROOM_TYPE } from "spinal-env-viewer-context-geographic-service/build/constants";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
import * as lodash from "lodash";

export async function linkDevicesToRoom(
  geographicContextId,
  geographicStartId,
  pcVueDevices,
  attributes
) {
  const promises = [
    getRooms(geographicContextId, geographicStartId),
    getEndpoints(pcVueDevices),
  ];

  return Promise.all(promises).then(([rooms, endpoints]) => {
    const roomsMap = getMap(rooms, attributes.rooms);
    const endpointsMap = getMap(endpoints, attributes.endpoints);
    return linkMaps(roomsMap, endpointsMap);
  });

  function linkMaps(roomsMap, endpointsMap) {
    const promises = Object.keys(roomsMap).map((key) => {
      if (endpointsMap[key]) {
        const roomData = roomsMap[key];
        const endpointData = endpointsMap[key];

        try {
          return SpinalGraphService.addChild(
            roomData.id,
            endpointData.id,
            SpinalBmsEndpoint.relationName,
            SPINAL_RELATION_PTR_LST_TYPE
          );
        } catch (error) {}
      }
    });

    return Promise.all(promises);
  }

  // // const devices =
  // //   pcVueDevices && Array.isArray(pcVueDevices) && pcVueDevices.length > 0
  // //     ? pcVueDevices
  // //     : await getDevices(pcvueContextId, pcvueStartId);
  // // const map = getMap(rooms, devices, func);
  // // const promises = Array.from(map.keys()).map((key) => {
  // //   const ids = map.get(key);
  // //   return createNodeLinks(key, ids);
  // // });
  // // return Promise.all(promises);
}

// async function createNodeLinks(parentId, childrenIds) {
//   try {
//     const promises = childrenIds.map((childId) =>
//       SpinalGraphService.addChild(
//         parentId,
//         childId,
//         SpinalBmsDevice.relationName,
//         SPINAL_RELATION_PTR_LST_TYPE
//       )
//     );

//     return Promise.all(promises);
//   } catch (error) {
//     return false;
//   }
// }

function getRooms(geographicContextId, geographicStartId) {
  return findInContext(geographicContextId, geographicStartId, ROOM_TYPE);
}

function getEndpoints(devices) {
  if (!Array.isArray(devices)) devices = [devices];

  const promises = devices.map(({ id }) =>
    SpinalGraphService.getChildren(id, [SpinalBmsEndpoint.relationName])
  );

  return Promise.all(promises).then((result) => {
    return lodash.flattenDeep(result).map((el) => el.get());
  });
}

function findInContext(contextId, startId, type) {
  return SpinalGraphService.findInContext(startId, contextId, (node) => {
    if (node.getType().get() === type) {
      SpinalGraphService._addNode(node);
      return true;
    }
    return false;
  })
    .then((result) => {
      return result.map((el) => el.get());
    })
    .catch((err) => {
      return [];
    });
}

function getMap(listes, { attributeName, useFunction, functions: { code } }) {
  const obj = {};

  listes.forEach((element) => {
    const value = element[attributeName];
    const attr = useFunction ? eval(`(${code})(value)`) : value;
    if (attr) {
      obj[attr] = element;
    }
  });

  return obj;
}

// async function getRoomAttribute(roomInfo, attributeName, callback) {
//   const attr = await getSpinalAttribute(roomInfo.id, attributeName, callback);
//   if (attr) return attr;

//   return getBimAttribute();
// }

// async function getSpinalAttribute(nodeId, attributeName, callback) {
//   const splitted = attributeName.split("/");
//   const attrCategory = splitted.length > 1 ? splitted[0] : "default";
//   const attrLabel = splitted.length <= 1 ? splitted[0] : splitted[1];
//   const node = SpinalGraphService.getRealNode(nodeId);

//   try {
//     const attr = await serviceDocumentation.findOneAttributeInCategory(
//       node,
//       attrCategory,
//       attrLabel
//     );
//     const value = attr && attr.value ? attr.value.get() : undefined;
//     return typeof callback !== "undefined"
//       ? eval(`(${callback})(value)`)
//       : value;
//   } catch (error) {
//     return undefined;
//   }
// }

// async function getBimAttribute(roomInfo, attributeName) {
//   const splitted = attributeName.split("/");
//   const attrCategory = splitted.length > 1 ? splitted[0] : "default";
//   const attrLabel = splitted.length <= 1 ? splitted[0] : splitted[1];
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// function getMap(floors, devices, func) {
//   const floorsCopy = Object.assign([], floors);
//   const devicesCopy = Object.assign([], devices);
//   const map = new Map();

//   while (floorsCopy.length > 0 && devicesCopy.length > 0) {
//     const floor = floorsCopy.pop();
//     const indexes = getIndexes(floor.name, devicesCopy, func);

//     const res = [];
//     for (let idx of indexes) {
//       const item = devicesCopy[idx];
//       res.push(item.id);
//     }
//     map.set(floor.id, res);
//   }

//   return map;
// }

// function getIndexes(floorName, devices, callback) {
//   return devices
//     .map((el, idx) =>
//       eval(`(${callback})(floorName, el.name)`) ? idx : undefined
//     )
//     .filter((el) => typeof el !== "undefined");
// }

// function getDevices(pcvueContextId, pcvueStartId) {
//   return findInContext(
//     pcvueContextId,
//     pcvueStartId,
//     SpinalBmsEndpoint.nodeTypeName
//   );
// }

// function getEndpointsMap(endpoints, attributes) {
//   const {
//     attributeName,
//     useFunction,
//     functions: { code },
//   } = attributes;

//   const callback = useFunction ? code : undefined;
//   const obj = {};

//   const promises = endpoints.map((element) => {
//     const attr = await getSpinalAttribute(element.id, attributeName, callback);
//     if (attr) obj[attr] = element;
//     else obj[element.name] = element;
//   });

//   return Promise.all(promises).then((result) => {
//     return obj;
//   });
// }

// function getRoomsMap(rooms, attributes) {
//   const {
//     attributeName,
//     useFunction,
//     functions: { code },
//   } = attributes;

//   const callback = useFunction ? code : undefined;
//   const obj = {};

//   const promises = rooms.map((element) => {
//     const attr = await getRoomAttribute(element, attributeName, callback);
//     if (attr) obj[attr] = element;
//     else obj[element.name] = element;
//   });

//   return Promise.all(promises).then((result) => {
//     return obj;
//   });
// }
