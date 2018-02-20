#!/usr/bin/env node

/*
pm2 needs to be accessible from here, best is to install it globally!
If this file is executable by munin user, installing it is as easy as
symlinking it once per stats type:

ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_status
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_memory
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_cpu
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_event_loop_lag
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_req_per_process
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_avg_per_process
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_req_per_endpoint
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_avg_per_endpoint

*/

const pm2 = require('pm2')

const endpoints = ['toEPUB', 'toHTML', 'toLatex', 'toLatexDocument']

const supportedStats = {
  status: {
    graph: [
      'graph_title Process Status',
      'graph_vlabel',
    ],
    fields: (name) => [
      `${name}.label ${name}`,
      `${name}.critical 1`,
    ],
  },
  memory: {
    stack: true,
    graph: [
      'graph_title RAM Usage',
      'graph_vlabel Bytes',
      'graph_args --base 1024 --lower-limit 0',
    ],
    fields: (name) => [
      `${name}.label ${name}`,
      `${name}.draw STACK`,
    ],
  },
  cpu: {
    graph: [
      'graph_title CPU Usage',
      'graph_vlabel percent',
      'graph_args --base 1000 --lower-limit 0 --rigid',
      'graph_scale no',
    ],
    fields: (name) => `${name}.label ${name}`,
  },
  event_loop_lag: {
    graph: [
      'graph_title Event Loop Lag',
      'graph_vlabel ms',
      'graph_args --lower-limit 0',
    ],
    fields: (name) => `${name}.label ${name}`,
  },
  req_per_process: {
    stack: true,
    graph: [
      'graph_title Request Per Process',
      'graph_vlabel requests',
      'graph_args --lower-limit 0',
    ],
    fields: (name) => [
      `${name}.label ${name}`,
      `${name}.draw STACK`,
    ],
  },
  avg_per_process: {
    stack: true,
    graph: [
      'graph_title Requests Per Second Per Process',
      'graph_vlabel requests per second',
      'graph_args --lower-limit 0',
    ],
    fields: (name) => [
      `${name}.label ${name}`,
      `${name}.draw STACK`,
    ],
  },
  req_per_endpoint: {
    stack: true,
    graph: [
      'graph_title Request Per Endpoint',
      'graph_vlabel requests',
      'graph_args --lower-limit 0',
    ],
    fields: () => endpoints.map(endpoint =>
      `${endpoint}.label ${endpoint}\n${endpoint}.draw STACK`),
  },
  avg_per_endpoint: {
    stack: true,
    graph: [
      'graph_title Requests Per Second Per Endpoint',
      'graph_vlabel requests per second',
      'graph_args --lower-limit 0',
    ],
    fields: () => endpoints.map(endpoint =>
      `${endpoint}.label ${endpoint}\n${endpoint}.draw STACK`),
  },
}

const status = {
  online: 0,
  stopped: 1,
  errored: 2,
}

const pluginTypeMatcher = new RegExp(`/(.+?)_(:?${Object.keys(supportedStats).join('|')})`)
const pluginPath = process.argv[1]
const matched = pluginPath.match(pluginTypeMatcher)
if (!matched) {
  throw new Error('zmd munin plugin misconfigured: see plugin doc for help')
}

const [,, stat] = matched

if (!(supportedStats.hasOwnProperty(stat))) {
  throw new Error(
    `Invalid stat, given : ${stat}, expected one of ${JSON.stringify(supportedStats, null, 2)}.`)
}

if (process.argv.slice(-1)[0] === 'config') {
  run(printConfig)
} else {
  run(printStats)
}

function gatherData (procList) {
  let maxMem = 0

  const procs = procList.reduce((acc, proc, i) => {
    let avgPerProcess
    let reqPerProcess
    let loopLag

    if (proc.pm2_env.axm_monitor) {
      reqPerProcess = endpoints.map(endpoint =>
        parseInt(proc.pm2_env.axm_monitor[`${endpoint} counter`].value)
      ).reduce((sum, val) => sum + val, 0)
      avgPerProcess = endpoints.map(endpoint =>
        proc.pm2_env.axm_monitor[`${endpoint} rpm`].value
      ).reduce((sum, val) => sum + val, 0)

      loopLag = parseFloat(proc.pm2_env.axm_monitor['Loop delay'].value)
    }

    const data = {
      status: proc.pm2_env.status in status ? status[proc.pm2_env.status] : 3,
      memory: proc.monit.memory,
      cpu: proc.monit.cpu,
      event_loop_lag: loopLag,
      req_per_process: reqPerProcess,
      avg_per_process: avgPerProcess,
    }

    if (!maxMem && proc.pm2_env.max_memory_restart) {
      maxMem = proc.pm2_env.max_memory_restart
    }
    if (maxMem) data.maxMem = maxMem

    acc[`${proc.name}-${proc.pm_id}`] = data

    return acc
  }, {})

  const _endpoints = {
    req_per_endpoint: endpoints.reduce((acc, endpoint) => {
      acc[endpoint] = procList.reduce((sum, proc) =>
        sum + parseInt(proc.pm2_env.axm_monitor[`${endpoint} counter`].value), 0)
      return acc
    }, {}),

    avg_per_endpoint: endpoints.reduce((acc, endpoint) => {
      acc[endpoint] = procList.reduce((sum, proc) =>
        sum + parseFloat(proc.pm2_env.axm_monitor[`${endpoint} rpm`].value), 0)
      return acc
    }, {}),
  }

  return {procs, endpoints: _endpoints}
}


// prints a munin readable config
function printConfig (stats) {
  if (!supportedStats[stat]) throw new Error(`"${stat}" not configured`)
  const procs = stats.procs

  l(supportedStats[stat].graph.join('\n'))
  l('graph_category zmd')

  let output = ''
  if (['req_per_endpoint', 'avg_per_endpoint'].includes(stat)) {
    output = supportedStats[stat].fields().join('\n')
  } else {
    output = Object.keys(procs).map(job => {
      const tmp = supportedStats[stat].fields(job)
      return Array.isArray(tmp)
        ? tmp.join('\n')
        : tmp
    }).join('\n')
  }
  if (supportedStats[stat].stack) {
    output = output.replace(' STACK', ' AREA')
  }
  l(output)

  pm2.disconnect()
  process.exit(0)
}

// prints a munin readable output
function printStats (stats) {
  const procs = stats.procs

  if (['req_per_endpoint', 'avg_per_endpoint'].includes(stat)) {
    endpoints.forEach(endpoint => {
      l('%s.value %s', endpoint, stats.endpoints[stat][endpoint])
    })
  } else {
    Object.keys(procs).forEach((procName) => {
      const value = procs[procName][stat]
      l('%s.value %s', procName, value)
    })
  }

  pm2.disconnect()
  process.exit(0)
}

function run (callback) {
  pm2.connect((err) => {
    if (err) throw err

    pm2.list((err, plist) => {
      if (err) throw err

      plist = plist.filter(process => !process.name.startsWith('pm2'))

      callback(gatherData(plist))
    })
  })
}

const l = console.log // eslint-disable-line no-console
