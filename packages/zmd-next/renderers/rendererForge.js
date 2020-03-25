module.exports = (base, defaultPluginList, postProcessorList) => config => {
  // Use defaults
  if (!config.disabledPlugins) config.disabledPlugins = {
    internal: [],
    meta: [],
    inline: []
  };
  if (!config.extraPlugins) config.extraPlugins = {}

  // Create an unified list of plugins
  const pluginList   = Object.assign({}, defaultPluginList, config.extraPlugins)
  const pluginNames  = Object.keys(pluginList)

  const postProcessorNames = Object.keys(postProcessorList)

  const filteredPlugins = pluginNames
    .filter(name => !config.disabledPlugins.internal.includes(name))

  const filteredPostProcessors = postProcessorNames
    .filter(name => Boolean(config.postProcessors[name]))

  for (const pluginName of filteredPlugins) {
    // If config is given, use it
    if (typeof config[pluginName] !== 'undefined') {
      base.use(pluginList[pluginName], config[pluginName])
    } else {
      base.use(pluginList[pluginName])
    }
  }

  // Add postprocessors, that are handled differently
  for (const postProcessorName of filteredPostProcessors) {
    if (typeof config.postProcessors[postProcessorName] === "boolean") {
      base.use(postProcessorList[postProcessorName])
    } else {
      base.use(postProcessorList[postProcessorName], config.postProcessors[postProcessorName])
    }
  }

  return base
}