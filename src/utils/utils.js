import { SpinalBmsDevice, SpinalBmsNetwork } from "spinal-model-bmsnetwork";
import {
  SpinalGraph,
  SpinalGraphService,
} from "spinal-env-viewer-graph-service";
import { PCVueListenerModel } from "spinal-model-pcvue";

export async function getOrgan(nodeId, contextId) {
  const network = await getNetwork(nodeId);

  if (!network) return;

  return network.getParents([SpinalBmsNetwork.relationName]).then((parents) => {
    const found = parents.find((el) => {
      if (el && el.contextIds) {
        return el.contextIds[contextId];
      }
    });

    if (found) {
      return found.getElement();
    }
  });
}

export async function startMonitoring(
  graph,
  contextId,
  networkId,
  model,
  monitorInfo
) {
  try {
    const context = SpinalGraphService.getRealNode(contextId);
    const network = SpinalGraphService.getRealNode(networkId);

    model = model || (await this.getModel(network));

    if (model && model != -1) {
      if (monitorInfo.saveTimeSeries)
        model.saveTimeSeries.set(monitorInfo.saveTimeSeries);
      if (monitorInfo.interval) model.interval.set(monitorInfo.interval);

      model.listen.set(true);
    } else {
      if (!monitorInfo) {
        monitorInfo = {
          listen: true,
          saveTimeSeries: true,
          interval: 300000,
        };
      }
      const organ = await getOrgan(network.getId().get(), contextId);

      const spinalListener = new PCVueListenerModel(
        graph,
        context,
        network,
        organ,
        monitorInfo
      );
      network.info.add_attr({
        listener: new Ptr(spinalListener),
      });

      return spinalListener;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function stopMonitoring(networkId, model) {
  try {
    if (!model) {
      const realNode = SpinalGraphService.getRealNode(networkId);
      model = await this.getModel(realNode);
    }

    if (model != -1) model.listen.set(false);
  } catch (error) {}
}

export async function getModel(realNode) {
  if (realNode.info.listener) {
    return new Promise((resolve, reject) => {
      realNode.info.listener.load((data) => resolve(data));
    });
  } else {
    return Promise.resolve(-1);
  }
}

export async function getNetwork(nodeId) {
  const realNode = SpinalGraphService.getRealNode(nodeId);
  const type = realNode.getType().get();

  if (type === SpinalBmsNetwork.nodeTypeName) return realNode;

  if (type === SpinalBmsDevice.nodeTypeName) {
    const [network] = await realNode.getParents([SpinalBmsDevice.relationName]);
    return network;
  }
}

export async function getNetworkStructure() {
  const contexts = getContexts();
  const promises = contexts.map(async (context) => {
    context.networks = await getNetworks(context.id);
    return context;
  });

  return Promise.all(promises);
}

function getContexts() {
  const contexts = SpinalGraphService.getContextWithType("Network");
  return contexts.map((el) => el.info.get());
}

async function getNetworks(contextId) {
  const networks = await SpinalGraphService.getChildrenInContext(
    contextId,
    contextId
  );

  const promises = networks.map(async (el) => {
    const network = el.get();
    network.devices = await getDevices(contextId, network.id);
    return network;
  });

  return Promise.all(promises);

  // return SpinalGraphService.findInContext(contextId, contextId, (node) => {
  //   if (node.getType().get() === SpinalBmsNetwork.nodeTypeName) {
  //     SpinalGraphService._addNode(node);
  //     return true;
  //   }
  //   return false;
  // })
  //   .then((networks) => {
  //     const promises = networks.map(async (networkRef) => {
  //       const network = networkRef.get();
  //       network.devices = await getDevices(contextId, network.id);
  //       return network;
  //     });

  //     return Promise.all(promises);
  //   })
  //   .catch((err) => {
  //     return [];
  //   });
}

async function getDevices(contextId, networkId) {
  const devices = await SpinalGraphService.getChildrenInContext(
    networkId,
    contextId
    // SpinalBmsDevice.relationName
  );
  return devices.map((el) => el.get());
}
