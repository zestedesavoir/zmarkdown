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
ln -s /path/to/this/folder/plugin.js /etc/munin/plugins/zmd_req_avg
*/

const pm2 = require('pm2')

const supportedStats = {
  status: 'Process Status',
  memory: 'RAM Consumption',
  cpu: '%CPU Consumption',
  event_loop_lag: 'Event Loop Lag (ms)',
  req_per_process: 'Request Per Process',
  req_avg: 'Avg Request Per Minute',
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

function gatherData (plist) {
  return plist.reduce((acc, job, i) => {
    let reqPerMinute = 0
    let reqSum = 0
    let loopLag = 0

    if (job.pm2_env.axm_monitor) {
      if (job.pm2_env.axm_monitor['req/min']) {
        reqPerMinute = job.pm2_env.axm_monitor['req/min'].value
      }
      if (job.pm2_env.axm_monitor['counter']) {
        reqSum = job.pm2_env.axm_monitor['counter'].value
      }
      if (job.pm2_env.axm_monitor['Loop delay']) {
        loopLag = parseFloat(job.pm2_env.axm_monitor['Loop delay'].value)
      }
    }

    const data = {
      status: job.pm2_env.status in status ? status[job.pm2_env.status] : 3,
      memory: job.monit.memory,
      cpu: job.monit.cpu,
      event_loop_lag: loopLag,
      req_per_process: reqSum,
      req_avg: reqPerMinute,
    }

    let maxMem = 0
    if (job.pm2_env.max_memory_restart) {
      maxMem = job.pm2_env.max_memory_restart
    }
    if (maxMem) data.maxMem = maxMem

    acc[`${job.name}-${job.pm_id}`] = data

    return acc
  }, {})
}


// prints a munin readable config
function printConfig (jobs) {
  console.log('graph_title zmd', supportedStats[stat]) // eslint-disable-line no-console
  console.log('graph_category zmd') // eslint-disable-line no-console

  Object.keys(jobs).forEach((jobname) => {
    console.log('%s.label %s', jobname, jobname) // eslint-disable-line no-console
    if (stat === 'status') {
      console.log('%s.critical 1', jobname) // eslint-disable-line no-console
    }
    if (stat === 'memory') {
      console.log('%s.warning %s', jobname, jobs[jobname].maxMem) // eslint-disable-line no-console
    }
  })

  pm2.disconnect()
  process.exit(0)
}

// prints a munin readable output
function printStats (jobs) {
  Object.keys(jobs).forEach((jobname) => {
    const value = jobs[jobname][stat]
    console.log('%s.value %s', jobname, value) // eslint-disable-line no-console
  })

  pm2.disconnect()
  process.exit(0)
}


function run (callback) {
  pm2.connect((err) => {
    if (err) throw err

    pm2.list((err, plist) => {
      if (err) throw err

      callback(gatherData(plist))
    })
  })
}
